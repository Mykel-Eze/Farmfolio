/* eslint-disable no-useless-catch */
// File: src/api/userCategoriesApi.js

import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * User Categories API Service
 * Handles user category operations (for registration)
 */

/**
 * Get all user categories
 * @returns {Promise} Array of user categories
 */
export const getUserCategories = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_CATEGORIES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user category by ID
 * @param {number} id - Category ID
 * @returns {Promise} Category data
 */
export const getUserCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_CATEGORY_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new user category (Admin only)
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.categoryName - Category name
 * @returns {Promise} Created category data
 */
export const createUserCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER_CATEGORIES, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user category (Admin only)
 * @param {number} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} Updated category data
 */
export const updateUserCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.USER_CATEGORY_BY_ID(id), categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user category (Admin only)
 * @param {number} id - Category ID
 * @returns {Promise} Success response
 */
export const deleteUserCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.USER_CATEGORY_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserCategories,
  getUserCategoryById,
  createUserCategory,
  updateUserCategory,
  deleteUserCategory,
};