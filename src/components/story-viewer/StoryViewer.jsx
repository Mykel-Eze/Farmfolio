// File: src/components/story-viewer/StoryViewer.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStoryById } from '../../api/storiesApi';
import { getTemplateComponent, TEMPLATE_TYPES } from '../templates';
import toast from 'react-hot-toast';

const StoryViewer = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const data = await getStoryById(id);
      setStory(data);
    } catch (error) {
      toast.error('Failed to load story');
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg border-[#83aa45]"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-8">The story you're looking for doesn't exist.</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Get the template component based on story's template ID
  const TemplateComponent = getTemplateComponent(
    story.storyTemplateId || 1,
    TEMPLATE_TYPES.STORY
  );

  return (
    <div className="min-h-screen">
      <TemplateComponent data={story} isEditMode={false} />
    </div>
  );
};

export default StoryViewer;
