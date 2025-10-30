/* eslint-disable no-unused-vars */
// File: src/components/story-viewer/StoryViewer.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';
import { getStoryById } from '../../api/storiesApi';
import { TEMPLATE_COLORS } from '../../templates/templateConfig';
import toast from 'react-hot-toast';

const StoryViewer = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const data = await getStoryById(id);
      setStory(data);
      
      // Parse story body
      if (data.body) {
        try {
          const parsedBody = JSON.parse(data.body);
          setStoryData(parsedBody);
        } catch (e) {
          console.error('Error parsing story body:', e);
        }
      }
    } catch (error) {
      toast.error('Failed to load story');
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg border-[#83aa45]"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-8">The story you're looking for doesn't exist.</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const colors = storyData?.template 
    ? TEMPLATE_COLORS[storyData.template] || TEMPLATE_COLORS['farm-story']
    : TEMPLATE_COLORS['farm-story'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            {storyData?.hero?.title || story.name}
          </h1>
          {storyData?.hero?.subtitle && (
            <p className="text-xl sm:text-2xl text-white/90 animate-slide-up">
              {storyData.hero.subtitle}
            </p>
          )}
          
          {/* Farmfolio Badge */}
          <div className="mt-8 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
            <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
              <span className="text-[#83aa45] font-bold text-xs">F</span>
            </span>
            Powered by Farmfolio
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill={colors.background}
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* About Section */}
        {storyData?.about && (
          <section className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-soft p-8 sm:p-12">
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ color: colors.primary }}
              >
                {storyData.about.title}
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {storyData.about.content}
                </p>
              </div>
              
              {storyData.about.image && (
                <div className="mt-8 rounded-xl overflow-hidden">
                  <img
                    src={storyData.about.image}
                    alt={storyData.about.title}
                    className="w-full h-auto"
                    onLoad={() => handleImageLoad('about')}
                    onError={() => handleImageError('about')}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Products Section (if exists) */}
        {storyData?.products?.title && (
          <section className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-soft p-8 sm:p-12">
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-6 text-center"
                style={{ color: colors.primary }}
              >
                {storyData.products.title}
              </h2>
              
              {storyData.products.items && storyData.products.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storyData.products.items.map((product, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm">
                          {product.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  Check back soon for our product offerings!
                </p>
              )}
            </div>
          </section>
        )}

        {/* Sustainability/Process Section (if exists) */}
        {storyData?.practices && (
          <section className="animate-slide-up">
            <div 
              className="rounded-2xl shadow-soft p-8 sm:p-12"
              style={{ backgroundColor: `${colors.accent}40` }}
            >
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-8 text-center"
                style={{ color: colors.primary }}
              >
                {storyData.practices.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {storyData.practices.items?.map((item, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {item.icon || '🌱'}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {storyData?.contact && (
          <section className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-soft p-8 sm:p-12">
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-8 text-center"
                style={{ color: colors.primary }}
              >
                {storyData.contact.title || 'Get in Touch'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {storyData.contact.address && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-[#83aa45] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Address</p>
                      <p className="text-gray-600">{storyData.contact.address}</p>
                    </div>
                  </div>
                )}
                
                {storyData.contact.hours && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 text-[#83aa45] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Opening Hours</p>
                      <p className="text-gray-600">{storyData.contact.hours}</p>
                    </div>
                  </div>
                )}
                
                {storyData.contact.phone && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-6 w-6 text-[#83aa45] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Phone</p>
                      <a 
                        href={`tel:${storyData.contact.phone}`}
                        className="text-[#83aa45] hover:text-primary-700 transition-colors"
                      >
                        {storyData.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {storyData.contact.email && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-6 w-6 text-[#83aa45] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Email</p>
                      <a 
                        href={`mailto:${storyData.contact.email}`}
                        className="text-[#83aa45] hover:text-primary-700 transition-colors break-all"
                      >
                        {storyData.contact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-[#83aa45] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-sm">
                Created with <span className="font-semibold">Farmfolio</span>
              </span>
            </div>
            
            <a
              href="https://farmfolio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-[#83aa45] hover:text-primary-700 transition-colors"
            >
              Create your own story
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoryViewer;