import { uploadAllTemplates } from '../utils/templateUploader';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';

export function AdminTemplateUpload() {
  const { token } = useAuth();
  
  const handleUpload = async () => {
    const results = await uploadAllTemplates(token);
    console.log('Upload complete:', results);
  };
  
  return (
    <>
        <Header />
        <div className="text-center my-10">
            <h1>Upload Templates to Backend</h1>
            <button onClick={handleUpload} className="mt-4 px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#98c253] transition-colors">
                Upload
            </button>
        </div>
    </>
  );
}