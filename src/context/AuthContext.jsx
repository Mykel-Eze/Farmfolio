// File: src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
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

        console.log('Initializing auth...', { storedToken: !!storedToken, storedUser: !!storedUser });

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log('Auth initialized from storage');
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

      console.log('Attempting login...');
      const response = await loginApi(credentials);
      console.log('Login response:', response);
      
      // Handle different response structures
      let authToken, userData;
      
      // Check if response has token and user directly
      if (response.token && response.user) {
        authToken = response.token;
        userData = response.user;
      } 
      // Or if they're nested
      else if (response.data?.token && response.data?.user) {
        authToken = response.data.token;
        userData = response.data.user;
      }
      // Or if the entire response is the user data with token
      else if (response.id && response.email) {
        // Response might be just user data, look for token elsewhere
        userData = response;
        authToken = response.token || response.accessToken || response.authToken;
      }
      // If response only has token, create basic user object
      else if (response.token) {
        console.log('Response has token but no user data, creating user from credentials');
        authToken = response.token;
        // Try to decode token to get user info, or create basic user object
        try {
          // Decode JWT token (basic decode, without verification)
          const base64Url = authToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const tokenData = JSON.parse(jsonPayload);
          console.log('Decoded token data:', tokenData);
          
          // Create user object from token data
          userData = {
            id: tokenData.sub || tokenData.userId || tokenData.id || credentials.email,
            email: tokenData.email || credentials.email,
            firstName: tokenData.firstName || tokenData.given_name || 'User',
            lastName: tokenData.lastName || tokenData.family_name || '',
            name: tokenData.name || credentials.email.split('@')[0],
          };
        } catch (e) {
          console.warn('Could not decode token, creating basic user object', e);
          // Fallback to basic user object from credentials
          userData = {
            id: credentials.email,
            email: credentials.email,
            firstName: credentials.email.split('@')[0],
            lastName: '',
            name: credentials.email.split('@')[0],
          };
        }
      }
      // Fallback - try to extract from response
      else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response from server');
      }

      if (!authToken) {
        console.error('No token found in response');
        throw new Error('No authentication token received');
      }

      console.log('Login successful, storing data...', { hasToken: !!authToken, hasUser: !!userData });

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      // Update state
      setToken(authToken);
      setUser(userData);

      console.log('Auth state updated');

      return { success: true, data: { token: authToken, user: userData } };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Attempting registration...');
      const response = await registerApi(userData);
      console.log('Register response:', response);
      
      // Handle different response structures
      let authToken, registeredUser;
      
      if (response.token && response.user) {
        authToken = response.token;
        registeredUser = response.user;
      } else if (response.data?.token && response.data?.user) {
        authToken = response.data.token;
        registeredUser = response.data.user;
      } else if (response.id && response.email) {
        registeredUser = response;
        authToken = response.token || response.accessToken || response.authToken;
      } else if (response.token) {
        console.log('Response has token but no user data, creating user from registration data');
        authToken = response.token;
        // Try to decode token or use registration data
        try {
          const base64Url = authToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const tokenData = JSON.parse(jsonPayload);
          console.log('Decoded token data:', tokenData);
          
          registeredUser = {
            id: tokenData.sub || tokenData.userId || tokenData.id || userData.email,
            email: tokenData.email || userData.email,
            firstName: tokenData.firstName || userData.firstName,
            lastName: tokenData.lastName || userData.lastName,
            companyName: userData.companyName,
            name: tokenData.name || `${userData.firstName} ${userData.lastName}`,
          };
        } catch (e) {
          console.warn('Could not decode token, using registration data', e);
          registeredUser = {
            id: userData.email,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            companyName: userData.companyName,
            name: `${userData.firstName} ${userData.lastName}`,
          };
        }
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response from server');
      }

      if (!authToken) {
        console.error('No token found in response');
        throw new Error('No authentication token received');
      }

      console.log('Registration successful, storing data...');

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(registeredUser));

      // Update state
      setToken(authToken);
      setUser(registeredUser);

      return { success: true, data: { token: authToken, user: registeredUser } };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out...');
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
  const isAuthenticated = !!token && !!user;

  console.log('Auth state:', { isAuthenticated, hasToken: !!token, hasUser: !!user, loading });

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;