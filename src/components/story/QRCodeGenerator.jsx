// File: src/components/story/QRCodeGenerator.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Download, Share2, Copy, CheckCircle, Eye, Home, QrCode as QrCodeIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { getStoryById } from '../../api/storiesApi';
import { APP_URLS, QR_CONFIG } from '../../utils/constants';
import toast from 'react-hot-toast';

const QRCodeGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storyUrl, setStoryUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState(QR_CONFIG.SIZE);

  useEffect(() => {
    fetchStory();
  }, [id]);

  useEffect(() => {
    if (storyUrl && canvasRef.current) {
      generateQRCode();
    }
  }, [storyUrl, qrSize]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const data = await getStoryById(id);
      setStory(data);
      
      // Generate story URL
      const url = `${APP_URLS.STORY_BASE}/${id}`;
      setStoryUrl(url);
    } catch (error) {
      toast.error('Failed to load story');
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, storyUrl, {
        width: qrSize,
        margin: QR_CONFIG.MARGIN,
        color: {
          dark: QR_CONFIG.COLOR.DARK,
          light: QR_CONFIG.COLOR.LIGHT,
        },
        errorCorrectionLevel: QR_CONFIG.ERROR_CORRECTION,
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const handleDownloadQR = () => {
    try {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${story?.name || 'story'}-qr-code.png`;
      link.href = url;
      link.click();
      toast.success('QR code downloaded successfully!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(storyUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error copying URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.name || 'My Story',
          text: `Check out my story: ${story?.name}`,
          url: storyUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg border-[#83aa45]"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Story not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Success Header */}
      <div className="bg-white shadow-sm border-b border-primary-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#83aa45]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Story Published!</h1>
                <p className="text-gray-600">Your QR code is ready to use</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <QrCodeIcon className="h-8 w-8 text-[#83aa45]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your QR Code</h2>
              <p className="text-gray-600">
                Scan to view: <span className="font-semibold">{story.name}</span>
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-6 rounded-xl border-4 border-gray-100 shadow-inner">
                <canvas ref={canvasRef} />
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Size
              </label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B9556] focus:border-[#8B9556]"
              >
                <option value={200}>Small (200px)</option>
                <option value={300}>Medium (300px)</option>
                <option value={400}>Large (400px)</option>
                <option value={500}>Extra Large (500px)</option>
              </select>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadQR}
              className="w-full flex items-center justify-center px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#7A8449] transition-colors font-medium shadow-sm"
            >
              <Download className="h-5 w-5 mr-2" />
              Download QR Code
            </button>
          </div>

          {/* Story Details & Actions */}
          <div className="space-y-6">
            {/* Story Info Card */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Story Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Story Name</p>
                  <p className="font-semibold text-gray-900">{story.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Story URL</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 truncate">
                      {storyUrl}
                    </code>
                    <button
                      onClick={handleCopyUrl}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy URL"
                    >
                      {copied ? (
                        <CheckCircle className="h-5 w-5 text-[#83aa45]" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/story/${id}`}
                  target="_blank"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Story
                </Link>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Story
                </button>
                <button
                  onClick={handleCopyUrl}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  {copied ? 'URL Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>

            {/* Instructions Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">How to Use</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Download the QR code above</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Print it on product packaging, labels, or signs</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Customers scan to read your story instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Share the URL on social media or your website</span>
                </li>
              </ol>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Print QR codes at least 2cm x 2cm for easy scanning</li>
                <li>• Test the QR code before mass printing</li>
                <li>• Place QR codes at eye level when possible</li>
                <li>• Use high-quality printing for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;