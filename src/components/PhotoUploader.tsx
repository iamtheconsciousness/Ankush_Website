import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { apiService, MediaItem } from '../lib/apiService';

interface PhotoUploaderProps {
  onPhotoUploaded: (photo: MediaItem) => void;
  onClose: () => void;
}

export default function PhotoUploader({ onPhotoUploaded, onClose }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Portrait'
  });

  const categories = ['Portrait', 'Wedding', 'Fashion', 'Landscape', 'Commercial', 'Event'];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!formData.title.trim()) {
      alert('Please enter a title for the photo');
      return;
    }

    console.log('Starting upload:', { file: file.name, title: formData.title, category: formData.category });
    
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Calling uploadMedia function...');
      const response = await apiService.uploadMedia(
        file,
        formData.title,
        '', // caption
        formData.category
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      const photoMetadata = response.data!;
      console.log('Upload successful:', photoMetadata);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset form
      setFormData({ title: '', category: 'Portrait' });
      
      // Notify parent component
      onPhotoUploaded(photoMetadata);
      
      // Close after a brief delay
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-white">Upload Photo</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6">
            <label className="block text-white/80 text-sm mb-2">Photo Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:bg-white/20 transition-all"
              placeholder="Enter photo title..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white/80 text-sm mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:bg-white/20 transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? 'border-teal-400 bg-teal-400/10'
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-teal-400/20 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-teal-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-medium">Uploading...</p>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div
                      className="bg-teal-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-1">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-medium mb-2">Drop your photo here</p>
                  <p className="text-white/60 text-sm mb-4">or click to browse</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center px-4 py-2 bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Choose File
                  </label>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
