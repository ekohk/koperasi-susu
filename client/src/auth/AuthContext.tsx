import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  fullname: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Configure axios defaults and setup interceptors
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user info
      verifyToken();

      // Setup axios interceptor for automatic logout on 401
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401 && token) {
            // Check if token is expired
            const isTokenExpired = error.response?.data?.tokenExpired === true;

            // Token is invalid or expired, logout user
            logout();

            // Only show alert if token expired (not for wrong credentials)
            if (isTokenExpired && window.location.pathname !== '/login') {
              // Show a simple alert since we can't import Swal in this context
              setTimeout(() => {
                alert('Sesi Anda telah berakhir. Silakan login kembali.');
              }, 100);
            }
          }
          return Promise.reject(error);
        }
      );

      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;

        // Store token in localStorage
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        setLastActivity(Date.now()); // Reset activity on login

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      // Call logout API to blacklist token
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Session timeout: Track user activity and auto-logout after 10 minutes of inactivity
  useEffect(() => {
    if (!token || !user) return;

    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Check for inactivity every 30 seconds
    const checkInactivity = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= IDLE_TIMEOUT) {
        console.log('Session timeout due to inactivity');
        logout();
      }
    }, 30000); // Check every 30 seconds

    // Update last activity time on user interactions
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Listen to user activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      clearInterval(checkInactivity);
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [token, user, lastActivity]);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
