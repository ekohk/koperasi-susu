const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple rate limiting store (in production, use Redis)
const loginAttempts = new Map();

// Rate limiting middleware for login
const loginRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const attempts = loginAttempts.get(ip);

  if (now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (attempts.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.'
    });
  }

  attempts.count++;
  next();
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginRateLimit, [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be 6-100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Check if user exists
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    // Check if JWT_SECRET is properly configured
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Generate JWT token with additional claims (expires in 30 minutes)
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
        type: 'access'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30m', // Token expires in 30 minutes
        algorithm: 'HS256'
      }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          fullname: user.fullname
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscore'),
  body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be 6-100 characters'),
  body('fullname')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { username, password, fullname } = req.body;

    // Check if username already exists
    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username sudah digunakan' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.promise().query(
      'INSERT INTO users (username, password, fullname) VALUES (?, ?, ?)',
      [username, hashedPassword, fullname]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        username: req.user.username,
        fullname: req.user.fullname
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Simple token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

// @route   POST /api/auth/logout
// @desc    Logout user and blacklist token
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    // Add token to blacklist
    tokenBlacklist.add(token);

    // Clean up old tokens periodically (simple cleanup)
    if (tokenBlacklist.size > 10000) {
      tokenBlacklist.clear();
    }

    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password directly (for local development)
// @access  Public
router.post('/reset-password', [
  body('username').notEmpty().withMessage('Username is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { username, newPassword } = req.body;

    // Check if user exists
    const [users] = await db.promise().query(
      'SELECT id, username, fullname FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Username tidak ditemukan'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password directly
    await db.promise().query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );

    res.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru Anda.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Export blacklist for use in auth middleware
router.tokenBlacklist = tokenBlacklist;

module.exports = router;