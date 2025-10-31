// File: src/components/story/StoryEditor.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Eye, Upload, X, ArrowLeft, Edit2, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createStory, updateStory } from '../../api/storiesApi';
import toast from 'react-hot-toast';
import Header from '../common/Header';

const StoryEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template;
  const existingStory = location.state?.story;
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState(null);
  // const [dynamicFields, setDynamicFields] = useState({});

  // Get sections from template
  const sections = template?.sections || [];

  // Extract color scheme from template
  const colors = template?.parsedBody?.template?.colorScheme || {
    primary: '#83aa45',
    secondary: '#6B9F5E',
    accent: '#98c253',
    background: '#FEFEFE'
  };

  // Build dynamic validation schema based on sections
  const buildValidationSchema = () => {
    const schemaFields = {
      name: Yup.string()
        .min(3, 'Story name must be at least 3 characters')
        .required('Story name is required'),
    };

    sections.forEach((section) => {
      if (section.title) {
        schemaFields[`section_${section.id}_title`] = Yup.string();
      }
      if (section.content) {
        schemaFields[`section_${section.id}_content`] = Yup.string();
      }
      if (section.subtitle) {
        schemaFields[`section_${section.id}_subtitle`] = Yup.string();
      }
      // Handle contact fields
      if (section.type === 'contact' && section.fields) {
        Object.keys(section.fields).forEach(key => {
          schemaFields[`section_${section.id}_${key}`] = Yup.string();
        });
      }
    });

    return Yup.object(schemaFields);
  };

  // Build initial values from sections
  const buildInitialValues = () => {
    const values = {
      name: existingStory?.name || '',
    };

    sections.forEach((section) => {
      if (section.title) {
        values[`section_${section.id}_title`] = existingStory?.[`section_${section.id}_title`] || section.title || '';
      }
      if (section.subtitle) {
        values[`section_${section.id}_subtitle`] = existingStory?.[`section_${section.id}_subtitle`] || section.subtitle || '';
      }
      if (section.content) {
        values[`section_${section.id}_content`] = existingStory?.[`section_${section.id}_content`] || section.content || '';
      }
      // Handle contact fields
      if (section.type === 'contact' && section.fields) {
        Object.keys(section.fields).forEach(key => {
          values[`section_${section.id}_${key}`] = existingStory?.[`section_${section.id}_${key}`] || section.fields[key] || '';
        });
      }
    });

    return values;
  };

  // Form handling
  const formik = useFormik({
    initialValues: buildInitialValues(),
    validationSchema: buildValidationSchema(),
    onSubmit: (values) => handleSaveStory(values, false),
  });

  // Dropzone for image uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
        slot: currentImageSlot
      }));
      
      if (currentImageSlot !== null) {
        // Replace specific image slot
        const updatedImages = [...uploadedImages];
        const existingIndex = updatedImages.findIndex(img => img.slot === currentImageSlot);
        if (existingIndex >= 0) {
          URL.revokeObjectURL(updatedImages[existingIndex].preview);
          updatedImages[existingIndex] = newImages[0];
        } else {
          updatedImages.push(newImages[0]);
        }
        setUploadedImages(updatedImages);
      } else {
        setUploadedImages([...uploadedImages, ...newImages]);
      }
      
      toast.success(`${acceptedFiles.length} image(s) uploaded`);
      setShowImageUpload(false);
      setCurrentImageSlot(null);
    },
    onDropRejected: () => {
      toast.error('Some files were rejected. Please check file size and type.');
    }
  });

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [uploadedImages]);

  // Handle clicking on editable field
  const handleFieldClick = (fieldName) => {
    if (!previewMode) {
      setEditingField(fieldName);
    }
  };

  // Handle clicking on image area
  const handleImageClick = (slot) => {
    if (!previewMode) {
      setCurrentImageSlot(slot);
      setShowImageUpload(true);
    }
  };

  // Remove image
  const handleRemoveImage = (slot) => {
    const image = uploadedImages.find(img => img.slot === slot);
    if (image) {
      URL.revokeObjectURL(image.preview);
      setUploadedImages(uploadedImages.filter(img => img.slot !== slot));
    }
  };

  // Get image for specific slot
  const getImageForSlot = (slot) => {
    return uploadedImages.find(img => img.slot === slot);
  };

  // Save story
  async function handleSaveStory(values, isDraft = false) {
    try {
      setSaving(true);

      // Prepare story data with all section values
      const storyData = {
        Name: values.name,
        StoryTemplateId: template?.id || 1,
        IsDraft: isDraft,
        Body: JSON.stringify({
          templateId: template?.id,
          templateName: template?.storyTemplateName,
          sections: template?.sections || [],
          customData: values
        }),
      };

      // Prepare files
      const files = uploadedImages.map(img => img.file);

      let result;
      if (existingStory) {
        result = await updateStory(existingStory.id, storyData, files);
        toast.success(isDraft ? 'Draft saved successfully!' : 'Story updated successfully!');
      } else {
        result = await createStory(storyData, files);
        toast.success(isDraft ? 'Draft saved successfully!' : 'Story created successfully!');
      }

      if (isDraft) {
        navigate('/dashboard');
      } else {
        navigate(`/story/${result.id}/qr`);
      }
    } catch (error) {
      toast.error('Failed to save story. Please try again.');
      console.error('Error saving story:', error);
    } finally {
      setSaving(false);
    }
  }

  const handleSaveDraft = () => {
    handleSaveStory(formik.values, true);
  };

  // Render section based on type
  const renderSection = (section, index) => {
    const sectionId = section.id;
    const titleField = `section_${sectionId}_title`;
    const subtitleField = `section_${sectionId}_subtitle`;
    const contentField = `section_${sectionId}_content`;

    // Common wrapper for sections
    const SectionWrapper = ({ children }) => (
      <div className="space-y-4">
        {children}
      </div>
    );

    // Render title field
    const renderTitle = (size = 'text-3xl') => (
      <div
        onClick={() => handleFieldClick(titleField)}
        className={`${!previewMode ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors' : ''}`}
      >
        {editingField === titleField && !previewMode ? (
          <div>
            <input
              type="text"
              {...formik.getFieldProps(titleField)}
              className={`w-full ${size} font-bold px-4 py-2 border-2 border-[#83aa45] rounded-lg focus:outline-none`}
              style={{ color: colors.primary }}
              autoFocus
              onBlur={() => setEditingField(null)}
            />
          </div>
        ) : (
          <div className="relative group">
            <h2 className={`${size} font-bold`} style={{ color: colors.primary }}>
              {formik.values[titleField] || section.title || (!previewMode && 'Click to add title')}
            </h2>
            {!previewMode && (
              <Edit2 className="h-5 w-5 text-gray-400 absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>
    );

    // Render subtitle field
    const renderSubtitle = (size = 'text-xl') => {
      if (!section.subtitle && previewMode) return null;
      
      return (
        <div
          onClick={() => handleFieldClick(subtitleField)}
          className={`${!previewMode ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors' : ''}`}
        >
          {editingField === subtitleField && !previewMode ? (
            <input
              type="text"
              {...formik.getFieldProps(subtitleField)}
              className={`w-full ${size} px-4 py-2 border-2 border-[#83aa45] rounded-lg focus:outline-none`}
              style={{ color: colors.secondary }}
              autoFocus
              onBlur={() => setEditingField(null)}
              placeholder="Add subtitle (optional)"
            />
          ) : (
            <div className="relative group">
              <p className={size} style={{ color: colors.secondary }}>
                {formik.values[subtitleField] || (!previewMode && 'Click to add subtitle')}
              </p>
              {!previewMode && (
                <Edit2 className="h-5 w-5 text-gray-400 absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          )}
        </div>
      );
    };

    // Render content field
    const renderContent = () => (
      <div
        onClick={() => handleFieldClick(contentField)}
        className={`${!previewMode ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors' : ''}`}
      >
        {editingField === contentField && !previewMode ? (
          <div>
            <textarea
              {...formik.getFieldProps(contentField)}
              rows={6}
              className="w-full text-gray-700 px-4 py-2 border-2 border-[#83aa45] rounded-lg focus:outline-none"
              autoFocus
              onBlur={() => setEditingField(null)}
              placeholder="Add content..."
            />
          </div>
        ) : (
          <div className="relative group">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {formik.values[contentField] || section.content || (!previewMode && 'Click to add content')}
            </p>
            {!previewMode && (
              <Edit2 className="h-5 w-5 text-gray-400 absolute -right-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>
    );

    // Render image field
    const renderImage = () => {
      if (!section.hasImage) return null;

      return (
        <div
          onClick={() => handleImageClick(sectionId)}
          className={`mt-6 rounded-lg overflow-hidden ${
            !previewMode ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
          }`}
        >
          {getImageForSlot(sectionId) ? (
            <div className="relative group">
              <img
                src={getImageForSlot(sectionId).preview}
                alt={section.title}
                className="w-full h-64 object-cover"
              />
              {!previewMode && (
                <>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Click to change image</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(sectionId);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ) : !previewMode ? (
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Click to add image{section.placeholder ? `: ${section.placeholder}` : ''}</p>
              </div>
            </div>
          ) : null}
        </div>
      );
    };

    // Section type rendering
    switch (section.type) {
      case 'hero':
        return (
          <div key={index} className="text-center space-y-6">
            {renderTitle('text-4xl')}
            {section.subtitle && renderSubtitle()}
            {renderImage()}
          </div>
        );

      case 'text-image':
      case 'about':
      case 'story':
        return (
          <SectionWrapper key={index}>
            {renderTitle()}
            {renderContent()}
            {renderImage()}
          </SectionWrapper>
        );

      case 'contact':
        { const contactFields = section.fields || {};
        return (
          <SectionWrapper key={index}>
            {renderTitle()}
            {section.content && renderContent()}
            <div className="space-y-3 text-gray-700">
              {Object.keys(contactFields).map((key) => {
                const fieldName = `section_${sectionId}_${key}`;
                const icons = {
                  address: '📍',
                  hours: '🕐',
                  phone: '📞',
                  email: '✉️'
                };
                const icon = icons[key] || '•';
                
                return (
                  <div
                    key={key}
                    onClick={() => handleFieldClick(fieldName)}
                    className={`${!previewMode ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors' : ''}`}
                  >
                    {editingField === fieldName && !previewMode ? (
                      <div className="flex items-center">
                        <span className="mr-2">{icon}</span>
                        <input
                          type="text"
                          {...formik.getFieldProps(fieldName)}
                          className="flex-1 px-3 py-1 border-2 border-[#83aa45] rounded-lg focus:outline-none"
                          autoFocus
                          onBlur={() => setEditingField(null)}
                          placeholder={contactFields[key] || key}
                        />
                      </div>
                    ) : (
                      formik.values[fieldName] && (
                        <div className="relative group flex items-center">
                          <p>
                            {icon} {formik.values[fieldName]}
                          </p>
                          {!previewMode && (
                            <Edit2 className="h-4 w-4 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )
                    )}
                    {!formik.values[fieldName] && !previewMode && editingField !== fieldName && (
                      <p className="text-gray-400 text-sm">
                        {icon} Click to add {key}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionWrapper>
        ); }

      case 'icon-grid':
      case 'product-grid':
      case 'tips-grid':
        return (
          <SectionWrapper key={index}>
            {renderTitle()}
            {section.content && renderContent()}
            {section.items && section.items.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg text-center">
                    {item.icon && <span className="text-3xl mb-2 block">{item.icon}</span>}
                    <p className="font-semibold text-sm">{item.title || item.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
            {renderImage()}
          </SectionWrapper>
        );

      case 'call-to-action':
        return (
          <div key={index} className="text-center space-y-4 bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg">
            {renderTitle()}
            {renderContent()}
            {section.buttonText && (
              <button className="px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors font-medium">
                {section.buttonText}
              </button>
            )}
          </div>
        );

      default:
        return (
          <SectionWrapper key={index}>
            {renderTitle()}
            {section.subtitle && renderSubtitle()}
            {section.content && renderContent()}
            {renderImage()}
          </SectionWrapper>
        );
    }
  };

  if (!template && !existingStory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No template selected</p>
          <button
            onClick={() => navigate('/story/create')}
            className="px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253]"
          >
            Choose Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex gap-2 items-center md:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {existingStory ? 'Edit Story' : 'Create Story'}
                </h1>
                <p className="text-sm text-gray-600">
                  {template?.storyTemplateName || 'Custom Story'}
                </p>
              </div>
            </div>

            <div className="flex items-center self-center md:self-auto space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex flex-col md:flex-row gap-1 text-[10px] md:text-base items-center px-4 py-2 border rounded-lg transition-colors ${
                  previewMode 
                    ? 'bg-[#83aa45] text-white border-[#83aa45]' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4 md:mr-2" />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex flex-col md:flex-row gap-1 text-[10px] md:text-base items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 md:mr-2" />
                Save Draft
              </button>
              <button
                onClick={formik.handleSubmit}
                disabled={saving}
                className="flex flex-col md:flex-row gap-1 text-[10px] md:text-base items-center px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="spinner spinner-sm mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 md:mr-2" />
                    Publish Story
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Story Name */}
        {!previewMode && (
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Name *</label>
            <input
              type="text"
              {...formik.getFieldProps('name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#83aa45] focus:border-[#83aa45] ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="My Farm Story"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>
        )}

        {/* Live Preview/Editor */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {!previewMode && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <p className="text-sm text-blue-800">
                <Edit2 className="h-4 w-4 inline mr-2" />
                Click on any text or image to edit. Click "Preview" to see the final result.
              </p>
            </div>
          )}
          
          <div className="p-8 space-y-12" style={{ backgroundColor: colors.background }}>
            {sections.map((section, index) => renderSection(section, index))}
            
            {sections.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No sections available in this template.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && !previewMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Image</h3>
              <button
                onClick={() => {
                  setShowImageUpload(false);
                  setCurrentImageSlot(null);
                }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-[#98c253] bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                {isDragActive ? 'Drop image here' : 'Drag & drop an image here, or click to select'}
              </p>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, WebP (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryEditor;