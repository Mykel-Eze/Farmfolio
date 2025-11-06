// File: src/api/storyDraftsApi.js
import axiosInstance, { createFormData } from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all story drafts
 * @param {number|null} storyId - Optional story ID to filter drafts
 * @param {boolean} all - Whether to get all drafts
 * @returns {Promise<Array>}
 */
export const getStoryDrafts = async (storyId = null, all = false) => {
  const params = {};
  if (storyId) params.storyId = storyId;
  if (all) params.all = all;

  const response = await axiosInstance.get(API_ENDPOINTS.STORY_DRAFTS, { params });
  return response.data;
};

/**
 * Get a single story draft by ID
 * @param {number} id - Story draft ID
 * @returns {Promise<Object>}
 */
export const getStoryDraft = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STORY_DRAFT_BY_ID(id));
  return response.data;
};

/**
 * Create a new story draft
 * @param {Object} data - Story draft data
 * @param {number} data.storyTemplateId - Template ID
 * @param {string} data.name - Story name
 * @param {string} data.body - Story content (JSON string)
 * @param {number} [data.storyId] - Optional existing story ID
 * @param {Array<File>} [files] - Optional files to upload
 * @returns {Promise<Object>}
 */
export const createStoryDraft = async (data, files = []) => {
  const formData = createFormData(data, files);
  const response = await axiosInstance.post(API_ENDPOINTS.STORY_DRAFTS, formData);
  return response.data;
};

/**
 * Update an existing story draft
 * @param {number} id - Story draft ID
 * @param {Object} data - Updated story draft data
 * @param {Array<File>} [files] - Optional files to upload
 * @returns {Promise<Object>}
 */
export const updateStoryDraft = async (id, data, files = []) => {
  const formData = createFormData(data, files);
  const response = await axiosInstance.put(API_ENDPOINTS.STORY_DRAFT_BY_ID(id), formData);
  return response.data;
};

/**
 * Delete a story draft
 * @param {number} id - Story draft ID
 * @returns {Promise<void>}
 */
export const deleteStoryDraft = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.STORY_DRAFT_BY_ID(id));
  return response.data;
};
