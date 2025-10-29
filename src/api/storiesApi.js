/* eslint-disable no-useless-catch */
// File: src/api/storiesApi.js

import axiosInstance, { createFormData, buildQueryString } from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Stories API Service
 * Handles CRUD operations for stories
 */

/**
 * Get all stories
 * @param {boolean} all - Get all stories or just user's stories
 * @returns {Promise} Array of stories
 */
export const getStories = async (all = false) => {
  try {
    const queryString = buildQueryString({ all });
    const response = await axiosInstance.get(`${API_ENDPOINTS.STORIES}?${queryString}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get story by ID
 * @param {number} id - Story ID
 * @returns {Promise} Story data
 */
export const getStoryById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.STORY_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new story
 * @param {Object} storyData - Story data
 * @param {string} storyData.Name - Story name
 * @param {number} storyData.StoryDraftId - Story draft ID (optional)
 * @param {number} storyData.StoryTemplateId - Story template ID
 * @param {string} storyData.Body - Story content/body
 * @param {FileList} files - Files to upload
 * @returns {Promise} Created story data
 */
export const createStory = async (storyData, files = null) => {
  try {
    const formData = createFormData(storyData, files);
    const response = await axiosInstance.post(API_ENDPOINTS.STORIES, formData, {
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
 * Update story
 * @param {number} id - Story ID
 * @param {Object} storyData - Updated story data
 * @param {FileList} files - Files to upload (optional)
 * @returns {Promise} Updated story data
 */
export const updateStory = async (id, storyData, files = null) => {
  try {
    const formData = createFormData(storyData, files);
    const response = await axiosInstance.put(API_ENDPOINTS.STORY_BY_ID(id), formData, {
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
 * Delete story
 * @param {number} id - Story ID
 * @returns {Promise} Success response
 */
export const deleteStory = async (id) => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.STORY_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
};