// File: src/components/story/TemplateSelector.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, Sprout, Palette, Leaf } from 'lucide-react';
import { STORY_TEMPLATES_CONFIG } from '../../templates/templateConfig';
import toast from 'react-hot-toast';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const templateIcons = {
    'farm-story': Sprout,
    'artisan-product': Palette,
    'sustainability-focus': Leaf,
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    // Navigate to story editor with selected template
    navigate('/story/create/editor', {
      state: { template: selectedTemplate }
    });
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Story Template
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a template that best represents your story. You can customize everything later.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {STORY_TEMPLATES_CONFIG.map((template) => {
            const Icon = templateIcons[template.id] || Sprout;
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`bg-white rounded-2xl shadow-soft overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-primary-500 shadow-lg transform scale-105'
                    : 'hover:shadow-lg hover:scale-102'
                }`}
              >
                {/* Template Preview Image */}
                <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
                  <Icon className="h-32 w-32 text-[#83aa45] opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Preview Badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-[#83aa45] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Selected
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Template Features */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Includes:
                    </p>
                    <ul className="space-y-1">
                      {template.preview.sections.map((section, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                          {section.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#83aa45] text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    {React.createElement(templateIcons[selectedTemplate.id], {
                      className: "h-6 w-6 text-[#83aa45]"
                    })}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Selected Template</p>
                    <p className="font-semibold text-gray-900">{selectedTemplate.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleUseTemplate}
                  className="flex items-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Continue with Template
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#83aa45] to-primary-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedTemplate.preview.title}</h2>
                  <p className="text-primary-100">{selectedTemplate.preview.subtitle}</p>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-8">
                {selectedTemplate.preview.sections.map((section, index) => (
                  <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#83aa45] font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600">{section.text}</p>
                        {section.image && (
                          <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">Image placeholder</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={handleClosePreview}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleClosePreview();
                  handleUseTemplate();
                }}
                className="px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;