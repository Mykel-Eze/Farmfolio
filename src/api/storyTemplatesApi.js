/* eslint-disable no-useless-catch */
// File: src/api/storyTemplatesApi.js

import axiosInstance, { createFormData } from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Story Templates API Service
 * Handles story template operations
 */

/**
 * Get all story templates
 * @returns {Promise} Array of story templates
 */
export const getStoryTemplates = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.STORY_TEMPLATES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get story template by ID
 * @param {number} id - Template ID
 * @returns {Promise} Template data
 */
export const getStoryTemplateById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.STORY_TEMPLATE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get favorite story templates
 * @returns {Promise} Array of favorite templates
 */
export const getFavoriteTemplates = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.STORY_TEMPLATE_FAVORITES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle favorite status of a template
 * @param {number} id - Template ID
 * @returns {Promise} Success response
 */
export const toggleFavoriteTemplate = async (id) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.STORY_TEMPLATE_FAVORITE(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new story template (Admin only)
 * @param {Object} templateData - Template data
 * @param {FileList} files - Files to upload
 * @returns {Promise} Created template data
 */
export const createStoryTemplate = async (templateData, files = null) => {
  try {
    const formData = createFormData(templateData, files);
    const response = await axiosInstance.post(API_ENDPOINTS.STORY_TEMPLATES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update story template (Admin only)
 * @param {number} id - Template ID
 * @param {Object} templateData - Updated template data
 * @param {FileList} files - Files to upload (optional)
 * @returns {Promise} Updated template data
 */
export const updateStoryTemplate = async (id, templateData, files = null) => {
  try {
    const formData = createFormData(templateData, files);
    const response = await axiosInstance.put(API_ENDPOINTS.STORY_TEMPLATE_BY_ID(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete story template (Admin only)
 * @param {number} id - Template ID
 * @returns {Promise} Success response
 */
export const deleteStoryTemplate = async (id) => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.STORY_TEMPLATE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getStoryTemplates,
  getStoryTemplateById,
  getFavoriteTemplates,
  toggleFavoriteTemplate,
  createStoryTemplate,
  updateStoryTemplate,
  deleteStoryTemplate,
};