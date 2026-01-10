// API service for backend integration
import { mockPhotos, Photo } from '../data/mockData';

export interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  title: string;
  caption: string;
  category: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
  media_type: 'photo' | 'video' | 'reel';
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
  };
  message: string;
}

export interface TextContent {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface BackgroundImage {
  id: number;
  sectionType: 'services' | 'portfolio';
  sectionName: string;
  backgroundImageUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationRequest {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  message: string;
  service: string;
}

export interface Quotation {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  message: string;
  service: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  client_name: string;
  email: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  client_name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    // Use environment variable or default to localhost
    // default to same-origin /api for Cloudflare Pages + Functions
    this.baseURL = import.meta.env.VITE_API_URL || '/api';
    this.token = localStorage.getItem('adminToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response format. Expected JSON, got: ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('adminToken', response.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request<ApiResponse>('/auth/logout', {
        method: 'POST',
      });
      
      this.token = null;
      localStorage.removeItem('adminToken');
      
      return response;
    } catch (error) {
      // Even if the request fails, clear local storage
      this.token = null;
      localStorage.removeItem('adminToken');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  // Media methods
  async getAllMedia(): Promise<ApiResponse<MediaItem[]>> {
    return this.request<ApiResponse<MediaItem[]>>('/media');
  }

  async getMediaByCategory(category: string): Promise<ApiResponse<MediaItem[]>> {
    return this.request<ApiResponse<MediaItem[]>>(`/media/category/${encodeURIComponent(category)}`);
  }

  async getMediaById(id: string): Promise<ApiResponse<MediaItem>> {
    // URL encode the ID to handle slashes (e.g., "media/uuid")
    const encodedId = encodeURIComponent(id);
    return this.request<ApiResponse<MediaItem>>(`/media/${encodedId}`);
  }

  async uploadMedia(
    file: File,
    title: string,
    caption: string,
    category: string
  ): Promise<ApiResponse<MediaItem>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('category', category);

    return this.uploadRequest<ApiResponse<MediaItem>>('/media/upload', formData);
  }

  async updateMedia(id: string, updates: Partial<MediaItem>): Promise<ApiResponse<MediaItem>> {
    // URL encode the ID to handle slashes (e.g., "media/uuid")
    const encodedId = encodeURIComponent(id);
    return this.request<ApiResponse<MediaItem>>(`/media/${encodedId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMedia(id: string): Promise<ApiResponse> {
    // URL encode the ID to handle slashes (e.g., "media/uuid")
    const encodedId = encodeURIComponent(id);
    return this.request<ApiResponse>(`/media/${encodedId}`, {
      method: 'DELETE',
    });
  }

  // Text content methods
  async getTextContent(): Promise<ApiResponse<TextContent[]>> {
    return this.request<ApiResponse<TextContent[]>>('/text-content');
  }

  async getTextContentByKey(key: string): Promise<ApiResponse<TextContent>> {
    return this.request<ApiResponse<TextContent>>(`/text-content/${key}`);
  }

  async updateTextContent(key: string, value: string): Promise<ApiResponse<TextContent>> {
    return this.request<ApiResponse<TextContent>>('/text-content', {
      method: 'PUT',
      body: JSON.stringify({ key, value }),
    });
  }

  async updateMultipleTextContent(updates: { key: string; value: string }[]): Promise<ApiResponse<TextContent[]>> {
    return this.request<ApiResponse<TextContent[]>>('/text-content/multiple', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Background image methods
  async getAllBackgroundImages(): Promise<ApiResponse<BackgroundImage[]>> {
    return this.request<ApiResponse<BackgroundImage[]>>('/backgrounds');
  }

  async getBackgroundImagesBySectionType(sectionType: 'services' | 'portfolio'): Promise<ApiResponse<BackgroundImage[]>> {
    return this.request<ApiResponse<BackgroundImage[]>>(`/backgrounds/${sectionType}`);
  }

  async uploadBackgroundImage(formData: FormData): Promise<ApiResponse<BackgroundImage>> {
    return this.uploadRequest<ApiResponse<BackgroundImage>>('/admin/backgrounds', formData);
  }

  async deleteBackgroundImage(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/backgrounds/${id}`, {
      method: 'DELETE',
    });
  }

  // Quotation methods
  async submitQuotation(quotationData: QuotationRequest): Promise<ApiResponse<Quotation>> {
    return this.request<ApiResponse<Quotation>>('/quotations', {
      method: 'POST',
      body: JSON.stringify(quotationData),
    });
  }

  async getAllQuotations(): Promise<ApiResponse<Quotation[]>> {
    return this.request<ApiResponse<Quotation[]>>('/admin/quotations');
  }

  async getQuotationById(id: number): Promise<ApiResponse<Quotation>> {
    return this.request<ApiResponse<Quotation>>(`/admin/quotations/${id}`);
  }

  async updateQuotationStatus(id: number, status: 'pending' | 'contacted' | 'completed'): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/quotations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteQuotation(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/quotations/${id}`, {
      method: 'DELETE',
    });
  }

  // Review methods
  async submitReview(reviewData: ReviewRequest): Promise<ApiResponse<Review>> {
    return this.request<ApiResponse<Review>>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getApprovedReviews(): Promise<ApiResponse<Review[]>> {
    return this.request<ApiResponse<Review[]>>('/reviews/approved');
  }

  async getAllReviews(status?: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<Review[]>> {
    const query = status ? `?status=${status}` : '';
    return this.request<ApiResponse<Review[]>>(`/admin/reviews${query}`);
  }

  async getReviewById(id: number): Promise<ApiResponse<Review>> {
    return this.request<ApiResponse<Review>>(`/admin/reviews/${id}`);
  }

  async updateReviewStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<Review>> {
    return this.request<ApiResponse<Review>>(`/admin/reviews/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteReview(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/health');
  }
}

export const apiService = new ApiService();