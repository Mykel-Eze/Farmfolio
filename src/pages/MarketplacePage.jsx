/* eslint-disable no-unused-vars */
// File: src/pages/MarketplacePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Grid, Map as MapIcon, X } from 'lucide-react';
import { searchProducerProfiles } from '../api/searchApi';
import { getUserCategories } from '../api/userCategoriesApi';
import ProducerProfileCard from '../components/marketplace/ProducerProfileCard';
import MapView from '../components/marketplace/MapView';
import FilterPanel from '../components/marketplace/FilterPanel';
import SearchBar from '../components/common/SearchBar';
import toast from 'react-hot-toast';
import { PAGINATION } from '../utils/constants';

const MarketplacePage = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'map'
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locationFilter, setLocationFilter] = useState({
    latitude: null,
    longitude: null,
    radius: 10, // miles
    enabled: false,
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategories, locationFilter, page]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [profilesData, categoriesData] = await Promise.all([
        searchProducerProfiles({ page: 1, pageSize: PAGINATION.MARKETPLACE_PAGE_SIZE }),
        getUserCategories(),
      ]);
      
      setProfiles(profilesData?.results || profilesData || []);
      setFilteredProfiles(profilesData?.results || profilesData || []);
      setCategories(categoriesData || []);
      setHasMore(profilesData?.hasMore || false);
    } catch (error) {
      toast.error('Failed to load marketplace');
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      const searchParams = {
        name: searchQuery || undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        latitude: locationFilter.enabled ? locationFilter.latitude : undefined,
        longitude: locationFilter.enabled ? locationFilter.longitude : undefined,
        radiusMiles: locationFilter.enabled ? locationFilter.radius : undefined,
        page,
        pageSize: PAGINATION.MARKETPLACE_PAGE_SIZE,
      };

      const results = await searchProducerProfiles(searchParams);
      const profileData = results?.results || results || [];
      
      if (page === 1) {
        setFilteredProfiles(profileData);
      } else {
        setFilteredProfiles([...filteredProfiles, ...profileData]);
      }
      
      setHasMore(results?.hasMore || false);
    } catch (error) {
      toast.error('Search failed');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setPage(1); // Reset to first page
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationFilter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius: locationFilter.radius,
            enabled: true,
          });
          setPage(1);
          toast.success('Location detected!');
        },
        (error) => {
          toast.error('Could not detect location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation not supported by browser');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setLocationFilter({
      latitude: null,
      longitude: null,
      radius: 10,
      enabled: false,
    });
    setPage(1);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-1">Discover local producers near you</p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('map')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'map'
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by producer or company name..."
            />
          </div>

          {/* Filter Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(selectedCategories.length > 0 || locationFilter.enabled) && (
                <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {selectedCategories.length + (locationFilter.enabled ? 1 : 0)}
                </span>
              )}
            </button>

            <button
              onClick={handleLocationSearch}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                locationFilter.enabled
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {locationFilter.enabled ? 'Near Me' : 'Use My Location'}
            </button>

            {(selectedCategories.length > 0 || locationFilter.enabled || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              {filteredProfiles.length} producer{filteredProfiles.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Active Filters */}
          {selectedCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategories.map((catId) => {
                const category = categories.find(c => c.id === catId);
                return (
                  <span
                    key={catId}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {category?.categoryName || `Category ${catId}`}
                    <button
                      onClick={() => handleCategoryToggle(catId)}
                      className="ml-2 hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && page === 1 ? (
          <div className="text-center py-12">
            <div className="spinner spinner-lg border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading producers...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No producers found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <ProducerProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Map View */
          <MapView profiles={filteredProfiles} />
        )}
      </main>
    </div>
  );
};

export default MarketplacePage;