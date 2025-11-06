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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50">
      {/* Premium Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#83aa45] to-[#a0ad5f] shadow-xl">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                Marketplace 🌾
              </h1>
              <p className="text-base sm:text-lg text-white/90">
                Discover local producers and sustainable farms near you
              </p>
            </div>

            {/* View Toggle - Premium Style */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-1.5 rounded-xl">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${
                  view === 'grid'
                    ? 'bg-white text-[#83aa45] shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Grid className="h-5 w-5 inline mr-2" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${
                  view === 'map'
                    ? 'bg-white text-[#83aa45] shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <MapIcon className="h-5 w-5 inline mr-2" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="mb-5">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by producer or company name..."
            />
          </div>

          {/* Premium Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white shadow-md hover:shadow-lg transition-all font-medium text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(selectedCategories.length > 0 || locationFilter.enabled) && (
                <span className="ml-2 px-2.5 py-0.5 bg-[#83aa45] text-white text-xs rounded-full font-bold">
                  {selectedCategories.length + (locationFilter.enabled ? 1 : 0)}
                </span>
              )}
            </button>

            <button
              onClick={handleLocationSearch}
              className={`flex items-center px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all font-medium text-sm ${
                locationFilter.enabled
                  ? 'bg-white text-[#83aa45]'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
              }`}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {locationFilter.enabled ? 'Near Me ✓' : 'Use My Location'}
            </button>

            {(selectedCategories.length > 0 || locationFilter.enabled || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2.5 text-white/90 hover:text-white transition-colors font-medium text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}

            <div className="ml-auto text-sm font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              {filteredProfiles.length} producer{filteredProfiles.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Active Filters - Premium Pills */}
          {selectedCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategories.map((catId) => {
                const category = categories.find(c => c.id === catId);
                return (
                  <span
                    key={catId}
                    className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-xl text-sm font-medium shadow-md"
                  >
                    {category?.categoryName || `Category ${catId}`}
                    <button
                      onClick={() => handleCategoryToggle(catId)}
                      className="ml-2 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
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
          <div className="text-center py-16 sm:py-20">
            <div className="spinner spinner-lg border-[#83aa45] mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Loading producers...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">No producers found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-base sm:text-lg">
              Try adjusting your search or filters to discover more producers
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-gradient-to-r from-[#83aa45] to-[#a0ad5f] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              Clear All Filters
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

            {/* Load More Button - Premium */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-[#83aa45] to-[#a0ad5f] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Producers'}
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