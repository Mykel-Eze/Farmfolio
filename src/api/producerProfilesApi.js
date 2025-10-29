/* eslint-disable no-useless-catch */
// File: src/api/producerProfilesApi.js

import axiosInstance, { createFormData, buildQueryString } from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Producer Profiles API Service
 * Handles producer profile operations
 */

/**
 * Get all producer profiles
 * @param {boolean} all - Get all profiles or just user's profiles
 * @returns {Promise} Array of producer profiles
 */
export const getProducerProfiles = async (all = false) => {
  try {
    const queryString = buildQueryString({ all });
    const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCER_PROFILES}?${queryString}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get producer profile by ID
 * @param {number} id - Profile ID
 * @returns {Promise} Profile data
 */
export const getProducerProfileById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCER_PROFILE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new producer profile
 * @param {Object} profileData - Profile data
 * @param {string} profileData.Name - Profile name
 * @param {number} profileData.ProducerProfileDraftId - Draft ID (optional)
 * @param {number} profileData.ProducerProfileTemplateId - Template ID
 * @param {string} profileData.Body - Profile content/body
 * @param {string} profileData.Location - Location address
 * @param {number} profileData.Latitude - Location latitude
 * @param {number} profileData.Longitude - Location longitude
 * @param {Array<number>} profileData.CategoryIds - Category IDs
 * @param {FileList} files - Files to upload
 * @returns {Promise} Created profile data
 */
export const createProducerProfile = async (profileData, files = null) => {
  try {
    const formData = createFormData(profileData, files);
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCER_PROFILES, formData, {
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
 * Update producer profile
 * @param {number} id - Profile ID
 * @param {Object} profileData - Updated profile data
 * @param {FileList} files - Files to upload (optional)
 * @returns {Promise} Updated profile data
 */
export const updateProducerProfile = async (id, profileData, files = null) => {
  try {
    const formData = createFormData(profileData, files);
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCER_PROFILE_BY_ID(id), formData, {
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
 * Delete producer profile
 * @param {number} id - Profile ID
 * @returns {Promise} Success response
 */
export const deleteProducerProfile = async (id) => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCER_PROFILE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getProducerProfiles,
  getProducerProfileById,
  createProducerProfile,
  updateProducerProfile,
  deleteProducerProfile,
};