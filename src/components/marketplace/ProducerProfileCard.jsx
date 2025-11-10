// File: src/components/marketplace/ProducerProfileCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, Star } from 'lucide-react';
import { generateProfileUrl } from '../../utils/urlHelpers';

const ProducerProfileCard = ({ profile }) => {
  // Parse body if it's a JSON string
  let profileData = {};
  try {
    if (typeof profile.body === 'string') {
      profileData = JSON.parse(profile.body);
    } else {
      profileData = profile.body || {};
    }
  } catch (e) {
    console.error('Error parsing profile body:', e);
  }

  // Calculate distance if available
  const formatDistance = (distance) => {
    if (!distance) return null;
    if (distance < 1) {
      return `${(distance * 5280).toFixed(0)} ft`;
    }
    return `${distance.toFixed(1)} mi`;
  };

  return (
    <Link
      to={generateProfileUrl(profile.id, profile.name)}
      className="bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden relative">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#83aa45] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl text-white font-bold">
                  {profile.name?.charAt(0) || 'P'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Distance Badge */}
        {profile.distance && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
            📍 {formatDistance(profile.distance)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Categories */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#83aa45] transition-colors">
            {profile.name}
          </h3>
          
          {/* Categories */}
          {profile.categories && profile.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-[#83aa45] text-xs rounded-full"
                >
                  {category.name || category}
                </span>
              ))}
              {profile.categories.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{profile.categories.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {profileData.about?.content || profile.body || 'No description available'}
        </p>

        {/* Location */}
        {profile.location && (
          <div className="flex items-start text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-[#83aa45]" />
            <span className="line-clamp-2">{profile.location}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          {profileData.contact?.phone && (
            <a
              href={`tel:${profileData.contact.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-xs text-gray-600 hover:text-[#83aa45] transition-colors"
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </a>
          )}
          
          {profileData.contact?.email && (
            <a
              href={`mailto:${profileData.contact.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-xs text-gray-600 hover:text-[#83aa45] transition-colors"
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </a>
          )}

          <div className="ml-auto flex items-center text-xs text-[#83aa45] font-medium">
            View Profile
            <ExternalLink className="h-3 w-3 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProducerProfileCard;