// File: src/components/story/StoryEditor.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save, Eye, Upload, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createStory, updateStory } from '../../api/storiesApi';
import { TEMPLATE_COLORS } from '../../templates/templateConfig';
import toast from 'react-hot-toast';

const StoryEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template;
  const existingStory = location.state?.story;
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const colors = template ? TEMPLATE_COLORS[template.id] : TEMPLATE_COLORS['farm-story'];

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Story name must be at least 3 characters')
      .required('Story name is required'),
    heroTitle: Yup.string().required('Hero title is required'),
    heroSubtitle: Yup.string(),
    aboutTitle: Yup.string().required('About title is required'),
    aboutContent: Yup.string().required('About content is required'),
  });

  // Form handling
  const formik = useFormik({
    initialValues: {
      name: existingStory?.name || '',
      heroTitle: existingStory?.heroTitle || template?.defaultData.hero.title || '',
      heroSubtitle: existingStory?.heroSubtitle || template?.defaultData.hero.subtitle || '',
      aboutTitle: existingStory?.aboutTitle || template?.defaultData.about.title || '',
      aboutContent: existingStory?.aboutContent || template?.defaultData.about.content || '',
      productsTitle: existingStory?.productsTitle || template?.defaultData.products?.title || '',
      contactTitle: existingStory?.contactTitle || template?.defaultData.contact?.title || '',
      contactAddress: existingStory?.contactAddress || '',
      contactHours: existingStory?.contactHours || '',
      contactPhone: existingStory?.contactPhone || '',
      contactEmail: existingStory?.contactEmail || '',
    },
    validationSchema,
    onSubmit: handleSaveStory,
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
        id: Math.random().toString(36).substr(2, 9)
      }));
      setUploadedImages([...uploadedImages, ...newImages]);
      toast.success(`${acceptedFiles.length} image(s) uploaded`);
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

  // Remove image
  const handleRemoveImage = (id) => {
    const image = uploadedImages.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  // Save story
  async function handleSaveStory(values) {
    try {
      setSaving(true);

      // Prepare story data
      const storyData = {
        Name: values.name,
        StoryTemplateId: template?.id || 1,
        Body: JSON.stringify({
          template: template?.id,
          hero: {
            title: values.heroTitle,
            subtitle: values.heroSubtitle,
          },
          about: {
            title: values.aboutTitle,
            content: values.aboutContent,
          },
          products: {
            title: values.productsTitle,
          },
          contact: {
            title: values.contactTitle,
            address: values.contactAddress,
            hours: values.contactHours,
            phone: values.contactPhone,
            email: values.contactEmail,
          }
        }),
      };

      // Prepare files
      const files = uploadedImages.map(img => img.file);

      let result;
      if (existingStory) {
        result = await updateStory(existingStory.id, storyData, files);
        toast.success('Story updated successfully!');
      } else {
        result = await createStory(storyData, files);
        toast.success('Story created successfully!');
      }

      // Navigate to QR code page
      navigate(`/story/${result.id}/qr`);
    } catch (error) {
      toast.error('Failed to save story. Please try again.');
      console.error('Error saving story:', error);
    } finally {
      setSaving(false);
    }
  }

  if (!template && !existingStory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No template selected</p>
          <button
            onClick={() => navigate('/story/create')}
            className="px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-primary-700"
          >
            Choose Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {existingStory ? 'Edit Story' : 'Create Story'}
                </h1>
                <p className="text-sm text-gray-600">
                  {template?.name || 'Custom Story'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                onClick={formik.handleSubmit}
                disabled={saving || !formik.isValid}
                className="flex items-center px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="spinner spinner-sm mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save & Continue
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Story Name */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Story Details</h2>
              <div>
                <label className="label">Story Name *</label>
                <input
                  type="text"
                  {...formik.getFieldProps('name')}
                  className={`input ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                  placeholder="My Farm Story"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="error-message">{formik.errors.name}</p>
                )}
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Main Title *</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('heroTitle')}
                    className={`input ${formik.touched.heroTitle && formik.errors.heroTitle ? 'input-error' : ''}`}
                    placeholder="Welcome to Our Farm"
                  />
                  {formik.touched.heroTitle && formik.errors.heroTitle && (
                    <p className="error-message">{formik.errors.heroTitle}</p>
                  )}
                </div>
                <div>
                  <label className="label">Subtitle</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('heroSubtitle')}
                    className="input"
                    placeholder="Fresh, Local, Sustainable"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Section Title *</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('aboutTitle')}
                    className={`input ${formik.touched.aboutTitle && formik.errors.aboutTitle ? 'input-error' : ''}`}
                    placeholder="Our Story"
                  />
                  {formik.touched.aboutTitle && formik.errors.aboutTitle && (
                    <p className="error-message">{formik.errors.aboutTitle}</p>
                  )}
                </div>
                <div>
                  <label className="label">Content *</label>
                  <textarea
                    {...formik.getFieldProps('aboutContent')}
                    rows={6}
                    className={`input ${formik.touched.aboutContent && formik.errors.aboutContent ? 'input-error' : ''}`}
                    placeholder="Tell your story..."
                  />
                  {formik.touched.aboutContent && formik.errors.aboutContent && (
                    <p className="error-message">{formik.errors.aboutContent}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Section Title</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('contactTitle')}
                    className="input"
                    placeholder="Visit Us"
                  />
                </div>
                <div>
                  <label className="label">Address</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('contactAddress')}
                    className="input"
                    placeholder="123 Farm Road, County"
                  />
                </div>
                <div>
                  <label className="label">Opening Hours</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('contactHours')}
                    className="input"
                    placeholder="Mon-Sat: 9am-5pm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      {...formik.getFieldProps('contactPhone')}
                      className="input"
                      placeholder="+44 1234 567890"
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      {...formik.getFieldProps('contactEmail')}
                      className="input"
                      placeholder="hello@farm.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Story Images</h2>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">
                  Supports: JPG, PNG, WebP (Max 5MB each)
                </p>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt="Upload preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="bg-gradient-to-r from-[#83aa45] to-primary-500 text-white p-4">
                <p className="text-sm font-medium">Live Preview</p>
              </div>
              
              <div className="p-6 space-y-8" style={{ backgroundColor: colors.background }}>
                {/* Hero Preview */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                    {formik.values.heroTitle || 'Your Title Here'}
                  </h1>
                  {formik.values.heroSubtitle && (
                    <p className="text-lg" style={{ color: colors.secondary }}>
                      {formik.values.heroSubtitle}
                    </p>
                  )}
                  {uploadedImages[0] && (
                    <img
                      src={uploadedImages[0].preview}
                      alt="Hero"
                      className="mt-6 rounded-lg w-full h-48 object-cover"
                    />
                  )}
                </div>

                {/* About Preview */}
                {formik.values.aboutTitle && (
                  <div>
                    <h2 className="text-2xl font-bold mb-3" style={{ color: colors.primary }}>
                      {formik.values.aboutTitle}
                    </h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formik.values.aboutContent || 'Your content will appear here...'}
                    </p>
                  </div>
                )}

                {/* Contact Preview */}
                {formik.values.contactTitle && (
                  <div>
                    <h2 className="text-2xl font-bold mb-3" style={{ color: colors.primary }}>
                      {formik.values.contactTitle}
                    </h2>
                    <div className="space-y-2 text-gray-700">
                      {formik.values.contactAddress && <p>📍 {formik.values.contactAddress}</p>}
                      {formik.values.contactHours && <p>🕐 {formik.values.contactHours}</p>}
                      {formik.values.contactPhone && <p>📞 {formik.values.contactPhone}</p>}
                      {formik.values.contactEmail && <p>✉️ {formik.values.contactEmail}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;