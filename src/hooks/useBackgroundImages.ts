import { useState, useEffect } from 'react';
import { apiService, BackgroundImage } from '../lib/apiService';

// Utility function to load image with retry logic
const loadImageWithRetry = (src: string, maxRetries: number = 3): Promise<string> => {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const attemptLoad = () => {
      const img = new Image();
      
      img.onload = () => resolve(src);
      img.onerror = () => {
        retries++;
        if (retries < maxRetries) {
          console.warn(`Image load failed, retrying... (${retries}/${maxRetries})`);
          setTimeout(attemptLoad, 1000 * retries); // Exponential backoff
        } else {
          console.error(`Failed to load image after ${maxRetries} attempts:`, src);
          reject(new Error(`Failed to load image: ${src}`));
        }
      };
      
      img.src = src;
    };
    
    attemptLoad();
  });
};

export const useBackgroundImages = () => {
  const [backgroundImages, setBackgroundImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      fetchBackgroundImages();
    }, 100);
    
    // Listen for background image updates
    const handleBackgroundUpdate = () => {
      fetchBackgroundImages();
    };
    
    window.addEventListener('backgroundImagesUpdated', handleBackgroundUpdate);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('backgroundImagesUpdated', handleBackgroundUpdate);
    };
  }, []);

  const fetchBackgroundImages = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching background images...');
      const response = await apiService.getAllBackgroundImages();
      if (response.success && response.data) {
        const backgroundMap: Record<string, string> = {};
        
        response.data.forEach((bg: BackgroundImage) => {
          const key = `${bg.sectionType}-${bg.sectionName}`;
          // Convert relative URLs to proxy endpoint URLs
          let imageUrl = bg.backgroundImageUrl;
          if (imageUrl.startsWith('/uploads/')) {
            const filename = imageUrl.split('/').pop();
            imageUrl = `http://localhost:3001/api/image/${filename}`;
          }
          backgroundMap[key] = imageUrl;
          console.log(`Mapped ${key} to ${imageUrl}`);
        });
        
        console.log('Background images loaded:', backgroundMap);
        setBackgroundImages(backgroundMap);
      } else {
        console.warn('Failed to fetch background images:', response.message);
        // Don't set error for this, just use fallback images
      }
    } catch (err: any) {
      console.warn('Error fetching background images:', err.message);
      // Retry after a short delay
      setTimeout(() => {
        fetchBackgroundImages();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundImage = (sectionType: 'services' | 'portfolio', sectionName: string, fallback: string): string => {
    const key = `${sectionType}-${sectionName}`;
    const imageUrl = backgroundImages[key] || fallback;
    
    console.log(`getBackgroundImage(${sectionType}, ${sectionName}): key=${key}, found=${!!backgroundImages[key]}, url=${imageUrl}`);
    
    // If we don't have the background image yet and we're still loading, return fallback
    if (!backgroundImages[key] && loading) {
      console.log(`Still loading, using fallback for ${key}`);
      return fallback;
    }
    
    // Add simple cache busting parameter
    if (imageUrl.includes('localhost:3001')) {
      const timestamp = Date.now();
      const finalUrl = `${imageUrl}?v=${timestamp}`;
      console.log(`Final URL with cache busting: ${finalUrl}`);
      return finalUrl;
    }
    
    console.log(`Using fallback URL: ${imageUrl}`);
    return imageUrl;
  };

  // Health check function to verify backend connectivity
  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/health');
      return response.ok;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  };

  return {
    backgroundImages,
    loading,
    error,
    getBackgroundImage,
    refetch: fetchBackgroundImages,
    checkBackendHealth
  };
};
