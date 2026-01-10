import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  Star,
  MessageSquare,
  Filter
} from 'lucide-react';
import { apiService, Review } from '../lib/apiService';

interface ReviewManagerProps {
  onClose: () => void;
}

const ReviewManager: React.FC<ReviewManagerProps> = ({ onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => r.status === filterStatus));
    }
  }, [filterStatus, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getAllReviews();
      if (response.success && response.data) {
        setReviews(response.data);
        setFilteredReviews(response.data);
      } else {
        setError(response.message || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setUpdating(id);
      setError('');
      
      const response = await apiService.updateReviewStatus(id, status);
      if (response.success && response.data) {
        setReviews(prev => 
          prev.map(r => r.id === id ? response.data! : r)
        );
        setSuccess(`Review ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'status updated'} successfully`);
        setTimeout(() => setSuccess(''), 3000);
        
        // Update selected review if it's the one being updated
        if (selectedReview?.id === id) {
          setSelectedReview(response.data);
        }

        // Trigger refresh on frontend if review was approved
        if (status === 'approved') {
          window.dispatchEvent(new CustomEvent('reviewsUpdated'));
        }
      } else {
        setError(response.message || 'Failed to update review status');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating review status');
    } finally {
      setUpdating(null);
    }
  };

  const deleteReview = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(id);
      setError('');
      
      const response = await apiService.deleteReview(id);
      if (response.success) {
        setReviews(prev => prev.filter(r => r.id !== id));
        setSuccess('Review deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        if (selectedReview?.id === id) {
          setSelectedReview(null);
        }
      } else {
        setError(response.message || 'Failed to delete review');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting review');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-lg">Loading reviews...</span>
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
              <h2 className="text-2xl font-bold text-gray-800">Review Management</h2>
              <p className="text-gray-600 mt-1">
                {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} 
                {filterStatus !== 'all' && ` (${filterStatus})`}
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

        {/* Filter Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex space-x-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="capitalize">{status}</span>
                {status !== 'all' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === status
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {reviews.filter(r => r.status === status).length}
                  </span>
                )}
              </button>
            ))}
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

        <div className="flex h-[calc(90vh-280px)]">
          {/* Reviews List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {filterStatus === 'all' ? 'All Reviews' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Reviews`}
              </h3>
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No {filterStatus === 'all' ? '' : filterStatus + ' '}reviews found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedReview?.id === review.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReview(review)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800">{review.client_name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(review.status)}`}>
                          {getStatusIcon(review.status)}
                          <span className="capitalize">{review.status}</span>
                        </span>
                      </div>
                      <div className="mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{review.comment}</p>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>{review.email}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedReview ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedReview.client_name}</h3>
                    <div className="mt-2">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedReview.status)}`}>
                    {getStatusIcon(selectedReview.status)}
                    <span className="capitalize">{selectedReview.status}</span>
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{selectedReview.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-medium text-gray-800">
                        {selectedReview.rating} out of 5 stars
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Review Comment
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap italic">"{selectedReview.comment}"</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800">Actions</h4>
                  
                  {/* Status Update */}
                  {selectedReview.status !== 'approved' && (
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, 'approved')}
                      disabled={updating === selectedReview.id}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updating === selectedReview.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Approve Review</span>
                    </button>
                  )}

                  {selectedReview.status !== 'rejected' && (
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, 'rejected')}
                      disabled={updating === selectedReview.id}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updating === selectedReview.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Reject Review</span>
                    </button>
                  )}

                  {selectedReview.status === 'approved' && (
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, 'pending')}
                      disabled={updating === selectedReview.id}
                      className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updating === selectedReview.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      <span>Mark as Pending</span>
                    </button>
                  )}

                  {selectedReview.status === 'rejected' && (
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, 'pending')}
                      disabled={updating === selectedReview.id}
                      className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updating === selectedReview.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      <span>Mark as Pending</span>
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => deleteReview(selectedReview.id)}
                    disabled={updating === selectedReview.id}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {updating === selectedReview.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Delete Review</span>
                  </button>
                </div>

                {/* Timestamps */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Submitted: {formatDate(selectedReview.createdAt)}</p>
                  {selectedReview.updatedAt !== selectedReview.createdAt && (
                    <p>Last updated: {formatDate(selectedReview.updatedAt)}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a review to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewManager;