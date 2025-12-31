import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiService, Quotation } from '../lib/apiService';

interface QuotationManagerProps {
  onClose: () => void;
}

const QuotationManager: React.FC<QuotationManagerProps> = ({ onClose }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getAllQuotations();
      if (response.success && response.data) {
        setQuotations(response.data);
      } else {
        setError(response.message || 'Failed to fetch quotations');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching quotations');
    } finally {
      setLoading(false);
    }
  };

  const updateQuotationStatus = async (id: number, status: 'pending' | 'contacted' | 'completed') => {
    try {
      setUpdating(id);
      setError('');
      
      const response = await apiService.updateQuotationStatus(id, status);
      if (response.success) {
        setQuotations(prev => 
          prev.map(q => q.id === id ? { ...q, status } : q)
        );
        setSuccess(`Quotation status updated to ${status}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update quotation status');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating quotation status');
    } finally {
      setUpdating(null);
    }
  };

  const deleteQuotation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) {
      return;
    }

    try {
      setUpdating(id);
      setError('');
      
      const response = await apiService.deleteQuotation(id);
      if (response.success) {
        setQuotations(prev => prev.filter(q => q.id !== id));
        setSuccess('Quotation deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        if (selectedQuotation?.id === id) {
          setSelectedQuotation(null);
        }
      } else {
        setError(response.message || 'Failed to delete quotation');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting quotation');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'contacted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-lg">Loading quotations...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Quotation Management</h2>
              <p className="text-gray-600 mt-1">
                {quotations.length} quotation{quotations.length !== 1 ? 's' : ''} received
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex h-[calc(90vh-200px)]">
          {/* Quotations List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">All Quotations</h3>
              {quotations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No quotations received yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quotations.map((quotation) => (
                    <div
                      key={quotation.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedQuotation?.id === quotation.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedQuotation(quotation)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800">{quotation.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(quotation.status)}`}>
                          {getStatusIcon(quotation.status)}
                          <span className="capitalize">{quotation.status}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{quotation.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{quotation.service}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(quotation.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quotation Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedQuotation ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedQuotation.name}</h3>
                    <p className="text-gray-600">{selectedQuotation.service}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedQuotation.status)}`}>
                    {getStatusIcon(selectedQuotation.status)}
                    <span className="capitalize">{selectedQuotation.status}</span>
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{selectedQuotation.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-800">{selectedQuotation.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Event Date</p>
                      <p className="font-medium text-gray-800">{selectedQuotation.eventDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">{selectedQuotation.location}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Additional Details
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedQuotation.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800">Actions</h4>
                  
                  {/* Status Update */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateQuotationStatus(selectedQuotation.id, 'contacted')}
                      disabled={updating === selectedQuotation.id || selectedQuotation.status === 'contacted'}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updating === selectedQuotation.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Mark as Contacted</span>
                    </button>
                    <button
                      onClick={() => updateQuotationStatus(selectedQuotation.id, 'completed')}
                      disabled={updating === selectedQuotation.id || selectedQuotation.status === 'completed'}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updating === selectedQuotation.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Mark as Completed</span>
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteQuotation(selectedQuotation.id)}
                    disabled={updating === selectedQuotation.id}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {updating === selectedQuotation.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Delete Quotation</span>
                  </button>
                </div>

                {/* Timestamps */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Received: {formatDate(selectedQuotation.createdAt)}</p>
                  {selectedQuotation.updatedAt !== selectedQuotation.createdAt && (
                    <p>Last updated: {formatDate(selectedQuotation.updatedAt)}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a quotation to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationManager;
