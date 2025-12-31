// Database Types
export interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  title: string;
  caption: string;
  category: string;
  media_type: 'photo' | 'video' | 'reel';
  uploaded_at: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
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

// API Response Types
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

export interface UploadRequest {
  title: string;
  caption: string;
  category: string;
}

export interface TextContentUpdate {
  key: string;
  value: string;
}

// Database Schema Types
export interface DatabaseMediaItem {
  id: string;
  file_name: string;
  file_url: string;
  title: string;
  caption: string;
  category: string;
  media_type: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTextContent {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}
