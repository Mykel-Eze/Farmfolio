// File: src/components/story/TemplateSelector.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, Loader } from 'lucide-react';
import { getStoryTemplates } from '../../api/storyTemplatesApi';
import toast from 'react-hot-toast';
import Header from '../common/Header';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Helper function to clean and parse JSON with escaped characters
  const parseTemplateBody = (bodyString) => {
    try {
      // First, try direct parsing
      if (typeof bodyString === 'object') {
        return bodyString;
      }

      // Remove leading/trailing quotes if present
      let cleanBody = bodyString.trim();
      
      // If it starts with a quote, remove the outer quotes
      if (cleanBody.startsWith('"') && cleanBody.endsWith('"')) {
        cleanBody = cleanBody.slice(1, -1);
      }
      
      // Replace escaped quotes
      cleanBody = cleanBody.replace(/\\"/g, '"');
      cleanBody = cleanBody.replace(/\\\\/g, '\\');
      
      // Now parse the JSON
      const parsed = JSON.parse(cleanBody);
      return parsed;
    } catch (e) {
      console.error('Error parsing template body:', e);
      // console.log('Original body string:', bodyString);
      return null;
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await getStoryTemplates();
      
      // Parse template bodies with improved handling
      const parsedTemplates = data.map(template => {
        const bodyData = parseTemplateBody(template.body);
        
        let mediaData = [];
        try {
          mediaData = typeof template.media === 'string' 
            ? JSON.parse(template.media) 
            : template.media;
        } catch (e) {
          console.error('Error parsing media:', e);
        }

        return {
          ...template,
          parsedBody: bodyData,
          parsedMedia: mediaData || [],
          sections: bodyData?.sections || []
        };
      });

      console.log('Parsed templates:', parsedTemplates);
      setTemplates(parsedTemplates);
    } catch (error) {
      toast.error('Failed to load templates');
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
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

  const getTemplateIcon = (categoryOrName) => {
    const name = categoryOrName?.toLowerCase() || '';
    if (name.includes('farm')) return '🌾';
    if (name.includes('artisan')) return '🎨';
    if (name.includes('sustain')) return '🌱';
    return '📝';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin text-[#83aa45] mx-auto mb-4" />
            <p className="text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Templates Available</h1>
          <p className="text-gray-600">Please contact support to add story templates.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {templates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              const icon = getTemplateIcon(template.storyTemplateName);
              const sections = template.sections || [];

              return (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`bg-white rounded-2xl shadow-soft overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'ring-4 ring-[#98c253] shadow-lg transform scale-105'
                      : 'hover:shadow-lg hover:scale-102'
                  }`}
                >
                  {/* Template Preview Image */}
                  <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
                    <span className="text-8xl">{icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-[#83aa45] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Selected
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {template.storyTemplateName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>

                    {/* Template Features */}
                    {sections.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Includes {sections.length} sections:
                        </p>
                        <ul className="space-y-1 max-h-32 overflow-y-auto">
                          {sections.slice(0, 6).map((section, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#98c253] rounded-full mr-2"></span>
                              {section.title}
                            </li>
                          ))}
                          {sections.length > 6 && (
                            <li className="text-sm text-gray-500 italic">
                              + {sections.length - 6} more sections
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

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
                            ? 'bg-[#83aa45] text-white hover:bg-[#98c253]'
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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">{getTemplateIcon(selectedTemplate.storyTemplateName)}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Selected Template</p>
                      <p className="font-semibold text-gray-900">{selectedTemplate.storyTemplateName}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUseTemplate}
                    className="flex items-center justify-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors font-medium"
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
        {showPreview && selectedTemplate && selectedTemplate.sections && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#83aa45] to-[#98c253] text-white p-6">
                <div className="flex gap-3 items-start justify-between">
                  <div className="max-w-[80%] sm:max-w-max">
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedTemplate.storyTemplateName}
                    </h2>
                    <p className="text-primary-100">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={handleClosePreview}
                    className="w-[40px] h-[40px] bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-8">
                  {selectedTemplate.sections.map((section, index) => (
                    <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[#83aa45] font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {section.title}
                          </h3>
                          {section.subtitle && (
                            <p className="text-[#83aa45] mb-2">{section.subtitle}</p>
                          )}
                          <p className="text-gray-600">{section.content}</p>
                          {section.hasImage && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
                              📷 Image: {section.placeholder || 'Custom image'}
                            </div>
                          )}
                          {section.items && Array.isArray(section.items) && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              {section.items.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                  {item.icon && <span className="text-2xl mb-2 block">{item.icon}</span>}
                                  <p className="font-semibold text-sm">{item.title || item.name}</p>
                                  <p className="text-xs text-gray-600">{item.description}</p>
                                </div>
                              ))}
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
                  Close
                </button>
                <button
                  onClick={() => {
                    handleClosePreview();
                    handleUseTemplate();
                  }}
                  className="px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors font-medium"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TemplateSelector;