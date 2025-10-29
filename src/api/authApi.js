/* eslint-disable no-useless-catch */
// File: src/api/authApi.js

import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Authentication API Service
 * Handles user registration and login
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.confirmPassword - Password confirmation
 * @param {number} userData.userCategoryId - User category ID
 * @param {string} userData.companyName - Company name
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @returns {Promise} Response with user data
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} Response with auth token and user data
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user (client-side only)
 * Clears local storage
 */
export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

export default {
  register,
  login,
  logout,
};