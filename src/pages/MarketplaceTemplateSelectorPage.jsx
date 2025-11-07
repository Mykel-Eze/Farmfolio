// File: src/pages/MarketplaceTemplateSelectorPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Store as StoreIcon } from 'lucide-react';
import { MARKETPLACE_TEMPLATES } from '../components/templates';
import { BeefTemplate } from '../components/templates';
import toast from 'react-hot-toast';
import { createProducerProfileDraft } from '../api/producerProfileDraftsApi';
import { ROUTES } from '../utils/constants';

const MarketplaceTemplateSelectorPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Template hero images mapping
  const templateImages = {
    1: 'https://plus.unsplash.com/premium_photo-1683141424343-60a8b9639309?auto=format&fit=crop&q=80&w=1200', // Wine
  };

  // Template descriptions
  const templateDescriptions = {
    1: 'Perfect for wine estates, vineyards, breweries, and premium beverage producers seeking an elegant presence',
  };

  const getPreviewData = (templateId) => {
    return {
      body: JSON.stringify({
        heroTitle: 'Your Business Name',
        heroSubtitle: 'Crafting Excellence Since 2000',
        aboutTitle: 'Our Heritage',
        aboutText: 'Share your business story here...',
      })
    };
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsPreviewMode(true);
  };

  const handleBackToSelector = () => {
    setIsPreviewMode(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);

      const draftData = {
        producerProfileTemplateId: selectedTemplate.id,
        name: `New ${selectedTemplate.displayName} Profile`,
        body: JSON.stringify({
          heroTitle: 'Your Business Name',
          heroSubtitle: 'Crafting Excellence Since 2000',
          aboutTitle: 'Our Heritage',
          aboutText: 'Share your business story here...',
        }),
        location: '',
        categoryIds: []
      };

      const draft = await createProducerProfileDraft(draftData);

      toast.success('Template selected! Start editing...');
      navigate(`/profile/edit-draft/${draft.id}`);
    } catch (error) {
      console.error('Error creating draft:', error);
      toast.error('Failed to create draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isPreviewMode && selectedTemplate) {
    const TemplateComponent = selectedTemplate.component;
    const previewData = getPreviewData(selectedTemplate.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 sm:px-6 py-3 sm:py-4 z-1">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <button
              onClick={handleBackToSelector}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Back to Templates
            </button>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 order-first sm:order-none w-full sm:w-auto text-center">
              Preview: {selectedTemplate.displayName}
            </h1>
            <button
              onClick={handleEditTemplate}
              disabled={loading}
              className="flex items-center px-4 sm:px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449] transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              {loading ? 'Creating...' : 'Edit Template'}
            </button>
          </div>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Object.values(MARKETPLACE_TEMPLATES).map((template) => (
            <div
              key={template.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 cursor-pointer hover:-translate-y-2"
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Template Preview Image with Overlay */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={templateImages[template.id]}
                  alt={template.displayName}
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
                    {template.displayName}
                  </h3>
                  <p className="text-white/90 text-sm">Click to preview full template</p>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-5 sm:p-6 bg-white">
                <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                  {templateDescriptions[template.id]}
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
      </div>
    </div>
  );
};

export default MarketplaceTemplateSelectorPage;
