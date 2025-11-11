// File: src/pages/ProducerProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getProducerProfileById } from '../api/producerProfilesApi';
import { getTemplateComponent, TEMPLATE_TYPES } from '../components/templates';
import { extractIdFromSlug } from '../utils/urlHelpers';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import toast from 'react-hot-toast';

const ProducerProfilePage = () => {
  const { slugId } = useParams();
  const id = extractIdFromSlug(slugId);
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getProducerProfileById(id);
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load producer profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">The producer profile you're looking for doesn't exist.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#8eb450] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Get the template component based on profile's template ID
  const TemplateComponent = getTemplateComponent(
    profile.producerProfileTemplateId || 4,
    TEMPLATE_TYPES.MARKETPLACE
  );

  return (
    <div className="min-h-screen">
      {isAuthenticated && <Header />}
      <TemplateComponent data={profile} isEditMode={false} />
    </div>
  );
};

export default ProducerProfilePage;
