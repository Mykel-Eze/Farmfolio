/* eslint-disable no-useless-catch */
// File: src/api/producerProfileTemplatesApi.js

import axiosInstance, { createFormData } from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Producer Profile Templates API Service
 * Handles producer profile template operations
 */

/**
 * Get all producer profile templates
 * @returns {Promise} Array of producer profile templates
 */
export const getProducerProfileTemplates = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get producer profile template by ID
 * @param {number} id - Template ID
 * @returns {Promise} Template data
 */
export const getProducerProfileTemplateById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get favorite producer profile templates
 * @returns {Promise} Array of favorite templates
 */
export const getFavoriteProducerProfileTemplates = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATE_FAVORITES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle favorite status of a producer profile template
 * @param {number} id - Template ID
 * @returns {Promise} Success response
 */
export const toggleFavoriteProducerProfileTemplate = async (id) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATE_FAVORITE(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new producer profile template (Admin only)
 * @param {Object} templateData - Template data
 * @param {FileList} files - Files to upload
 * @returns {Promise} Created template data
 */
export const createProducerProfileTemplate = async (templateData, files = null) => {
  try {
    const formData = createFormData(templateData, files);
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATES, formData, {
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
 * Update producer profile template (Admin only)
 * @param {number} id - Template ID
 * @param {Object} templateData - Updated template data
 * @param {FileList} files - Files to upload (optional)
 * @returns {Promise} Updated template data
 */
export const updateProducerProfileTemplate = async (id, templateData, files = null) => {
  try {
    const formData = createFormData(templateData, files);
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATE_BY_ID(id), formData, {
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
 * Delete producer profile template (Admin only)
 * @param {number} id - Template ID
 * @returns {Promise} Success response
 */
export const deleteProducerProfileTemplate = async (id) => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCER_PROFILE_TEMPLATE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getProducerProfileTemplates,
  getProducerProfileTemplateById,
  getFavoriteProducerProfileTemplates,
  toggleFavoriteProducerProfileTemplate,
  createProducerProfileTemplate,
  updateProducerProfileTemplate,
  deleteProducerProfileTemplate,
};
