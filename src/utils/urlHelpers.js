// File: src/utils/urlHelpers.js

/**
 * Generates a URL-safe slug from a name
 * @param {string} name - The name to convert to a slug
 * @returns {string} - URL-safe slug
 */
export const generateSlug = (name) => {
  if (!name) return '';

  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generates a story URL with ID and name slug
 * @param {number|string} id - Story ID
 * @param {string} name - Story name
 * @returns {string} - Story URL
 */
export const generateStoryUrl = (id, name) => {
  const slug = generateSlug(name);
  return `/story/${id}-${slug}`;
};

/**
 * Generates a producer profile URL with ID and name slug
 * @param {number|string} id - Profile ID
 * @param {string} name - Profile name
 * @returns {string} - Profile URL
 */
export const generateProfileUrl = (id, name) => {
  const slug = generateSlug(name);
  return `/producer/${id}-${slug}`;
};

/**
 * Extracts ID from a URL with format /path/:id-:slug
 * @param {string} param - The URL parameter (e.g., "123-my-story-name")
 * @returns {string|null} - The extracted ID
 */
export const extractIdFromSlug = (param) => {
  if (!param) return null;

  // Split by hyphen and get the first part (ID)
  const parts = param.split('-');
  return parts[0];
};
