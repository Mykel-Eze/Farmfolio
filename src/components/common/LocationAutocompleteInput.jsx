// File: src/components/common/LocationAutocompleteInput.jsx

import React, { useRef, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Loader2 } from 'lucide-react';
import { MAPS_CONFIG } from '../../utils/constants';

const LocationAutocompleteInput = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Search for a location...',
  className = '',
  error = ''
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [localValue, setLocalValue] = useState(value || '');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_CONFIG.API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    // Initialize the autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
    });

    autocompleteRef.current = autocomplete;

    // Listen for place selection
    const placeChangedListener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.error('No geometry found for place');
        return;
      }

      const location = place.geometry.location;
      const formattedAddress = place.formatted_address || place.name || '';

      // Update local value
      setLocalValue(formattedAddress);

      // Call parent callbacks
      if (onChange) {
        onChange(formattedAddress);
      }

      if (onLocationSelect) {
        onLocationSelect({
          address: formattedAddress,
          latitude: location.lat(),
          longitude: location.lng(),
          placeData: place,
        });
      }
    });

    // Cleanup
    return () => {
      if (placeChangedListener) {
        window.google.maps.event.removeListener(placeChangedListener);
      }
    };
  }, [isLoaded, onChange, onLocationSelect]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Also call onChange to update parent state
    if (onChange) {
      onChange(newValue);
    }
  };

  if (loadError) {
    return (
      <div>
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`input input-error ${className}`}
        />
        <p className="text-xs text-red-600 mt-1">
          Failed to load Google Places. Using basic text input.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <input
          type="text"
          disabled
          placeholder="Loading location service..."
          className={`input ${className}`}
        />
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        autoComplete="off"
      />
      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#83aa45] pointer-events-none" />
      {error && (
        <p className="error-message mt-1">{error}</p>
      )}
    </div>
  );
};

export default LocationAutocompleteInput;
