// Portfolio data management with backend integration
import { mockPhotos, photographerInfo, categories, Photo } from './mockData';
import { apiService, MediaItem, TextContent } from '../lib/apiService';

// State for caching
let cachedPhotos: Photo[] = [];
let cachedTextContent: { [key: string]: string } = {};
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Convert MediaItem to Photo format
function convertMediaItemToPhoto(mediaItem: MediaItem): Photo {
  return {
    id: mediaItem.id,
    url: mediaItem.file_url,
    title: mediaItem.title,
    category: mediaItem.category,
    width: 1200, // Default width, could be extracted from image metadata
    height: 800, // Default height, could be extracted from image metadata
  };
}

// Get photos from backend API with fallback to mock data
export async function getPortfolioPhotos(): Promise<Photo[]> {
  try {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (cachedPhotos.length > 0 && (now - lastFetch) < CACHE_DURATION) {
      return cachedPhotos;
    }

    const response = await apiService.getAllMedia();
    if (response.success && response.data) {
      cachedPhotos = response.data.map(convertMediaItemToPhoto);
      lastFetch = now;
      return cachedPhotos;
    } else {
      // Fallback to mock data
      return mockPhotos;
    }
  } catch (error) {
    console.error('Error fetching photos from backend:', error);
    // Fallback to mock data
    return mockPhotos;
  }
}

// Get photos by category
export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  try {
    if (category === 'All') {
      return await getPortfolioPhotos();
    }

    const response = await apiService.getMediaByCategory(category);
    if (response.success && response.data) {
      return response.data.map(convertMediaItemToPhoto);
    } else {
      // Fallback to mock data
      return mockPhotos.filter(photo => photo.category === category);
    }
  } catch (error) {
    console.error('Error fetching photos by category:', error);
    // Fallback to mock data
    return mockPhotos.filter(photo => photo.category === category);
  }
}

// Get photographer information from backend with fallback
export async function getPhotographerInfo() {
  try {
    const response = await apiService.getTextContent();
    if (response.success && response.data) {
      const textContent = response.data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as { [key: string]: string });

      return {
        name: textContent.photographer_name || photographerInfo.name,
        tagline: textContent.tagline || photographerInfo.tagline,
        bio: textContent.bio || photographerInfo.bio,
        email: textContent.email || photographerInfo.email,
        phone: textContent.phone || photographerInfo.phone,
        social: {
          instagram: textContent.instagram_url || photographerInfo.social.instagram,
          linkedin: textContent.linkedin_url || photographerInfo.social.linkedin,
        },
      };
    } else {
      return photographerInfo;
    }
  } catch (error) {
    console.error('Error fetching photographer info from backend:', error);
    return photographerInfo;
  }
}

// Get available categories
export function getCategories() {
  return categories;
}

// For backward compatibility, export mock photos as default
export const portfolioPhotos = mockPhotos;

// Re-export types and data
export type { Photo } from './mockData';
export { photographerInfo, categories } from './mockData';