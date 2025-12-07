const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Import token blacklist (will be populated when routes are loaded)
let tokenBlacklist = new Set();

const auth = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is properly configured
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Validate token format
    if (!token || token.length < 10) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Additional token validation
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type.'
      });
    }

    // Validate required fields in token
    if (!decoded.userId || !decoded.username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      });
    }

    // Get user from database with additional security checks
    const [rows] = await db.promise().query(
      'SELECT id, username, fullname, created_at FROM users WHERE id = ? AND username = ?',
      [decoded.userId, decoded.username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    const user = rows[0];

    // Additional security: Check if user account is still valid
    if (!user.id || !user.username) {
      return res.status(401).json({
        success: false,
        message: 'Account access denied.'
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      fullname: user.fullname
    };

    next();
  } catch (error) {
    // Only log unexpected errors, not token expiration (which is normal)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        tokenExpired: true
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Log unexpected errors only
    console.error('Auth middleware unexpected error:', error.message);

    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

module.exports = auth;