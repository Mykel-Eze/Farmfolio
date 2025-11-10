/* eslint-disable no-unused-vars */
// File: src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getStories, deleteStory } from '../api/storiesApi';
import { getProducerProfiles, deleteProducerProfile } from '../api/producerProfilesApi';
import { getStoryDrafts, deleteStoryDraft } from '../api/storyDraftsApi';
import { getProducerProfileDrafts, deleteProducerProfileDraft } from '../api/producerProfileDraftsApi';
import { generateStoryUrl, generateProfileUrl } from '../utils/urlHelpers';
import Header from '../components/common/Header';
import {
  Plus,
  FileText,
  Store,
  Settings,
  Edit,
  Trash2,
  QrCode,
  Eye,
  Search,
  FileClock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../utils/constants';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [storyDrafts, setStoryDrafts] = useState([]);
  const [profileDrafts, setProfileDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storiesData, profilesData, storyDraftsData, profileDraftsData] = await Promise.all([
        getStories(false), // Only user's stories
        getProducerProfiles(false), // Only user's profiles
        getStoryDrafts(null, false), // Only user's story drafts
        getProducerProfileDrafts(null, false), // Only user's profile drafts
      ]);

      // Sort all data by date (latest first)
      const sortByDate = (arr) => arr.sort((a, b) =>
        new Date(b.dateCreated || b.dateModified) - new Date(a.dateCreated || a.dateModified)
      );

      setStories(sortByDate(storiesData || []));
      setProfiles(sortByDate(profilesData || []));
      setStoryDrafts(sortByDate(storyDraftsData || []));
      setProfileDrafts(sortByDate(profileDraftsData || []));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract hero image from body JSON
  const getHeroImage = (item) => {
    try {
      let body = item.body;

      if (typeof body === 'string') {
        if (body.trim().startsWith('{') || body.trim().startsWith('[')) {
          body = body.replace(/\\"/g, '"');
        }
        body = JSON.parse(body);
        if (typeof body === 'string') {
          body = JSON.parse(body);
        }
      }

      return body?.heroImage || null;
    } catch (error) {
      return null;
    }
  };

  const handleDeleteStory = async (id) => {
    setDeleteConfirm({
      type: 'story',
      id,
      title: 'Are you sure you want to delete this story?',
      description: 'This action cannot be undone. All existing links and QR codes will no longer work. Visitors will see an error when trying to access this story.'
    });
  };

  const handleDeleteProfile = async (id) => {
    setDeleteConfirm({
      type: 'profile',
      id,
      title: 'Are you sure you want to delete this profile?',
      description: 'This action cannot be undone. Your profile will be removed from the marketplace and will no longer be visible to customers.'
    });
  };

  const handleDeleteStoryDraft = async (id) => {
    setDeleteConfirm({
      type: 'storyDraft',
      id,
      title: 'Are you sure you want to delete this draft?',
      description: 'This action cannot be undone. All unsaved changes in this draft will be permanently lost.'
    });
  };

  const handleDeleteProfileDraft = async (id) => {
    setDeleteConfirm({
      type: 'profileDraft',
      id,
      title: 'Are you sure you want to delete this draft?',
      description: 'This action cannot be undone. All unsaved changes in this draft will be permanently lost.'
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { type, id } = deleteConfirm;

      switch (type) {
        case 'story':
          await deleteStory(id);
          setStories(stories.filter(story => story.id !== id));
          toast.success('Story deleted successfully');
          break;
        case 'profile':
          await deleteProducerProfile(id);
          setProfiles(profiles.filter(profile => profile.id !== id));
          toast.success('Profile deleted successfully');
          break;
        case 'storyDraft':
          await deleteStoryDraft(id);
          setStoryDrafts(storyDrafts.filter(draft => draft.id !== id));
          toast.success('Draft deleted successfully');
          break;
        case 'profileDraft':
          await deleteProducerProfileDraft(id);
          setProfileDrafts(profileDrafts.filter(draft => draft.id !== id));
          toast.success('Draft deleted successfully');
          break;
        default:
          break;
      }

      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete');
      console.error('Error deleting:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const filteredStories = stories.filter(story => 
    story.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg border-[#83aa45]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      {/* Header Component */}
      <Header onLogout={handleLogout} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#83aa45] to-[#a0ad5f] pt-8 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl">
              Manage your stories and marketplace profiles in one beautiful dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 pb-12 sm:pb-16">
        {/* Quick Stats - Premium Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Published Stories Card */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#83aa45]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Published Stories</p>
                  <p className="text-2xl sm:text-4xl font-bold text-gray-900">{stories.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[#83aa45] to-[#a0ad5f] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>
              {/* <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#83aa45] to-[#a0ad5f] rounded-full" style={{ width: '100%' }}></div>
              </div> */}
            </div>
          </div>

          {/* Story Drafts Card */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Story Drafts</p>
                  <p className="text-2xl sm:text-4xl font-bold text-gray-900">{storyDrafts.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileClock className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>
              {/* <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: '100%' }}></div>
              </div> */}
            </div>
          </div>

          {/* Published Profiles Card */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Marketplace</p>
                  <p className="text-2xl sm:text-4xl font-bold text-gray-900">{profiles.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Store className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>
              {/* <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-700 to-slate-900 rounded-full" style={{ width: '100%' }}></div>
              </div> */}
            </div>
          </div>

          {/* Profile Drafts Card */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Profile Drafts</p>
                  <p className="text-2xl sm:text-4xl font-bold text-gray-900">{profileDrafts.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileClock className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>
              {/* <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-700 rounded-full" style={{ width: '100%' }}></div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Action Buttons - Premium CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link
            to="/story/templates"
            className="group relative bg-gradient-to-br from-[#83aa45] via-[#a0ad5f] to-[#83aa45] text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                    Create New Story
                    <span className="text-2xl">📖</span>
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Choose from beautiful templates and share your farm's journey
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/profile/templates"
            className="group relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                    Create Marketplace Profile
                    <span className="text-2xl">🏪</span>
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Showcase your products and reach conscious consumers
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Tabs - Premium Design with Horizontal Scroll on Mobile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="border-b border-gray-200/80">
            <nav className="flex overflow-x-auto px-4 sm:px-6 scrollbar-hide" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('stories')}
                className={`flex-shrink-0 py-4 px-4 sm:px-6 border-b-3 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === 'stories'
                    ? 'border-[#83aa45] text-[#83aa45] bg-[#83aa45]/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Stories</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'stories' ? 'bg-[#83aa45] text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {stories.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('storyDrafts')}
                className={`flex-shrink-0 py-4 px-4 sm:px-6 border-b-3 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === 'storyDrafts'
                    ? 'border-amber-500 text-amber-600 bg-amber-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileClock className="h-4 w-4" />
                  <span>Drafts</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'storyDrafts' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {storyDrafts.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('profiles')}
                className={`flex-shrink-0 py-4 px-4 sm:px-6 border-b-3 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === 'profiles'
                    ? 'border-slate-700 text-slate-700 bg-slate-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span>Marketplace</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'profiles' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {profiles.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('profileDrafts')}
                className={`flex-shrink-0 py-4 px-4 sm:px-6 border-b-3 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === 'profileDrafts'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileClock className="h-4 w-4" />
                  <span>Profile Drafts</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'profileDrafts' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {profileDrafts.length}
                  </span>
                </span>
              </button>
            </nav>
          </div>

          {/* Search Bar - Premium Design */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50/50 to-transparent">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#83aa45] focus:border-[#83aa45] bg-white shadow-sm transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50/30 to-transparent">
            {activeTab === 'stories' && (
              <>
                {filteredStories.length === 0 ? (
                  <div className="text-center py-16 sm:py-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No stories yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                      Create your first story to share your farm's journey with customers
                    </p>
                    <Link
                      to={ROUTES.CREATE_STORY}
                      className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#83aa45] to-[#a0ad5f] text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Story
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredStories.map((story) => (
                      <div
                        key={story.id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                      >
                        {/* Story Image */}
                        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#83aa45]/20 to-[#a0ad5f]/20 overflow-hidden">
                          {getHeroImage(story) ? (
                            <img
                              src={getHeroImage(story)}
                              alt={story.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-16 w-16 text-[#83aa45]/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        {/* Story Details */}
                        <div className="p-5 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-[#83aa45] transition-colors">
                            {story.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {story.description || 'No description available'}
                          </p>

                          {/* Actions */}
                          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                            <Link
                              to={generateStoryUrl(story.id, story.name)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Link>
                            <Link
                              to={`/story/edit/${story.id}`}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            <Link
                              to={`/story/${story.id}/qr`}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <QrCode className="h-4 w-4" />
                              <span>QR Code</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteStory(story.id)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'storyDrafts' && (
              <>
                {storyDrafts.length === 0 ? (
                  <div className="text-center py-16 sm:py-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FileClock className="h-10 w-10 sm:h-12 sm:w-12 text-amber-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No story drafts yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                      Start creating your first story draft and save your progress
                    </p>
                    <Link
                      to="/story/templates"
                      className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Story
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {storyDrafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200 hover:-translate-y-1"
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-white rounded-full shadow-lg uppercase tracking-wide">
                            Draft
                          </span>
                        </div>

                        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-amber-100 to-yellow-100 overflow-hidden">
                          {getHeroImage(draft) ? (
                            <img
                              src={getHeroImage(draft)}
                              alt={draft.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileClock className="h-20 w-20 text-amber-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-400/20"></div>
                        </div>

                        <div className="p-5 sm:p-6 bg-white">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 truncate group-hover:text-amber-600 transition-colors">
                            {draft.name}
                          </h3>

                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              to={`/story/edit-draft/${draft.id}`}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs sm:text-sm font-semibold"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Continue</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteStoryDraft(draft.id)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'profiles' && (
              <>
                {profiles.length === 0 ? (
                  <div className="text-center py-16 sm:py-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Store className="h-10 w-10 sm:h-12 sm:w-12 text-slate-700" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      No marketplace profile yet
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                      Create your marketplace profile to be discovered by conscious consumers
                    </p>
                    <Link
                      to="/profile/templates"
                      className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Profile
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                      >
                        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-slate-600 to-slate-800 overflow-hidden">
                          {getHeroImage(profile) ? (
                            <img
                              src={getHeroImage(profile)}
                              alt={profile.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Store className="h-16 w-16 sm:h-20 sm:w-20 text-white/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="p-5 sm:p-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-slate-700 transition-colors">
                            {profile.name}
                          </h3>
                          <div className="flex items-start gap-2 mb-3">
                            <span className="text-lg">📍</span>
                            <p className="text-sm sm:text-base text-gray-600 font-medium">
                              {profile.location || 'No location set'}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                            {profile.description || 'No description available'}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <Link
                              to={generateProfileUrl(profile.id, profile.name)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Link>
                            <Link
                              to={`/profile/edit-draft/${profile.id}`}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteProfile(profile.id)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'profileDrafts' && (
              <>
                {profileDrafts.length === 0 ? (
                  <div className="text-center py-16 sm:py-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FileClock className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No profile drafts yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                      Start creating your marketplace profile draft and save your progress
                    </p>
                    <Link
                      to="/profile/templates"
                      className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Profile
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {profileDrafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-200 hover:-translate-y-1"
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-full shadow-lg uppercase tracking-wide">
                            Draft
                          </span>
                        </div>

                        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                          {getHeroImage(draft) ? (
                            <img
                              src={getHeroImage(draft)}
                              alt={draft.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileClock className="h-20 w-20 text-orange-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
                        </div>

                        <div className="p-5 sm:p-6 bg-white">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                            {draft.name}
                          </h3>
                          <div className="flex items-start gap-2 mb-5">
                            <span className="text-lg">📍</span>
                            <p className="text-sm sm:text-base text-gray-600 font-medium">
                              {draft.location || 'No location set'}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Link
                              to={`/profile/edit-draft/${draft.id}`}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm font-semibold"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Continue</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteProfileDraft(draft.id)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {deleteConfirm.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {deleteConfirm.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;