// File: src/pages/MarketplaceDraftEditorPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Save, Upload, ArrowLeft } from 'lucide-react';
import { getProducerProfileDraft, updateProducerProfileDraft } from '../api/producerProfileDraftsApi';
import { createProducerProfile } from '../api/producerProfilesApi';
import { getTemplateComponent, TEMPLATE_TYPES } from '../components/templates';
import toast from 'react-hot-toast';
import { ROUTES } from '../utils/constants';

const MarketplaceDraftEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});

  useEffect(() => {
    loadDraft();
  }, [id]);

  const loadDraft = async () => {
    try {
      setLoading(true);
      const data = await getProducerProfileDraft(id);
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
    setEditedContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);

      const updatedData = {
        producerProfileTemplateId: draft.producerProfileTemplateId,
        name: draft.name,
        body: JSON.stringify(editedContent),
        location: draft.location || '',
        categoryIds: draft.categoryIds || []
      };

      await updateProducerProfileDraft(id, updatedData);
      toast.success('Draft saved successfully!');
      await loadDraft();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this marketplace profile?')) return;

    try {
      setPublishing(true);

      const profileData = {
        producerProfileDraftId: parseInt(id),
        producerProfileTemplateId: draft.producerProfileTemplateId,
        name: draft.name,
        body: JSON.stringify(editedContent),
        location: draft.location || '',
        latitude: draft.latitude || 0,
        longitude: draft.longitude || 0,
        categoryIds: draft.categoryIds || []
      };

      const profile = await createProducerProfile(profileData);
      toast.success('Marketplace profile published successfully!');
      navigate(`/producer/${profile.id}`);
    } catch (error) {
      console.error('Error publishing profile:', error);
      toast.error('Failed to publish profile');
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

  const TemplateComponent = getTemplateComponent(
    draft.producerProfileTemplateId,
    TEMPLATE_TYPES.MARKETPLACE
  );

  const templateData = {
    ...draft,
    body: editedContent
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
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

export default MarketplaceDraftEditorPage;
