// File: src/pages/StoryDraftEditorPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Save, Upload, ArrowLeft, Edit } from 'lucide-react';
import { getStoryDraft, updateStoryDraft } from '../api/storyDraftsApi';
import { createStory } from '../api/storiesApi';
import { getTemplateComponent, TEMPLATE_TYPES } from '../components/templates';
import toast from 'react-hot-toast';
import { ROUTES } from '../utils/constants';

const StoryDraftEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  useEffect(() => {
    loadDraft();
  }, [id]);

  const loadDraft = async () => {
    try {
      setLoading(true);
      const data = await getStoryDraft(id);
      setDraft(data);

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
          console.error('Error parsing draft body:', parseError);
          console.error('Raw body value:', data.body);
          toast.error('Draft data is corrupted. Please contact support.');
          navigate(ROUTES.DASHBOARD);
          return;
        }
      }

      setEditedContent(parsedBody || {});
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft');
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

  const handleSaveDraft = async () => {
    try {
      setSaving(true);

      const updatedData = {
        storyTemplateId: draft.storyTemplateId,
        name: draft.name,
        description: draft.description || 'No description provided',
        body: JSON.stringify(editedContent)
      };

      await updateStoryDraft(id, updatedData);
      toast.success('Draft saved successfully!');

      // Reload draft to get updated data
      await loadDraft();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    setShowPublishConfirm(true);
  };

  const confirmPublish = async () => {
    try {
      setPublishing(true);
      setShowPublishConfirm(false);

      const storyData = {
        storyDraftId: parseInt(id),
        storyTemplateId: draft.storyTemplateId,
        name: draft.name,
        description: draft.description || 'No description provided',
        body: JSON.stringify(editedContent)
      };

      const story = await createStory(storyData);
      toast.success('Story published successfully!');

      // Navigate to the QR code page
      navigate(`/story/${story.id}/qr`);
    } catch (error) {
      console.error('Error publishing story:', error);
      toast.error('Failed to publish story');
    } finally {
      setPublishing(false);
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

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Draft not found</p>
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

  const TemplateComponent = getTemplateComponent(draft.storyTemplateId, TEMPLATE_TYPES.STORY);

  // Prepare data for template
  const templateData = {
    ...draft,
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
              {isPreviewMode ? 'Preview' : 'Edit'} - {draft.name}
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
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-xs sm:text-base flex-1 sm:flex-initial justify-center"
              >
                <Save className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
                <span className="sm:hidden">{saving ? '...' : 'Save'}</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center px-3 sm:px-4 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449] transition-colors disabled:opacity-50 text-xs sm:text-base flex-1 sm:flex-initial justify-center"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">{publishing ? 'Publishing...' : 'Publish'}</span>
                <span className="sm:hidden">{publishing ? '...' : 'Publish'}</span>
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

      {/* Publish Confirmation Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#83aa45]/10 flex items-center justify-center flex-shrink-0">
                <Upload className="h-6 w-6 text-[#83aa45]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Publish Your Story?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your story will be published and available to everyone. You'll receive a QR code to share with your audience.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPublish}
                disabled={publishing}
                className="flex-1 px-4 py-3 bg-[#83aa45] text-white rounded-xl font-semibold hover:bg-[#7A8449] transition-colors disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDraftEditorPage;
