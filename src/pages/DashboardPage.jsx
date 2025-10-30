// File: src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getStories, deleteStory } from '../api/storiesApi';
import { getProducerProfiles } from '../api/producerProfilesApi';
import { 
  Plus, 
  FileText, 
  Store, 
  Settings, 
  LogOut, 
  Edit, 
  Trash2, 
  QrCode,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../utils/constants';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storiesData, profilesData] = await Promise.all([
        getStories(false), // Only user's stories
        getProducerProfiles(false), // Only user's profiles
      ]);
      setStories(storiesData || []);
      setProfiles(profilesData || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      await deleteStory(id);
      setStories(stories.filter(story => story.id !== id));
      toast.success('Story deleted successfully');
    } catch (error) {
      toast.error('Failed to delete story');
      console.error('Error deleting story:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              {/* <div className="w-10 h-10 bg-[#83aa45] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Farmfolio</span> */}
              <img src="/farmfolio.png" alt="Farmfolio Logo" className="w-[120px]" />
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, <span className="text-[#83aa45]">{user?.firstName}</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stories</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stories.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#83aa4520] rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#83aa45]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Marketplace Profiles</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#00000018] rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-[#000000]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to={ROUTES.CREATE_STORY}
            className="bg-gradient-to-r from-[#a0ad5f] to-[#83aa45] text-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Create New Story</h3>
                <p className="text-primary-100 text-sm">
                  Choose a template and start telling your story
                </p>
              </div>
              <Plus className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to={ROUTES.EDIT_PROFILE}
            className="bg-gradient-to-r from-[#000000] to-[#555555] text-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Edit Marketplace Profile</h3>
                <p className="text-blue-100 text-sm">
                  Update your business information and location
                </p>
              </div>
              <Settings className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('stories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'stories'
                    ? 'border-[#83aa45] text-[#83aa45]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Stories ({stories.length})
              </button>
              <button
                onClick={() => setActiveTab('profiles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profiles'
                    ? 'border-[#83aa45] text-[#83aa45]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Marketplace Profiles ({profiles.length})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83aa45] focus:border-[#83aa45]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'stories' && (
              <>
                {filteredStories.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create your first story to share with your customers
                    </p>
                    <Link
                      to={ROUTES.CREATE_STORY}
                      className="inline-flex items-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449] transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Story
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStories.map((story) => (
                      <div
                        key={story.id}
                        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                      >
                        {/* Story Image */}
                        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          {story.imageUrl ? (
                            <img
                              src={story.imageUrl}
                              alt={story.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="h-16 w-16 text-[#83aa45]" />
                          )}
                        </div>

                        {/* Story Details */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                            {story.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {story.body || 'No description available'}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <Link
                              to={`/story/${story.id}`}
                              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                            <Link
                              to={`/story/edit/${story.id}`}
                              className="flex items-center text-sm text-[#83aa45] hover:text-[#7A8449]"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                            <button
                              onClick={() => navigate(`/story/${story.id}/qr`)}
                              className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                            >
                              <QrCode className="h-4 w-4 mr-1" />
                              QR
                            </button>
                            <button
                              onClick={() => handleDeleteStory(story.id)}
                              className="flex items-center text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
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
                  <div className="text-center py-12">
                    <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No marketplace profile yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your marketplace profile to be discovered by customers
                    </p>
                    <Link
                      to={ROUTES.EDIT_PROFILE}
                      className="inline-flex items-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449] transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Profile
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="h-32 bg-gradient-to-br from-green-100 to-green-200"></div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {profile.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            📍 {profile.location || 'No location set'}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {profile.body || 'No description available'}
                          </p>
                          <div className="flex space-x-3">
                            <Link
                              to={`/producer/${profile.id}`}
                              className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              View Profile
                            </Link>
                            <Link
                              to={ROUTES.EDIT_PROFILE}
                              className="flex-1 text-center px-4 py-2 bg-[#83aa45] text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                              Edit
                            </Link>
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
    </div>
  );
};

export default DashboardPage;