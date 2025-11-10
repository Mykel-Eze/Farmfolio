// File: src/pages/StoryEditorPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Save, ArrowLeft, Edit } from 'lucide-react';
import { getStoryById, updateStory } from '../api/storiesApi';
import { getTemplateComponent, TEMPLATE_TYPES } from '../components/templates';
import toast from 'react-hot-toast';
import { ROUTES } from '../utils/constants';

const StoryEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const data = await getStoryById(id);
      setStory(data);

      // Parse the body - handle escaped JSON from backend
      let parsedBody = data.body;

      if (typeof parsedBody === 'string') {
        try {
          // If the string starts with { or [, it's likely escaped JSON - unescape it
          if (parsedBody.trim().startsWith('{') || parsedBody.trim().startsWith('[')) {
            // Replace escaped quotes with regular quotes
            parsedBody = parsedBody.replace(/\\"/g, '"');
          }

          parsedBody = JSON.parse(parsedBody);

          // Check if still a string (double-stringified)
          if (typeof parsedBody === 'string') {
            parsedBody = JSON.parse(parsedBody);
          }
        } catch (parseError) {
          console.error('Error parsing story body:', parseError);
          console.error('Raw body value:', data.body);
          toast.error('Story data is corrupted. Please contact support.');
          navigate(ROUTES.DASHBOARD);
          return;
        }
      }

      setEditedContent(parsedBody || {});
    } catch (error) {
      console.error('Error loading story:', error);
      toast.error('Failed to load story');
      navigate(ROUTES.DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field, value) => {
    setEditedContent(prev => {
      // Handle nested paths (e.g., "steps.0.image")
      if (field.includes('.')) {
        const newContent = { ...prev };
        const parts = field.split('.');
        let current = newContent;

        // Navigate to the parent of the target field
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          const index = parseInt(part);

          if (!isNaN(index)) {
            // It's an array index
            if (!Array.isArray(current)) {
              current = [];
            }
            if (!current[index]) {
              current[index] = {};
            }
            current = current[index];
          } else {
            // It's an object key
            if (!current[part]) {
              current[part] = {};
            }
            current = current[part];
          }
        }

        // Set the final value
        const lastPart = parts[parts.length - 1];
        const lastIndex = parseInt(lastPart);
        if (!isNaN(lastIndex)) {
          current[lastIndex] = value;
        } else {
          current[lastPart] = value;
        }

        return newContent;
      }

      // Simple field update
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSaveStory = async () => {
    try {
      setSaving(true);

      const updatedData = {
        storyTemplateId: story.storyTemplateId,
        name: story.name,
        description: story.description || 'No description provided',
        body: JSON.stringify(editedContent)
      };

      await updateStory(id, updatedData);
      toast.success('Story updated successfully!');

      // Reload story to get updated data
      await loadStory();
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Failed to save story');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg border-[#83aa45]"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Story not found</p>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="mt-4 px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const TemplateComponent = getTemplateComponent(story.storyTemplateId, TEMPLATE_TYPES.STORY);

  // Prepare data for template
  const templateData = {
    ...story,
    body: editedContent
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-3 sm:py-4 z-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Back
            </button>

            <h1 className="text-sm sm:text-xl font-semibold text-gray-900 order-first sm:order-none truncate max-w-full sm:max-w-md">
              {isPreviewMode ? 'Preview' : 'Edit'} - {story.name}
            </h1>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-base flex-1 sm:flex-initial justify-center"
              >
                {isPreviewMode ? (
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                )}
                <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>

              <button
                onClick={handleSaveStory}
                disabled={saving}
                className="flex items-center px-3 sm:px-4 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449] transition-colors disabled:opacity-50 text-xs sm:text-base flex-1 sm:flex-initial justify-center"
              >
                <Save className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
                <span className="sm:hidden">{saving ? '...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Render */}
      <div className="pt-[110px] md:pt-[73px]">
        <TemplateComponent
          data={templateData}
          isEditMode={!isPreviewMode}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default StoryEditorPage;
