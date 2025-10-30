// File: src/pages/ProducerProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowLeft, Share2, Image as ImageIcon } from 'lucide-react';
import { getProducerProfileById } from '../api/producerProfilesApi';
import toast from 'react-hot-toast';

const ProducerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getProducerProfileById(id);
      setProfile(data);

      // Parse profile body if it's JSON
      if (data.body) {
        try {
          const parsed = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
          setProfileData(parsed);
        } catch (e) {
          console.error('Error parsing profile body:', e);
        }
      }
    } catch (error) {
      toast.error('Failed to load producer profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: `Check out ${profile.name} on Farmfolio`,
          url: url,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
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

  const colors = {
    primary: '#16a34a',
    secondary: '#4a7c59',
    background: '#fefefe',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-[#83aa45]">
                  {profile.name?.charAt(0) || 'P'}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {profile.name}
              </h1>
              
              {/* Categories */}
              {profile.categories && profile.categories.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {profile.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                    >
                      {category.name || category}
                    </span>
                  ))}
                </div>
              )}

              {/* Location */}
              {profile.location && (
                <div className="flex items-center justify-center md:justify-start text-white/90 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profileData?.about?.content || profile.body || 'No description available'}
                </p>
              </div>
            </div>

            {/* Products/Services */}
            {profileData?.products?.items && profileData.products.items.length > 0 && (
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {profileData.products.title || 'Our Products'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileData.products.items.map((product, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-600">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {profile.images && profile.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-soft p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {profileData?.contact?.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#83aa45] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600 mt-1">{profileData.contact.address}</p>
                    </div>
                  </div>
                )}

                {profileData?.contact?.hours && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-[#83aa45] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Hours</p>
                      <p className="text-sm text-gray-600 mt-1">{profileData.contact.hours}</p>
                    </div>
                  </div>
                )}

                {profileData?.contact?.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-[#83aa45] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a
                        href={`tel:${profileData.contact.phone}`}
                        className="text-sm text-[#83aa45] hover:text-[#8eb450] mt-1 block"
                      >
                        {profileData.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profileData?.contact?.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-[#83aa45] mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a
                        href={`mailto:${profileData.contact.email}`}
                        className="text-sm text-[#83aa45] hover:text-[#8eb450] mt-1 block break-all"
                      >
                        {profileData.contact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {profileData?.contact?.phone && (
                  <a
                    href={`tel:${profileData.contact.phone}`}
                    className="w-full flex items-center justify-center px-4 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#8eb450] transition-colors font-medium"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </a>
                )}

                {profileData?.contact?.email && (
                  <a
                    href={`mailto:${profileData.contact.email}`}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Explore More</h3>
              <div className="space-y-3">
                <Link
                  to="/marketplace"
                  className="flex items-center text-sm text-[#8eb450] hover:text-primary-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-[#83aa45] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-sm">Powered by Farmfolio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProducerProfilePage;