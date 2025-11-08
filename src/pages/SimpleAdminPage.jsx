import { uploadStoryTemplates, uploadProducerProfileTemplates, uploadAllTemplates } from '../utils/templateUploader';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function AdminTemplateUpload() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUploadStoryTemplates = async () => {
    try {
      setLoading(true);
      toast.loading('Uploading story templates...');
      const results = await uploadStoryTemplates(token);
      toast.dismiss();
      const successCount = results.filter(r => r.success).length;
      toast.success(`Story templates uploaded: ${successCount}/${results.length} successful`);
      console.log('Story templates upload complete:', results);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload story templates');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProducerTemplates = async () => {
    try {
      setLoading(true);
      toast.loading('Uploading producer profile templates...');
      const results = await uploadProducerProfileTemplates(token);
      toast.dismiss();
      const successCount = results.filter(r => r.success).length;
      toast.success(`Producer templates uploaded: ${successCount}/${results.length} successful`);
      console.log('Producer templates upload complete:', results);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload producer profile templates');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAll = async () => {
    try {
      setLoading(true);
      toast.loading('Uploading all templates...');
      const results = await uploadAllTemplates(token);
      toast.dismiss();
      const storySuccess = results.story.filter(r => r.success).length;
      const profileSuccess = results.profile.filter(r => r.success).length;
      toast.success(`All templates uploaded! Story: ${storySuccess}/${results.story.length}, Profile: ${profileSuccess}/${results.profile.length}`);
      console.log('All templates upload complete:', results);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload templates');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Header />
        <div className="max-w-4xl mx-auto text-center my-10 px-4">
            <h1 className="text-3xl font-bold mb-2">Template Upload Admin</h1>
            <p className="text-gray-600 mb-8">Upload template definitions to the backend database</p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Story Templates</h2>
                <p className="text-sm text-gray-600 mb-4">Upload Beef and Artisan story templates</p>
                <button
                  onClick={handleUploadStoryTemplates}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload Story Templates'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Producer Templates</h2>
                <p className="text-sm text-gray-600 mb-4">Upload Wine producer profile templates</p>
                <button
                  onClick={handleUploadProducerTemplates}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload Producer Templates'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">All Templates</h2>
                <p className="text-sm text-gray-600 mb-4">Upload all templates at once</p>
                <button
                  onClick={handleUploadAll}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload All Templates'}
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check browser console for detailed upload results</li>
                <li>• Templates must match frontend component structures</li>
                <li>• Upload creates new templates (doesn't update existing ones)</li>
              </ul>
            </div>
        </div>
    </>
  );
}