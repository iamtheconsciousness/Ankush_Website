import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { getPhotosByCategory } from '../data/portfolioData';
import { Photo } from '../data/mockData';
import Lightbox from './Lightbox';

interface PortfolioCategoryProps {
  category: string;
  onBack: () => void;
}

const PortfolioCategory: React.FC<PortfolioCategoryProps> = ({ category, onBack }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPhotos();
  }, [category]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError('');
      const categoryPhotos = await getPhotosByCategory(category);
      setPhotos(categoryPhotos);
    } catch (err: any) {
      setError(err.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToNext = () => {
    if (selectedPhoto) {
      const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
      const nextIndex = (currentIndex + 1) % photos.length;
      setSelectedPhoto(photos[nextIndex]);
    }
  };

  const goToPrevious = () => {
    if (selectedPhoto) {
      const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
      const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
      setSelectedPhoto(photos[prevIndex]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading {category} portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={loadPhotos}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Portfolio</span>
            </button>
            <h1 className="text-2xl font-bold text-white">{category} Portfolio</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No photos found</h3>
            <p className="text-gray-400 mb-6">
              No photos have been uploaded for the {category} category yet.
            </p>
            <button
              onClick={onBack}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Back to Portfolio
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8">
              <p className="text-gray-400">
                Showing {photos.length} {photos.length === 1 ? 'photo' : 'photos'} in {category}
              </p>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(photo)}
                >
                  <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative">
                    {photo.media_type === 'video' || photo.media_type === 'reel' ? (
                      <video
                        src={photo.url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-white font-medium truncate">{photo.title}</h3>
                    <p className="text-gray-400 text-sm">{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrevious={goToPrevious}
          hasNext={photos.length > 1}
          hasPrevious={photos.length > 1}
        />
      )}
    </div>
  );
};

export default PortfolioCategory;
