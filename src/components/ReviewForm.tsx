import { useState, FormEvent } from 'react';
import { X, Star, Send } from 'lucide-react';
import { apiService } from '../lib/apiService';

interface ReviewFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewForm({ onClose, onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    rating: 0,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRatingClick = (rating: number) => {
    setFormData({
      ...formData,
      rating
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (!formData.client_name.trim()) {
      setError('Please enter your name');
      setSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setSubmitting(false);
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please select a rating');
      setSubmitting(false);
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('Please write at least 10 characters in your review');
      setSubmitting(false);
      return;
    }

    try {
      const response = await apiService.submitReview({
        client_name: formData.client_name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        comment: formData.comment.trim()
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit review. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-400/20">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-purple-400/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-light text-purple-400">Share Your Experience</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            disabled={submitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 text-sm">
              Thank you for your review! It will be published after approval.
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="client_name" className="block text-white/80 mb-2 text-sm">
              Your Name *
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              disabled={submitting || success}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white/80 mb-2 text-sm">
              Your Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={submitting || success}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-white/80 mb-3 text-sm">
              Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={submitting || success}
                  className={`transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                    star <= (hoveredRating || formData.rating)
                      ? 'text-yellow-400'
                      : 'text-white/30'
                  }`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || formData.rating)
                        ? 'fill-current'
                        : ''
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 text-white/60 text-sm">
                  {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-white/80 mb-2 text-sm">
              Your Review *
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              rows={5}
              disabled={submitting || success}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Share your experience with us... (minimum 10 characters)"
              minLength={10}
            />
            <p className="mt-1 text-xs text-white/40">
              {formData.comment.length} / 10 minimum characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={submitting || success}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                submitting || success
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : success ? (
                <>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-lg">✓</span>
                  </div>
                  <span>Submitted!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting || success}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-white/40 text-center pt-2">
            Your review will be published after admin approval
          </p>
        </form>
      </div>
    </div>
  );
}