/* eslint-disable react-refresh/only-export-components */
// File: src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await loginApi(credentials);
      
      // Extract token and user data from response
      const { token: authToken, user: userData } = response;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      // Update state
      setToken(authToken);
      setUser(userData);

      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await registerApi(userData);
      
      // Extract token and user data from response
      const { token: authToken, user: registeredUser } = response;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(registeredUser));

      // Update state
      setToken(authToken);
      setUser(registeredUser);

      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    setError(null);

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    // Call logout function (redirects to login)
    logoutApi();
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;