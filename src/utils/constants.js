// File: src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.REACT_APP_API_BASE_URL,
  TIMEOUT: parseInt(import.meta.env.REACT_APP_API_TIMEOUT) || 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Application URLs
export const APP_URLS = {
  BASE: import.meta.env.REACT_APP_BASE_URL,
  STORY_BASE: import.meta.env.REACT_APP_STORY_BASE_URL,
};

// Storage Configuration
export const STORAGE_KEYS = {
  AUTH_TOKEN: import.meta.env.REACT_APP_TOKEN_KEY || 'farmfolio_auth_token',
  USER_DATA: import.meta.env.REACT_APP_USER_KEY || 'farmfolio_user_data',
  DRAFT_STORY: 'farmfolio_draft_story',
  DRAFT_PROFILE: 'farmfolio_draft_profile',
  NETWORK_QUALITY: 'farmfolio_network_quality',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_STORY: '/story/create',
  EDIT_STORY: '/story/edit/:id',
  VIEW_STORY: '/story/:id',
  MARKETPLACE: '/marketplace',
  PRODUCER_PROFILE: '/producer/:id',
  EDIT_PROFILE: '/profile/edit',
  NOT_FOUND: '*',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/Auth/login',
  REGISTER: '/Auth/register',
  
  // Stories
  STORIES: '/Stories',
  STORY_BY_ID: (id) => `/Stories/${id}`,
  
  // Story Drafts
  STORY_DRAFTS: '/StoryDrafts',
  STORY_DRAFT_BY_ID: (id) => `/StoryDrafts/${id}`,
  
  // Story Templates
  STORY_TEMPLATES: '/StoryTemplates',
  STORY_TEMPLATE_BY_ID: (id) => `/StoryTemplates/${id}`,
  STORY_TEMPLATE_FAVORITES: '/StoryTemplates/favorites',
  STORY_TEMPLATE_FAVORITE: (id) => `/StoryTemplates/${id}/favorite`,
  
  // Producer Profiles
  PRODUCER_PROFILES: '/ProducerProfiles',
  PRODUCER_PROFILE_BY_ID: (id) => `/ProducerProfiles/${id}`,
  
  // Producer Profile Drafts
  PRODUCER_PROFILE_DRAFTS: '/ProducerProfileDrafts',
  PRODUCER_PROFILE_DRAFT_BY_ID: (id) => `/ProducerProfileDrafts/${id}`,
  
  // Producer Profile Templates
  PRODUCER_PROFILE_TEMPLATES: '/ProducerProfileTemplates',
  PRODUCER_PROFILE_TEMPLATE_BY_ID: (id) => `/ProducerProfileTemplates/${id}`,
  PRODUCER_PROFILE_TEMPLATE_FAVORITES: '/ProducerProfileTemplates/favorites',
  PRODUCER_PROFILE_TEMPLATE_FAVORITE: (id) => `/ProducerProfileTemplates/${id}/favorite`,
  
  // Search
  MARKETPLACE_SEARCH: '/SearchMarketPlace/producerprofiles',
  
  // User Categories
  USER_CATEGORIES: '/UserCategories',
  USER_CATEGORY_BY_ID: (id) => `/UserCategories/${id}`,
  
  // Roles
  ROLES: '/Roles',
  ROLE_BY_ID: (id) => `/Roles/${id}`,
  ROLE_ASSIGN: (id) => `/Roles/${id}/assign`,
};

// Media Configuration
export const MEDIA_CONFIG = {
  MAX_IMAGE_SIZE: parseInt(import.meta.env.REACT_APP_MAX_IMAGE_SIZE) || 5242880, // 5MB
  MAX_VIDEO_SIZE: parseInt(import.meta.env.REACT_APP_MAX_VIDEO_SIZE) || 104857600, // 100MB
  ALLOWED_IMAGE_TYPES: (import.meta.env.REACT_APP_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
  ALLOWED_VIDEO_TYPES: (import.meta.env.REACT_APP_ALLOWED_VIDEO_TYPES || 'video/mp4,video/webm').split(','),
  IMAGE_QUALITIES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },
};

// Network Quality
export const NETWORK_CONFIG = {
  SLOW_CONNECTION: 'slow-2g',
  MODERATE_CONNECTION: '3g',
  FAST_CONNECTION: '4g',
  AUTO_UPGRADE: import.meta.env.REACT_APP_AUTO_UPGRADE_QUALITY === 'true',
};

// QR Code Configuration
export const QR_CONFIG = {
  SIZE: parseInt(import.meta.env.REACT_APP_QR_CODE_SIZE) || 300,
  FORMAT: import.meta.env.REACT_APP_QR_CODE_FORMAT || 'png',
  ERROR_CORRECTION: import.meta.env.REACT_APP_QR_CODE_ERROR_CORRECTION || 'M',
  MARGIN: 4,
  COLOR: {
    DARK: '#000000',
    LIGHT: '#FFFFFF',
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.REACT_APP_DEFAULT_PAGE_SIZE) || 20,
  MARKETPLACE_PAGE_SIZE: parseInt(import.meta.env.REACT_APP_MARKETPLACE_PAGE_SIZE) || 24,
};

// Google Maps Configuration
export const MAPS_CONFIG = {
  API_KEY: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  DEFAULT_CENTER: { lat: 54.5, lng: -3.5 }, // UK center
  DEFAULT_ZOOM: 6,
  CLUSTER_OPTIONS: {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 50,
    maxZoom: 15,
  },
};

// Story Template Categories
export const STORY_TEMPLATES = {
  FARM: 'farm',
  PRODUCT: 'product',
  ARTISAN: 'artisan',
  MARKET: 'market',
  SUSTAINABLE: 'sustainable',
};

// Producer Categories
export const PRODUCER_CATEGORIES = {
  CHEESE: 'cheese',
  WINE: 'wine',
  SPIRITS: 'spirits',
  BAKERY: 'bakery',
  MEAT: 'meat',
  PRODUCE: 'produce',
  DAIRY: 'dairy',
  OTHER: 'other',
};

// User Roles
export const USER_ROLES = {
  PRODUCER: 'producer',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  STORY_CREATED: 'Story created successfully!',
  STORY_UPDATED: 'Story updated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default {
  API_CONFIG,
  APP_URLS,
  STORAGE_KEYS,
  ROUTES,
  API_ENDPOINTS,
  MEDIA_CONFIG,
  NETWORK_CONFIG,
  QR_CONFIG,
  PAGINATION,
  MAPS_CONFIG,
  STORY_TEMPLATES,
  PRODUCER_CATEGORIES,
  USER_ROLES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  LOADING_STATES,
};