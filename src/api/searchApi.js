/* eslint-disable no-useless-catch */
// File: src/api/searchApi.js

import axiosInstance, { buildQueryString } from './axiosConfig';
import { API_ENDPOINTS, PAGINATION } from '../utils/constants';

/**
 * Marketplace Search API Service
 * Handles searching and filtering producer profiles
 */

/**
 * Search producer profiles in marketplace
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.name - Producer or company name
 * @param {Array<number>} searchParams.categoryIds - Category IDs to filter
 * @param {number} searchParams.latitude - User location latitude
 * @param {number} searchParams.longitude - User location longitude
 * @param {number} searchParams.radiusMiles - Search radius in miles
 * @param {number} searchParams.page - Page number (default: 1)
 * @param {number} searchParams.pageSize - Items per page (default: 20)
 * @returns {Promise} Search results with pagination
 */
export const searchProducerProfiles = async (searchParams) => {
  try {
    const params = {
      name: searchParams.name || undefined,
      categoryIds: searchParams.categoryIds || undefined,
      latitude: searchParams.latitude || undefined,
      longitude: searchParams.longitude || undefined,
      radiusMiles: searchParams.radiusMiles || undefined,
      page: searchParams.page || 1,
      pageSize: searchParams.pageSize || PAGINATION.MARKETPLACE_PAGE_SIZE,
    };

    const queryString = buildQueryString(params);
    const response = await axiosInstance.get(`${API_ENDPOINTS.MARKETPLACE_SEARCH}?${queryString}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search by name only (simplified search)
 * @param {string} name - Search query
 * @param {number} page - Page number
 * @returns {Promise} Search results
 */
export const searchByName = async (name, page = 1) => {
  return searchProducerProfiles({
    name,
    page,
  });
};

/**
 * Search by location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} radiusMiles - Search radius
 * @param {number} page - Page number
 * @returns {Promise} Search results
 */
export const searchByLocation = async (latitude, longitude, radiusMiles = 10, page = 1) => {
  return searchProducerProfiles({
    latitude,
    longitude,
    radiusMiles,
    page,
  });
};

/**
 * Search by categories
 * @param {Array<number>} categoryIds - Category IDs
 * @param {number} page - Page number
 * @returns {Promise} Search results
 */
export const searchByCategories = async (categoryIds, page = 1) => {
  return searchProducerProfiles({
    categoryIds,
    page,
  });
};

/**
 * Advanced search with all filters
 * @param {Object} filters - All filter parameters
 * @returns {Promise} Search results
 */
export const advancedSearch = async (filters) => {
  return searchProducerProfiles(filters);
};

export default {
  searchProducerProfiles,
  searchByName,
  searchByLocation,
  searchByCategories,
  advancedSearch,
};