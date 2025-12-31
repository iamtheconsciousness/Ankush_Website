import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit3, 
  X, 
  User, 
  Mail, 
  Phone, 
  Instagram, 
  Linkedin, 
  Globe,
  FileText,
  Loader2
} from 'lucide-react';
import { apiService, TextContent } from '../lib/apiService';

interface TextContentEditorProps {
  onClose: () => void;
}

const TextContentEditor: React.FC<TextContentEditorProps> = ({ onClose }) => {
  const [textContent, setTextContent] = useState<TextContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchTextContent();
  }, []);

  const fetchTextContent = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTextContent();
      if (response.success) {
        setTextContent(response.data || []);
      } else {
        setError('Failed to fetch text content');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch text content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    try {
      setSaving(true);
      setError('');
      
      const response = await apiService.updateTextContent(key, value);
      
      if (response.success) {
        setTextContent(prev => 
          prev.map(item => 
            item.key === key 
              ? { ...item, value, updated_at: new Date().toISOString() }
              : item
          )
        );
        setSuccess('Text content updated successfully!');
        setEditingKey(null);
        setTimeout(() => setSuccess(''), 3000);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('textContentUpdated'));
      } else {
        setError(response.message || 'Failed to update text content');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update text content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError('');
      
      const updates = textContent.map(item => ({
        key: item.key,
        value: item.value
      }));
      
      const response = await apiService.updateMultipleTextContent(updates);
      
      if (response.success) {
        setSuccess('All text content updated successfully!');
        setEditingKey(null);
        setTimeout(() => setSuccess(''), 3000);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('textContentUpdated'));
      } else {
        setError(response.message || 'Failed to update text content');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update text content');
    } finally {
      setSaving(false);
    }
  };

  const getFieldIcon = (key: string) => {
    switch (key) {
      case 'photographer_name':
        return <User className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'instagram_url':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin_url':
        return <Linkedin className="w-5 h-5" />;
      case 'website_url':
      case 'facebook_url':
      case 'twitter_url':
        return <Globe className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFieldLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      photographer_name: 'Photographer Name',
      tagline: 'Tagline',
      bio: 'Bio',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      instagram_url: 'Instagram URL',
      linkedin_url: 'LinkedIn URL',
      website_url: 'Website URL',
      facebook_url: 'Facebook URL',
      twitter_url: 'Twitter URL'
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isLongText = (key: string) => {
    return ['bio', 'tagline'].includes(key);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-white">Loading text content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Text Content</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
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

        {/* Text Content Fields */}
        <div className="space-y-6">
          {textContent.map((item) => (
            <div key={item.key} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                {getFieldIcon(item.key)}
                <label className="text-sm font-medium text-gray-300">
                  {getFieldLabel(item.key)}
                </label>
              </div>
              
              {editingKey === item.key ? (
                <div className="space-y-3">
                  {isLongText(item.key) ? (
                    <textarea
                      value={item.value}
                      onChange={(e) => setTextContent(prev => 
                        prev.map(i => i.key === item.key ? { ...i, value: e.target.value } : i)
                      )}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"
                      placeholder={`Enter ${getFieldLabel(item.key).toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={item.key.includes('email') ? 'email' : item.key.includes('url') ? 'url' : 'text'}
                      value={item.value}
                      onChange={(e) => setTextContent(prev => 
                        prev.map(i => i.key === item.key ? { ...i, value: e.target.value } : i)
                      )}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={`Enter ${getFieldLabel(item.key).toLowerCase()}`}
                    />
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSave(item.key, item.value)}
                      disabled={saving}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingKey(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white whitespace-pre-wrap">{item.value || 'No content'}</p>
                  </div>
                  <button
                    onClick={() => setEditingKey(item.key)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextContentEditor;
