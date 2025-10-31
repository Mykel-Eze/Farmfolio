// File: src/utils/templateUploader.js

import axios from 'axios';
import { STORY_TEMPLATES_FOR_BACKEND } from '../templates/storyTemplatesForBackend';
import { PRODUCER_PROFILE_TEMPLATES_FOR_BACKEND } from '../templates/producerProfileTemplatesForBackend';

/**
 * Utility to upload templates to backend
 * Run this once to seed your database with templates
 */

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

// Upload Story Templates
export const uploadStoryTemplates = async (authToken) => {
  console.log('🚀 Starting Story Template Upload...');
  const results = [];

  for (const template of STORY_TEMPLATES_FOR_BACKEND) {
    try {
      console.log(`📤 Uploading: ${template.storyTemplateName}`);
      
      const response = await axios.post(
        `${API_BASE_URL}/StoryTemplates`,
        {
          name: template.storyTemplateName,
          categoryId: template.userCategoryId,
          description: template.description,
          body: template.body,
          files: template.media,
          isActive: template.isActive
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Success: ${template.storyTemplateName} (ID: ${response.data.id})`);
      results.push({
        name: template.storyTemplateName,
        success: true,
        id: response.data.id
      });
    } catch (error) {
      console.error(`❌ Failed: ${template.storyTemplateName}`);
      console.error('Error:', error.response?.data || error.message);
      results.push({
        name: template.storyTemplateName,
        success: false,
        error: error.message
      });
    }
  }

  console.log('\n📊 Story Templates Upload Summary:');
  console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
  
  return results;
};

// Upload Producer Profile Templates
export const uploadProducerProfileTemplates = async (authToken) => {
  console.log('\n🚀 Starting Producer Profile Template Upload...');
  const results = [];

  for (const template of PRODUCER_PROFILE_TEMPLATES_FOR_BACKEND) {
    try {
      console.log(`📤 Uploading: ${template.producerProfileTemplateName}`);
      
      const response = await axios.post(
        `${API_BASE_URL}/ProducerProfileTemplates`,
        {
          name: template.producerProfileTemplateName,
          categoryId: template.userCategoryId,
          description: template.description,
          body: template.body,
          files: template.media,
          location: template.location,
          latitude: template.latitude,
          longitude: template.longitude,
          isActive: template.isActive
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Success: ${template.producerProfileTemplateName} (ID: ${response.data.id})`);
      results.push({
        name: template.producerProfileTemplateName,
        success: true,
        id: response.data.id
      });
    } catch (error) {
      console.error(`❌ Failed: ${template.producerProfileTemplateName}`);
      console.error('Error:', error.response?.data || error.message);
      results.push({
        name: template.producerProfileTemplateName,
        success: false,
        error: error.message
      });
    }
  }

  console.log('\n📊 Producer Profile Templates Upload Summary:');
  console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
  
  return results;
};

// Upload All Templates
export const uploadAllTemplates = async (authToken) => {
  console.log('🎯 Uploading ALL Templates to Backend\n');
  console.log('=' .repeat(50));
  
  const storyResults = await uploadStoryTemplates(authToken);
  const profileResults = await uploadProducerProfileTemplates(authToken);
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 ALL UPLOADS COMPLETE!');
  console.log(`\n📈 Total Summary:`);
  console.log(`   Story Templates: ${storyResults.filter(r => r.success).length}/${storyResults.length} successful`);
  console.log(`   Profile Templates: ${profileResults.filter(r => r.success).length}/${profileResults.length} successful`);
  
  return {
    story: storyResults,
    profile: profileResults
  };
};

/**
 * HOW TO USE THIS UPLOADER:
 * 
 * 1. Open browser console on your app
 * 2. Make sure you're logged in (have auth token)
 * 3. Run in console:
 * 
 *    import { uploadAllTemplates } from './utils/templateUploader'
 *    const token = localStorage.getItem('farmfolio_auth_token')
 *    uploadAllTemplates(token)
 * 
 * OR create a temporary admin page/button that calls this function
 */

export default {
  uploadStoryTemplates,
  uploadProducerProfileTemplates,
  uploadAllTemplates
};