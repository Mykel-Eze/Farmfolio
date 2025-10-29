// File: src/api/axiosConfig.js

import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For multipart/form-data requests, let browser set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        originalError: error,
      });
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Redirect to login
      window.location.href = '/login';
      
      return Promise.reject({
        message: ERROR_MESSAGES.AUTH_ERROR,
        originalError: error,
      });
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      return Promise.reject({
        message: ERROR_MESSAGES.NOT_FOUND,
        originalError: error,
      });
    }

    // Handle validation errors (400)
    if (error.response.status === 400) {
      return Promise.reject({
        message: error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
        errors: error.response.data?.errors,
        originalError: error,
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.response.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
      status: error.response.status,
      originalError: error,
    });
  }
);

// Helper function for retry logic with exponential backoff
export const retryRequest = async (fn, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.message === ERROR_MESSAGES.NETWORK_ERROR) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Helper function to create FormData from object
export const createFormData = (data, files = null) => {
  const formData = new FormData();

  // Add all data fields
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        // Handle arrays (like CategoryIds)
        data[key].forEach(item => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  // Add files if provided
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  }

  return formData;
};

// Helper function to build query string
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      if (Array.isArray(params[key])) {
        params[key].forEach(item => query.append(key, item));
      } else {
        query.append(key, params[key]);
      }
    }
  });

  return query.toString();
};

export default axiosInstance;