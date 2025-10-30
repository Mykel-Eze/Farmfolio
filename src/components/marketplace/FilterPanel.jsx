// File: src/components/marketplace/FilterPanel.jsx

import React from 'react';
import { X, MapPin, Minus, Plus } from 'lucide-react';

const FilterPanel = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  locationFilter,
  onLocationFilterChange,
  onClose,
}) => {
  const handleRadiusChange = (increment) => {
    const newRadius = Math.max(1, Math.min(100, locationFilter.radius + increment));
    onLocationFilterChange({
      ...locationFilter,
      radius: newRadius,
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-[#83aa45] rounded-full mr-2"></span>
              Producer Categories
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories available</p>
              ) : (
                categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => onCategoryToggle(category.id)}
                      className="w-4 h-4 text-[#83aa45] border-gray-300 rounded focus:ring-[#92bd4d]"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {category.categoryName || category.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-4 w-4 text-[#83aa45] mr-2" />
              Location Filter
            </h4>
            
            <div className="space-y-4">
              {/* Enable Location Filter */}
              <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationFilter.enabled}
                  onChange={(e) =>
                    onLocationFilterChange({
                      ...locationFilter,
                      enabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-[#83aa45] border-gray-300 rounded focus:ring-[#92bd4d]"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">
                  Filter by distance
                </span>
              </label>

              {/* Radius Selector */}
              {locationFilter.enabled && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Search Radius
                    </span>
                    <span className="text-sm font-bold text-[#83aa45]">
                      {locationFilter.radius} miles
                    </span>
                  </div>

                  {/* Radius Control Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleRadiusChange(-5)}
                      disabled={locationFilter.radius <= 1}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>

                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={locationFilter.radius}
                      onChange={(e) =>
                        onLocationFilterChange({
                          ...locationFilter,
                          radius: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #16a34a 0%, #16a34a ${locationFilter.radius}%, #e5e7eb ${locationFilter.radius}%, #e5e7eb 100%)`,
                      }}
                    />

                    <button
                      onClick={() => handleRadiusChange(5)}
                      disabled={locationFilter.radius >= 100}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Radius Quick Select */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[5, 10, 25, 50].map((miles) => (
                      <button
                        key={miles}
                        onClick={() =>
                          onLocationFilterChange({
                            ...locationFilter,
                            radius: miles,
                          })
                        }
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          locationFilter.radius === miles
                            ? 'bg-[#83aa45] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#a8db55]'
                        }`}
                      >
                        {miles} mi
                      </button>
                    ))}
                  </div>

                  {/* Location Status */}
                  {locationFilter.latitude && locationFilter.longitude ? (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Location detected
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        Click "Use My Location" to enable distance-based search
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedCategories.length > 0 && (
                <span className="font-medium text-gray-900">
                  {selectedCategories.length} category filter{selectedCategories.length !== 1 ? 's' : ''}
                </span>
              )}
              {selectedCategories.length > 0 && locationFilter.enabled && ' • '}
              {locationFilter.enabled && (
                <span className="font-medium text-gray-900">
                  Within {locationFilter.radius} miles
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;