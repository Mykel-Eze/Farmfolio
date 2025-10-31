/* eslint-disable no-unused-vars */
// File: src/pages/EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, Save, Upload, X, MapPin, Plus, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { 
  getProducerProfiles, 
  createProducerProfile, 
  updateProducerProfile 
} from '../api/producerProfilesApi';
import { getUserCategories } from '../api/userCategoriesApi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [existingProfile, setExistingProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profilesData, categoriesData] = await Promise.all([
        getProducerProfiles(false),
        getUserCategories(),
      ]);

      setCategories(categoriesData || []);
      
      // Get first profile (user should only have one)
      if (profilesData && profilesData.length > 0) {
        const profile = profilesData[0];
        setExistingProfile(profile);
        
        // Populate form with existing data
        formik.setValues({
          name: profile.name || '',
          location: profile.location || '',
          latitude: profile.latitude || '',
          longitude: profile.longitude || '',
          aboutContent: profile.body || '',
          contactAddress: '',
          contactHours: '',
          contactPhone: '',
          contactEmail: '',
          selectedCategories: profile.categoryIds || [],
        });
      }
    } catch (error) {
      toast.error('Failed to load profile data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Business name is required'),
    location: Yup.string()
      .required('Location is required'),
    aboutContent: Yup.string()
      .min(50, 'Please provide a detailed description (at least 50 characters)')
      .required('About section is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      aboutContent: '',
      contactAddress: '',
      contactHours: '',
      contactPhone: '',
      contactEmail: '',
      selectedCategories: [],
    },
    validationSchema,
    onSubmit: handleSaveProfile,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880,
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
      toast.error('Some files were rejected. Check file size and type.');
    }
  });

  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [uploadedImages]);

  const handleRemoveImage = (id) => {
    const image = uploadedImages.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          formik.setFieldValue('latitude', position.coords.latitude);
          formik.setFieldValue('longitude', position.coords.longitude);
          toast.success('Location detected!');
          setDetectingLocation(false);
        },
        (error) => {
          toast.error('Could not detect location');
          console.error('Geolocation error:', error);
          setDetectingLocation(false);
        }
      );
    } else {
      toast.error('Geolocation not supported by browser');
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const current = formik.values.selectedCategories;
    if (current.includes(categoryId)) {
      formik.setFieldValue(
        'selectedCategories',
        current.filter(id => id !== categoryId)
      );
    } else {
      formik.setFieldValue('selectedCategories', [...current, categoryId]);
    }
  };

  async function handleSaveProfile(values) {
    try {
      setSaving(true);

      const profileData = {
        Name: values.name,
        Location: values.location,
        Latitude: parseFloat(values.latitude) || null,
        Longitude: parseFloat(values.longitude) || null,
        Body: JSON.stringify({
          about: {
            content: values.aboutContent,
          },
          contact: {
            address: values.contactAddress,
            hours: values.contactHours,
            phone: values.contactPhone,
            email: values.contactEmail,
          },
        }),
        CategoryIds: values.selectedCategories,
      };

      const files = uploadedImages.map(img => img.file);

      if (existingProfile) {
        await updateProducerProfile(existingProfile.id, profileData, files);
        toast.success('Profile updated successfully!');
      } else {
        await createProducerProfile(profileData, files);
        toast.success('Profile created successfully!');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg border-[#83aa45]"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
                  {existingProfile ? 'Edit Profile' : 'Create Profile'}
                </h1>
                <p className="text-sm text-gray-600">Marketplace Profile</p>
              </div>
            </div>

            <button
              onClick={formik.handleSubmit}
              disabled={saving || !formik.isValid}
              className="flex items-center px-6 py-2 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="spinner spinner-sm mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Business Name *</label>
                <input
                  type="text"
                  {...formik.getFieldProps('name')}
                  className={`input ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                  placeholder="Your Farm or Business Name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="error-message">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="label">About Your Business *</label>
                <textarea
                  {...formik.getFieldProps('aboutContent')}
                  rows={6}
                  className={`input ${formik.touched.aboutContent && formik.errors.aboutContent ? 'input-error' : ''}`}
                  placeholder="Tell customers about your business, what you produce, your values, and what makes you special..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formik.values.aboutContent.length} characters (minimum 50)
                </p>
                {formik.touched.aboutContent && formik.errors.aboutContent && (
                  <p className="error-message">{formik.errors.aboutContent}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Address *</label>
                <input
                  type="text"
                  {...formik.getFieldProps('location')}
                  className={`input ${formik.touched.location && formik.errors.location ? 'input-error' : ''}`}
                  placeholder="Full address or general location"
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="error-message">{formik.errors.location}</p>
                )}
              </div>

              <div>
                <label className="label">Map Coordinates (Optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    {...formik.getFieldProps('latitude')}
                    className="input"
                    placeholder="Latitude"
                  />
                  <input
                    type="number"
                    step="any"
                    {...formik.getFieldProps('longitude')}
                    className="input"
                    placeholder="Longitude"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="mt-2 flex items-center text-sm text-[#83aa45] hover:text-[#98c253] transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {detectingLocation ? 'Detecting...' : 'Detect My Location'}
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select categories that best describe your products or services
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formik.values.selectedCategories.includes(category.id)
                      ? 'border-[#83aa45] bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formik.values.selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-[#83aa45] border-gray-300 rounded focus:ring-[#98c253]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.categoryName || category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Full Address (Optional)</label>
                <input
                  type="text"
                  {...formik.getFieldProps('contactAddress')}
                  className="input"
                  placeholder="Full address for customer visits"
                />
              </div>

              <div>
                <label className="label">Opening Hours (Optional)</label>
                <input
                  type="text"
                  {...formik.getFieldProps('contactHours')}
                  className="input"
                  placeholder="e.g., Mon-Fri: 9am-5pm, Sat: 9am-2pm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone (Optional)</label>
                  <input
                    type="tel"
                    {...formik.getFieldProps('contactPhone')}
                    className="input"
                    placeholder="+44 1234 567890"
                  />
                </div>

                <div>
                  <label className="label">Email (Optional)</label>
                  <input
                    type="email"
                    {...formik.getFieldProps('contactEmail')}
                    className="input"
                    placeholder="contact@farm.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Images</h2>
            
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
                {isDragActive ? 'Drop images here' : 'Drag & drop images, or click to select'}
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, WebP (Max 5MB each)
              </p>
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Upload preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
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

          {/* Submit Button (Mobile) */}
          <div className="lg:hidden">
            <button
              type="submit"
              disabled={saving || !formik.isValid}
              className="w-full flex items-center justify-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#8eb450] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="spinner spinner-sm mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;