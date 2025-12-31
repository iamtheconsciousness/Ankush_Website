import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Trash2, Eye, Lock } from 'lucide-react';
import { Photo } from '../data/portfolioData';
import { apiService, MediaItem } from '../lib/apiService';
import { isAdmin, logout } from '../lib/auth';
import AdminLogin from './AdminLogin';
import PortfolioCategory from './PortfolioCategory';

export default function Portfolio() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploader, setShowUploader] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Portrait'
  });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [adminMode, setAdminMode] = useState(isAdmin());
  const [showCategoryPage, setShowCategoryPage] = useState(false);
  const [selectedCategoryForPage, setSelectedCategoryForPage] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(photos.map((p) => p.category)))];

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    loadPhotos();
    
    // Check for category parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllMedia();
      if (response.success && response.data) {
        const convertedPhotos = response.data.map((mediaItem: MediaItem) => ({
          id: mediaItem.id,
          url: mediaItem.file_url,
          title: mediaItem.title,
          category: mediaItem.category,
          width: 1200, // Default width
          height: 800, // Default height
          media_type: mediaItem.media_type,
        }));
        setPhotos(convertedPhotos);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!formData.title.trim()) {
      alert('Please enter a title for the photo');
      return;
    }

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

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Convert to Photo format and add to photos
      const newPhoto: Photo = {
        id: photoMetadata.id,
        url: photoMetadata.file_url,
        title: photoMetadata.title,
        category: photoMetadata.category,
        width: 1200, // Default width
        height: 800, // Default height
        media_type: photoMetadata.media_type,
      };

      setPhotos(prev => [newPhoto, ...prev]);

      // Reset form
      setFormData({ title: '', category: 'Portrait' });
      
      // Close uploader after a brief delay
      setTimeout(() => {
        setShowUploader(false);
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!adminMode) return;
    
    if (!confirm(`Are you sure you want to delete "${photo.title}"?`)) {
      return;
    }

    try {
      const response = await apiService.deleteMedia(photo.id);
      if (response.success) {
        setPhotos(prev => prev.filter(p => p.id !== photo.id));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const handleAdminLogin = () => {
    setAdminMode(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    logout();
    setAdminMode(false);
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      setSelectedCategory(category);
      setShowCategoryPage(false);
    } else {
      setSelectedCategoryForPage(category);
      setShowCategoryPage(true);
    }
  };

  const handleBackToPortfolio = () => {
    setShowCategoryPage(false);
    setSelectedCategoryForPage('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = Array.from(e.dataTransfer.files);
    const mediaFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (mediaFiles.length > 0) {
      handleFileUpload(mediaFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Show category page if a specific category is selected
  if (showCategoryPage) {
    return (
      <PortfolioCategory
        category={selectedCategoryForPage}
        onBack={handleBackToPortfolio}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-4 tracking-tight">
            Portfolio
          </h1>
          <p className="text-white/60 text-lg mb-8">
            A curated collection of my finest work
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-teal-400 text-black shadow-lg shadow-teal-400/50'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-lg bg-white/5 cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                {photo.media_type === 'video' ? (
                  <video
                    src={photo.url}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-light mb-2">{photo.title}</h3>
                  <p className="text-teal-400 text-sm">{photo.category}</p>
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(photo);
                    }}
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </button>
                  
                  {adminMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo);
                      }}
                      className="w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center border border-red-500/30 hover:bg-red-500/30 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-teal-400/20 backdrop-blur-sm flex items-center justify-center border border-teal-400/50">
                  <svg
                    className="w-5 h-5 text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
              <ImageIcon className="w-12 h-12 text-white/40" />
            </div>
            <h3 className="text-white text-xl font-medium mb-2">No photos yet</h3>
            <p className="text-white/60 mb-6">
              {adminMode 
                ? 'Start building your portfolio by uploading your first photo'
                : 'Portfolio is being prepared. Check back soon!'
              }
            </p>
            {adminMode && (
              <button
                onClick={() => setShowUploader(true)}
                className="px-6 py-3 bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-colors font-medium"
              >
                Upload Your First Photo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-white">Upload Photo</h2>
              <button
                onClick={() => setShowUploader(false)}
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
                  <option value="Portrait" className="bg-gray-800">Portrait</option>
                  <option value="Wedding" className="bg-gray-800">Wedding</option>
                  <option value="Fashion" className="bg-gray-800">Fashion</option>
                  <option value="Landscape" className="bg-gray-800">Landscape</option>
                  <option value="Commercial" className="bg-gray-800">Commercial</option>
                  <option value="Event" className="bg-gray-800">Event</option>
                </select>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  uploading
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
                      <p className="text-white font-medium mb-2">Drop your media here</p>
                      <p className="text-white/60 text-sm mb-4">Photos, videos, reels - all formats supported</p>
                      <input
                        type="file"
                        accept="image/*,video/*"
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
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-6xl max-h-[90vh] w-full">
            <div className="relative">
              {selectedPhoto.media_type === 'video' ? (
                <video
                  src={selectedPhoto.url}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl mx-auto"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl mx-auto"
                />
              )}
              
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <h3 className="text-white text-2xl font-light mb-2">{selectedPhoto.title}</h3>
              <p className="text-teal-400 mb-2">{selectedPhoto.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}