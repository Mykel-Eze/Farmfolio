// File: src/api/producerProfileDraftsApi.js
import axiosInstance, { createFormData } from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all producer profile drafts
 * @param {number|null} producerProfileId - Optional profile ID to filter drafts
 * @param {boolean} all - Whether to get all drafts
 * @returns {Promise<Array>}
 */
export const getProducerProfileDrafts = async (producerProfileId = null, all = false) => {
  const params = {};
  if (producerProfileId) params.producerProfileId = producerProfileId;
  if (all) params.all = all;

  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCER_PROFILE_DRAFTS, { params });
  return response.data;
};

/**
 * Get a single producer profile draft by ID
 * @param {number} id - Producer profile draft ID
 * @returns {Promise<Object>}
 */
export const getProducerProfileDraft = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCER_PROFILE_DRAFT_BY_ID(id));
  return response.data;
};

/**
 * Create a new producer profile draft
 * @param {Object} data - Producer profile draft data
 * @param {string} data.name - Profile name
 * @param {number} data.producerProfileTemplateId - Template ID
 * @param {string} data.body - Profile content (JSON string)
 * @param {string} [data.location] - Location
 * @param {number} [data.latitude] - Latitude
 * @param {number} [data.longitude] - Longitude
 * @param {Array<number>} [data.categoryIds] - Category IDs
 * @param {number} [data.producerProfileId] - Optional existing profile ID
 * @param {Array<File>} [files] - Optional files to upload
 * @returns {Promise<Object>}
 */
export const createProducerProfileDraft = async (data, files = []) => {
  const formData = createFormData(data, files);
  const response = await axiosInstance.post(API_ENDPOINTS.PRODUCER_PROFILE_DRAFTS, formData);
  return response.data;
};

/**
 * Update an existing producer profile draft
 * @param {number} id - Producer profile draft ID
 * @param {Object} data - Updated producer profile draft data
 * @param {Array<File>} [files] - Optional files to upload
 * @returns {Promise<Object>}
 */
export const updateProducerProfileDraft = async (id, data, files = []) => {
  const formData = createFormData(data, files);
  const response = await axiosInstance.put(API_ENDPOINTS.PRODUCER_PROFILE_DRAFT_BY_ID(id), formData);
  return response.data;
};

/**
 * Delete a producer profile draft
 * @param {number} id - Producer profile draft ID
 * @returns {Promise<void>}
 */
export const deleteProducerProfileDraft = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCER_PROFILE_DRAFT_BY_ID(id));
  return response.data;
};
