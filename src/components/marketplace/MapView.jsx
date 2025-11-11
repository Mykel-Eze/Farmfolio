// File: src/components/marketplace/MapView.jsx

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Mail, ExternalLink, Navigation, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MAPS_CONFIG } from '../../utils/constants';
import { generateProfileUrl } from '../../utils/urlHelpers';

const mapContainerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius: '12px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const MapView = ({ profiles }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const locationInputRef = useRef(null);
  const locationAutocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_CONFIG.API_KEY,
    libraries: ['places'],
  });

  const onLoad = useCallback((map) => {
    setMap(map);

    // Try to get user's location and zoom in
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          // Zoom to user location
          map.panTo(userPos);
          map.setZoom(12);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }

    // Initialize location search autocomplete after map loads
    setTimeout(() => {
      if (locationInputRef.current && window.google?.maps?.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['geocode', 'establishment'],
          fields: ['formatted_address', 'geometry', 'name'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            map.panTo({ lat: location.lat(), lng: location.lng() });
            map.setZoom(13);
            setLocationSearchQuery(place.formatted_address || place.name || '');
          }
        });

        locationAutocompleteRef.current = autocomplete;
      }
    }, 100);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate center and zoom based on profiles
  const getMapCenter = () => {
    if (userLocation) {
      return userLocation;
    }

    if (profiles.length === 0) {
      return MAPS_CONFIG.DEFAULT_CENTER;
    }

    // Calculate center of all profiles
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;

    profiles.forEach(profile => {
      if (profile.latitude && profile.longitude) {
        totalLat += profile.latitude;
        totalLng += profile.longitude;
        count++;
      }
    });

    if (count > 0) {
      return {
        lat: totalLat / count,
        lng: totalLng / count,
      };
    }

    return MAPS_CONFIG.DEFAULT_CENTER;
  };

  const handleMarkerClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleRecenter = () => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(12);
    }
  };

  // Filter profiles with valid coordinates - must be defined before use
  const validProfiles = profiles.filter(
    profile => profile.latitude && profile.longitude
  );

  const handleProducerSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Find matching producer
    const matchingProfile = validProfiles.find(profile =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingProfile && map) {
      // Pan to the producer's location
      map.panTo({
        lat: matchingProfile.latitude,
        lng: matchingProfile.longitude,
      });
      map.setZoom(15);
      // Select the profile to show info window
      setSelectedProfile(matchingProfile);
    }
  };

  const clearSearches = () => {
    setSearchQuery('');
    setLocationSearchQuery('');
    if (locationInputRef.current) {
      locationInputRef.current.value = '';
    }
  };

  // Filter profiles based on search query
  const filteredProfiles = searchQuery.trim()
    ? validProfiles.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : validProfiles;

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-800 font-medium mb-2">Failed to load map</p>
        <p className="text-red-600 text-sm">
          Please check your Google Maps API key configuration
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center animate-pulse">
        <div className="spinner spinner-lg border-[#83aa45] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Search Panel Toggle */}
      <button
        onClick={() => setShowSearchPanel(!showSearchPanel)}
        className="absolute top-4 left-4 z-20 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors"
        title="Search locations and producers"
      >
        <Search className="h-5 w-5 text-[#83aa45]" />
      </button>

      {/* Search Panel */}
      {showSearchPanel && (
        <div className="absolute top-4 left-20 z-20 bg-white shadow-xl rounded-xl p-4 w-80 max-w-[calc(100vw-120px)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Search Map</h3>
            <button
              onClick={() => setShowSearchPanel(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Area Search */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Area
            </label>
            <input
              ref={locationInputRef}
              type="text"
              placeholder="Enter location or address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83aa45] focus:border-transparent text-sm"
              onChange={(e) => setLocationSearchQuery(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Search for a specific area to explore
            </p>
          </div>

          {/* Producer Search */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Producer
            </label>
            <form onSubmit={handleProducerSearch}>
              <input
                type="text"
                placeholder="Enter producer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83aa45] focus:border-transparent text-sm"
              />
            </form>
            <p className="text-xs text-gray-500 mt-1">
              Find and locate a specific producer
            </p>
          </div>

          {/* Clear Button */}
          {(searchQuery || locationSearchQuery) && (
            <button
              onClick={clearSearches}
              className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear Searches
            </button>
          )}

          {/* Matching Results */}
          {searchQuery && filteredProfiles.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto border-t border-gray-200 pt-2">
              <p className="text-xs font-medium text-gray-600 mb-2">
                {filteredProfiles.length} result{filteredProfiles.length !== 1 ? 's' : ''}:
              </p>
              {filteredProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    map?.panTo({ lat: profile.latitude, lng: profile.longitude });
                    map?.setZoom(15);
                    setSelectedProfile(profile);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  {profile.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map Controls */}
      {userLocation && (
        <button
          onClick={handleRecenter}
          className="absolute top-4 right-4 z-10 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors"
          title="Center on my location"
        >
          <Navigation className="h-5 w-5 text-[#83aa45]" />
        </button>
      )}

      {/* Profile Count */}
      <div className="absolute bottom-4 left-4 z-10 bg-white shadow-lg rounded-lg px-4 py-2">
        <p className="text-sm font-medium text-gray-900">
          {filteredProfiles.length} producer{filteredProfiles.length !== 1 ? 's' : ''} {searchQuery ? 'found' : 'on map'}
        </p>
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={getMapCenter()}
        zoom={MAPS_CONFIG.DEFAULT_ZOOM}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 8,
            }}
            title="Your Location"
          />
        )}

        {/* Producer Markers */}
        {filteredProfiles.map((profile) => (
          <Marker
            key={profile.id}
            position={{
              lat: profile.latitude,
              lng: profile.longitude,
            }}
            onClick={() => handleMarkerClick(profile)}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="#16a34a"/>
                  <circle cx="20" cy="20" r="10" fill="white"/>
                  <text x="20" y="25" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">${profile.name.charAt(0)}</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 50),
              anchor: new window.google.maps.Point(20, 50),
            }}
          />
        ))}

        {/* Info Window */}
        {selectedProfile && (
          <InfoWindow
            position={{
              lat: selectedProfile.latitude,
              lng: selectedProfile.longitude,
            }}
            onCloseClick={() => setSelectedProfile(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-2">
                {selectedProfile.name}
              </h3>
              
              {selectedProfile.location && (
                <p className="text-sm text-gray-600 mb-2 flex items-start">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-[#83aa45]" />
                  {selectedProfile.location}
                </p>
              )}

              {selectedProfile.body && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {typeof selectedProfile.body === 'string' 
                    ? selectedProfile.body 
                    : JSON.stringify(selectedProfile.body)}
                </p>
              )}

              <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                {selectedProfile.contact?.phone && (
                  <a
                    href={`tel:${selectedProfile.contact.phone}`}
                    className="flex items-center text-xs text-[#83aa45] hover:text-[#779a3f]"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </a>
                )}
                
                {selectedProfile.contact?.email && (
                  <a
                    href={`mailto:${selectedProfile.contact.email}`}
                    className="flex items-center text-xs text-[#83aa45] hover:text-[#779a3f]"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </a>
                )}

                <Link
                  to={generateProfileUrl(selectedProfile.id, selectedProfile.name)}
                  className="flex items-center text-xs text-[#83aa45] hover:text-[#779a3f] font-medium ml-auto"
                >
                  View Profile
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* No Locations Message */}
      {filteredProfiles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-900 font-medium mb-1">
              {searchQuery ? 'No producers found' : 'No locations to display'}
            </p>
            <p className="text-sm text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Producers without location data won\'t appear on the map'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;