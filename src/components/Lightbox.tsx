import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '../data/portfolioData';
import { useEffect } from 'react';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ photo, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-50"
        aria-label="Close lightbox"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden md:block"
        aria-label="Next image"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      <div
        className="max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative">
          {photo.media_type === 'video' ? (
            <video
              src={photo.url}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              controls
              autoPlay
            />
          ) : (
            <img
              src={photo.url}
              alt={photo.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-lg">
            <h3 className="text-white text-2xl font-light mb-1">{photo.title}</h3>
            <p className="text-teal-400">{photo.category}</p>
          </div>
        </div>
      </div>

      <div className="md:hidden absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
        <button
          onClick={onPrev}
          className="text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={onNext}
          className="text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
