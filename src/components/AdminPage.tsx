import React, { useState, useEffect } from 'react';
import { 
  Image, 
  Video, 
  Trash2, 
  Eye, 
  Plus, 
  LogOut, 
  Settings,
  FolderOpen,
  Calendar,
  FileText,
  Lock,
  User,
  X,
  Edit3,
  Palette,
  Star
} from 'lucide-react';
import { apiService, MediaItem, LoginRequest } from '../lib/apiService';
import TextContentEditor from './TextContentEditor';
import BackgroundManager from './BackgroundManager';
import QuotationManager from './QuotationManager';
import ReviewManager from './ReviewManager';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Login states
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Dashboard states
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadQueue, setUploadQueue] = useState<Array<{file: File, title: string, caption: string, category: string}>>([]);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const [uploadData, setUploadData] = useState({
    title: '',
    caption: '',
    category: 'Portrait'
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showBackgroundManager, setShowBackgroundManager] = useState(false);
  const [showQuotationManager, setShowQuotationManager] = useState(false);
  const [showReviewManager, setShowReviewManager] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Exactly 12 categories + 'All' = 13 total (matching Portfolio page)
  const categories = ['All', 'Portrait', 'Wedding', 'Fashion', 'Commercial', 'Event', 'Engagement', 'Pre Wedding', 'Maternity', 'Client Edits', 'Reels', 'Celebrity Shoots', 'Motion Graphics'];

  useEffect(() => {
    // Check if user is already authenticated
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setIsAuthenticated(true);
      fetchMedia();
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await apiService.login(loginData);

      if (response.success && response.token) {
        localStorage.setItem('adminToken', response.token);
        setIsAuthenticated(true);
        fetchMedia();
      } else {
        setLoginError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await apiService.getAllMedia();
      if (response.success) {
        setMediaItems(response.data || []);
      } else {
        setError('Failed to fetch media items');
      }
    } catch (error: any) {
      console.error('Error fetching media:', error);
      if (error.message.includes('401') || error.message.includes('Invalid token')) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      } else {
        setError('Failed to fetch media items');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      // Create upload queue with default titles
      const queue = files.map(file => ({
        file,
        title: file.name.split('.')[0],
        caption: uploadData.caption,
        category: uploadData.category
      }));
      setUploadQueue(queue);
      // Set default title if not already set
      if (!uploadData.title && files.length === 1) {
        setUploadData(prev => ({ ...prev, title: files[0].name.split('.')[0] }));
      }
    }
  };

  const updateQueueItem = (index: number, updates: Partial<{title: string, caption: string, category: string}>) => {
    setUploadQueue(prev => prev.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  };

  const handleUpload = async () => {
    if (uploadQueue.length === 0) return;

    setIsUploading(true);
    setError('');
    setUploadProgress({ current: 0, total: uploadQueue.length });

    const errors: string[] = [];
    const successCount = { count: 0 };

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < uploadQueue.length; i++) {
        const item = uploadQueue[i];
        setUploadProgress({ current: i + 1, total: uploadQueue.length });

        try {
          const response = await apiService.uploadMedia(
            item.file,
            item.title || item.file.name.split('.')[0],
            item.caption,
            item.category
          );

          if (response.success) {
            successCount.count++;
          } else {
            errors.push(`${item.file.name}: ${response.message || 'Upload failed'}`);
          }
        } catch (error: any) {
          errors.push(`${item.file.name}: ${error.message || 'Upload failed'}`);
        }
      }

      if (errors.length === 0) {
        setSuccess(`Successfully uploaded ${successCount.count} file(s)!`);
        setUploadData({ title: '', caption: '', category: 'Portrait' });
        setSelectedFiles([]);
        setUploadQueue([]);
        setShowUploadModal(false);
        fetchMedia();
        setTimeout(() => setSuccess(''), 5000);
      } else if (successCount.count > 0) {
        setSuccess(`Uploaded ${successCount.count} file(s) successfully. ${errors.length} failed.`);
        setError(errors.join('; '));
        fetchMedia(); // Refresh to show successfully uploaded items
        setTimeout(() => {
          setSuccess('');
          setError('');
        }, 5000);
      } else {
        setError(`All uploads failed: ${errors.join('; ')}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await apiService.deleteMedia(id);

      if (response.success) {
        setSuccess('Item deleted successfully!');
        fetchMedia();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to delete item');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      setError(error.message || 'Delete failed. Please try again.');
    }
  };

  const handleStartEdit = (item: MediaItem) => {
    setEditingItemId(item.id);
    setEditingTitle(item.title);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingTitle('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }

    try {
      const response = await apiService.updateMedia(id, { title: editingTitle });

      if (response.success) {
        setSuccess('Title updated successfully!');
        setEditingItemId(null);
        setEditingTitle('');
        fetchMedia();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update title');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update title. Please try again.');
    }
  };

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setMediaItems([]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to match categories (handle plural/singular variations)
  const categoryMatches = (itemCategory: string, filterCategory: string) => {
    if (itemCategory === filterCategory) return true;
    // Handle plural/singular mismatches
    if ((itemCategory === 'Weddings' && filterCategory === 'Wedding') || 
        (itemCategory === 'Wedding' && filterCategory === 'Weddings')) return true;
    if ((itemCategory === 'Portraits' && filterCategory === 'Portrait') || 
        (itemCategory === 'Portrait' && filterCategory === 'Portraits')) return true;
    if ((itemCategory === 'Events' && filterCategory === 'Event') || 
        (itemCategory === 'Event' && filterCategory === 'Events')) return true;
    return false;
  };

  const filteredMedia = selectedCategory === 'All' 
    ? mediaItems 
    : mediaItems.filter(item => categoryMatches(item.category, selectedCategory));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-gray-400">Enter your credentials to access the admin panel</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn || !loginData.email.trim() || !loginData.password.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Access Admin Panel'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Photography Portfolio Admin Panel
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">Manage your photography portfolio</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTextEditor(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Content</span>
              </button>
              <button
                onClick={() => setShowBackgroundManager(true)}
                className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Palette className="w-5 h-5" />
                <span>Manage Backgrounds</span>
              </button>
              <button
                onClick={() => setShowQuotationManager(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>View Quotations</span>
              </button>
              <button
                onClick={() => setShowReviewManager(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Manage Reviews</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                <Image className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mediaItems.length}</p>
                <p className="text-gray-400 text-sm">Total Media</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                <FolderOpen className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
                <p className="text-gray-400 text-sm">Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {mediaItems.filter(item => {
                    const today = new Date();
                    const uploadDate = new Date(item.uploaded_at);
                    return uploadDate.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-gray-400 text-sm">Today's Uploads</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatFileSize(mediaItems.reduce((total, item) => total + (item.file_size || 0), 0))}
                </p>
                <p className="text-gray-400 text-sm">Total Storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
              {/* Media Preview */}
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                {item.mime_type.startsWith('image/') ? (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => window.open(item.file_url, '_blank')}
                    className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="bg-blue-500/20 backdrop-blur-sm text-blue-400 p-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title="Edit title"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500/20 backdrop-blur-sm text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-4">
                {editingItemId === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(item.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="flex-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded hover:bg-gray-500/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-white font-semibold truncate flex-1">{item.title}</h3>
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="ml-2 text-gray-400 hover:text-orange-400 transition-colors flex-shrink-0"
                        title="Edit title"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                    <p className="text-gray-500 text-xs">
                      {formatFileSize(item.file_size)} • {new Date(item.uploaded_at).toLocaleDateString()}
                    </p>
                    {item.caption && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.caption}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No media found</h3>
            <p className="text-gray-400 mb-6">
              {selectedCategory === 'All' 
                ? 'Upload your first media item to get started'
                : `No media found in ${selectedCategory} category`
              }
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              Upload Media
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Upload Media</h2>
              <button
                onClick={() => {
                  if (!isUploading) {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadQueue([]);
                    setUploadData({ title: '', caption: '', category: 'Portrait' });
                    setError('');
                  }
                }}
                disabled={isUploading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Files (Multiple files allowed)
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                  multiple
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
                {selectedFiles.length > 0 && (
                  <p className="text-gray-400 text-sm mt-2">
                    {selectedFiles.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Upload Queue */}
              {uploadQueue.length > 0 && (
                <div className="max-h-64 overflow-y-auto space-y-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Files to Upload ({uploadQueue.length})
                  </label>
                  {uploadQueue.map((item, index) => (
                    <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{item.file.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(item.file.size)}</p>
                        </div>
                        <button
                          onClick={() => removeFromQueue(index)}
                          className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateQueueItem(index, { title: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 mb-2"
                        placeholder="Enter title"
                      />
                      <select
                        value={item.category}
                        onChange={(e) => updateQueueItem(index, { category: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Default Category (applies to all new files) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Category (for new files)
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) => {
                    setUploadData(prev => ({ ...prev, category: e.target.value }));
                    // Update all queue items
                    setUploadQueue(prev => prev.map(item => ({ ...item, category: e.target.value })));
                  }}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Caption (applies to all new files) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Caption (Optional, applies to all files)
                </label>
                <textarea
                  value={uploadData.caption}
                  onChange={(e) => {
                    setUploadData(prev => ({ ...prev, caption: e.target.value }));
                    // Update all queue items
                    setUploadQueue(prev => prev.map(item => ({ ...item, caption: e.target.value })));
                  }}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none"
                  placeholder="Enter caption (will apply to all files)"
                />
              </div>

              {/* Upload Progress */}
              {isUploading && uploadProgress.total > 0 && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress.current} / {uploadProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  if (!isUploading) {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadQueue([]);
                    setUploadData({ title: '', caption: '', category: 'Portrait' });
                    setError('');
                  }
                }}
                disabled={isUploading}
                className="flex-1 py-3 px-4 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadQueue.length === 0 || isUploading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isUploading ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : `Upload ${uploadQueue.length} File(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Content Editor Modal */}
      {showTextEditor && (
        <TextContentEditor onClose={() => setShowTextEditor(false)} />
      )}

      {/* Background Manager Modal */}
      {showBackgroundManager && (
        <BackgroundManager onClose={() => setShowBackgroundManager(false)} />
      )}

      {/* Quotation Manager Modal */}
      {showQuotationManager && (
        <QuotationManager onClose={() => setShowQuotationManager(false)} />
      )}

      {/* Review Manager Modal */}
      {showReviewManager && (
        <ReviewManager onClose={() => setShowReviewManager(false)} />
      )}
    </div>
  );
};

export default AdminPage;