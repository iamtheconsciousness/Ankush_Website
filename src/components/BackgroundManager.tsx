import React, { useState, useEffect } from 'react';
import { Upload, Image, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService, BackgroundImage } from '../lib/apiService';

interface BackgroundManagerProps {
  onClose: () => void;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ onClose }) => {
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Define available sections
  const servicesSections = [
    'Hero Banner',
    'Wedding Photography',
    'Portrait Sessions',
    'Commercial Work',
    'Fashion Photography', 
    'Pre Wedding Shots',
    'Event Coverage'
  ];

  const portfolioSections = [
    'Weddings',
    'Portraits', 
    'Landscapes',
    'Commercial',
    'Fashion',
    'Pre Wedding',
    'Engagement',
    'Events',
    'Maternity'
  ];

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getAllBackgroundImages();
      if (response.success && response.data) {
        setBackgrounds(response.data);
      } else {
        setError(response.message || 'Failed to fetch background images.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching background images.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (sectionType: 'services' | 'portfolio', sectionName: string, file: File) => {
    const uploadKey = `${sectionType}-${sectionName}`;
    setUploading(uploadKey);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('backgroundImage', file);
      formData.append('sectionType', sectionType);
      formData.append('sectionName', sectionName);

      const response = await apiService.uploadBackgroundImage(formData);
      if (response.success) {
        setSuccess(`Background image uploaded successfully for ${sectionName}!`);
        setTimeout(() => setSuccess(''), 3000);
        fetchBackgrounds(); // Refresh the list
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('backgroundImagesUpdated'));
      } else {
        setError(response.message || 'Failed to upload background image.');
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading background image.');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id: number, sectionName: string) => {
    if (!window.confirm(`Are you sure you want to delete the background image for ${sectionName}?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await apiService.deleteBackgroundImage(id);
      if (response.success) {
        setSuccess(`Background image deleted successfully for ${sectionName}!`);
        setTimeout(() => setSuccess(''), 3000);
        fetchBackgrounds(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete background image.');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting background image.');
    }
  };

  const getBackgroundForSection = (sectionType: 'services' | 'portfolio', sectionName: string): BackgroundImage | undefined => {
    return backgrounds.find(bg => bg.sectionType === sectionType && bg.sectionName === sectionName);
  };

  const renderSectionUpload = (sectionType: 'services' | 'portfolio', sectionName: string) => {
    const existingBackground = getBackgroundForSection(sectionType, sectionName);
    const uploadKey = `${sectionType}-${sectionName}`;
    const isUploading = uploading === uploadKey;

    return (
      <div key={`${sectionType}-${sectionName}`} className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">{sectionName}</h4>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {sectionType}
          </span>
        </div>

        {existingBackground && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Image className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Current Background</span>
            </div>
            <div className="flex items-center space-x-3">
              <img 
                src={existingBackground.backgroundImageUrl} 
                alt={`${sectionName} background`}
                className="w-16 h-12 object-cover rounded border"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{existingBackground.fileName}</p>
                <p className="text-xs text-gray-500">
                  {(existingBackground.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => handleDelete(existingBackground.id, sectionName)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete background image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            id={`upload-${uploadKey}`}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(sectionType, sectionName, file);
              }
            }}
            className="hidden"
            disabled={isUploading}
          />
          <label
            htmlFor={`upload-${uploadKey}`}
            className={`cursor-pointer flex flex-col items-center space-y-2 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-600">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {existingBackground ? 'Replace Background' : 'Upload Background'}
                </span>
                <span className="text-xs text-gray-500">Click to select image</span>
              </>
            )}
          </label>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Loading background images...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Background Images</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Services Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Services Section Backgrounds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesSections.map(section => renderSectionUpload('services', section))}
            </div>
          </div>

          {/* Portfolio Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Portfolio Section Backgrounds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioSections.map(section => renderSectionUpload('portfolio', section))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundManager;
