// File: src/pages/MarketplaceTemplateSelectorPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Store as StoreIcon, Sparkles } from 'lucide-react';
import { getTemplateComponent, TEMPLATE_TYPES } from '../components/templates';
import toast from 'react-hot-toast';
import { createProducerProfileDraft } from '../api/producerProfileDraftsApi';
import { getProducerProfileTemplates } from '../api/producerProfileTemplatesApi';
import { ROUTES } from '../utils/constants';

const MarketplaceTemplateSelectorPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [profileTitle, setProfileTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [fetchingTemplates, setFetchingTemplates] = useState(true);

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setFetchingTemplates(true);
        const data = await getProducerProfileTemplates();
        // Map backend field names to frontend expected names
        const mappedTemplates = data.map(template => ({
          ...template,
          name: template.producerProfileTemplateName || template.name,
        }));
        setTemplates(mappedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setFetchingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  // Extract hero image from template body - handle escaped JSON from backend
  const getTemplateHeroImage = (template) => {
    try {
      let body = template.body;

      // If already an object, return heroImage directly
      if (typeof body === 'object' && body !== null) {
        return body?.heroImage || 'https://plus.unsplash.com/premium_photo-1683141424343-60a8b9639309?auto=format&fit=crop&q=80&w=1200';
      }

      // Handle escaped JSON string from backend (e.g., {\"key\":\"value\"})
      if (typeof body === 'string') {
        // If the string starts with { or [, it's likely escaped JSON - unescape it
        if (body.trim().startsWith('{') || body.trim().startsWith('[')) {
          // Replace escaped quotes with regular quotes
          body = body.replace(/\\"/g, '"');
        }

        // Parse the JSON string
        body = JSON.parse(body);

        // Check if still a string (double-stringified)
        if (typeof body === 'string') {
          body = JSON.parse(body);
        }
      }

      return body?.heroImage || 'https://plus.unsplash.com/premium_photo-1683141424343-60a8b9639309?auto=format&fit=crop&q=80&w=1200';
    } catch (error) {
      console.error('[Marketplace] Could not parse template body for hero image:', error);
      console.error('[Marketplace] Raw body value:', template.body);
      return 'https://plus.unsplash.com/premium_photo-1683141424343-60a8b9639309?auto=format&fit=crop&q=80&w=1200';
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsPreviewMode(true);
  };

  const handleBackToSelector = () => {
    setIsPreviewMode(false);
    setSelectedTemplate(null);
    setShowTitleInput(false);
    setProfileTitle('');
  };

  const handleProceedToTitleInput = () => {
    setShowTitleInput(true);
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate) return;
    if (!profileTitle.trim()) {
      toast.error('Please enter a profile title');
      return;
    }

    try {
      setLoading(true);

      // Parse the template body (handle escaped JSON) and re-stringify once
      let bodyContent = selectedTemplate.body;

      if (typeof bodyContent === 'string') {
        try {
          // If the string starts with { or [, it's likely escaped JSON - unescape it
          if (bodyContent.trim().startsWith('{') || bodyContent.trim().startsWith('[')) {
            // Replace escaped quotes with regular quotes
            bodyContent = bodyContent.replace(/\\"/g, '"');
          }

          bodyContent = JSON.parse(bodyContent);
          // Check if still a string (double-stringified)
          if (typeof bodyContent === 'string') {
            bodyContent = JSON.parse(bodyContent);
          }
        } catch (parseError) {
          console.error('Error parsing template body:', parseError);
          toast.error('Template data is corrupted. Please contact support.');
          setLoading(false);
          return;
        }
      }

      // Now stringify it once for the backend
      const defaultBody = JSON.stringify(bodyContent);

      const draftData = {
        producerProfileTemplateId: selectedTemplate.id,
        name: profileTitle.trim(),
        body: defaultBody,
        location: selectedTemplate.location || '',
        categoryIds: []
      };

      const draft = await createProducerProfileDraft(draftData);

      toast.success('Profile draft created! Start editing...');
      navigate(`/profile/edit-draft/${draft.id}`);
    } catch (error) {
      console.error('Error creating draft:', error);
      toast.error(error.message || 'Failed to create draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTemplates) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (isPreviewMode && selectedTemplate) {
    // Get the template component dynamically based on template ID
    const TemplateComponent = getTemplateComponent(selectedTemplate.id, TEMPLATE_TYPES.MARKETPLACE);
    const previewData = selectedTemplate;

    // Show title input form
    if (showTitleInput) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <button
              onClick={() => setShowTitleInput(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Preview
            </button>

            <div className="text-center mb-6">
              <StoreIcon className="h-12 w-12 mx-auto text-slate-700 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Name Your Profile</h2>
              <p className="text-gray-600">Give your marketplace profile a title</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="profileTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Title
                </label>
                <input
                  type="text"
                  id="profileTitle"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                  placeholder="e.g., Green Valley Farm, Artisan Wine Estate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                  autoFocus
                />
              </div>

              <button
                onClick={handleEditTemplate}
                disabled={loading || !profileTitle.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Draft...' : 'Create & Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <button
              onClick={handleBackToSelector}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Back to Templates
            </button>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 order-first sm:order-none w-full sm:w-auto text-center">
              Preview: {selectedTemplate.name}
            </h1>
            <button
              onClick={handleProceedToTitleInput}
              className="flex items-center px-4 sm:px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              Use This Template
            </button>
          </div>
        </div>

        {/* Template Preview */}
        <div className="pt-[110px] md:pt-[73px]">
          <TemplateComponent data={previewData} isEditMode={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/30 to-gray-50">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 pt-8 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="flex items-center text-white/90 hover:text-white mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start gap-3">
              Choose Your Marketplace Template
              <StoreIcon className="h-8 w-8 sm:h-10 sm:w-10" />
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl">
              Create a stunning marketplace profile to showcase your products and reach conscious consumers
            </p>
          </div>
        </div>
      </div>

      {/* Template Grid with Premium Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 pb-12 sm:pb-16">
        {templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600 mb-4">No templates available yet.</p>
            <p className="text-sm text-gray-500">Please upload templates from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 cursor-pointer hover:-translate-y-2"
                onClick={() => handleTemplateSelect(template)}
              >
                {/* Template Preview Image with Overlay */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={getTemplateHeroImage(template)}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-800 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide">
                      Premium
                    </span>
                  </div>

                  {/* Overlay Text */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-white/90 text-sm">Click to preview full template</p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-5 sm:p-6 bg-white">
                  <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                    {template.description}
                  </p>
                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 group-hover:scale-105"
                  >
                    <Check className="h-5 w-5" />
                    Select & Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceTemplateSelectorPage;
