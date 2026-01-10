-- Media table for storing uploaded photos, videos, and reels
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video', 'reel')),
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Text content table for storing dynamic content like contact info, bio, etc.
CREATE TABLE IF NOT EXISTS text_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Background images table for storing section background images
CREATE TABLE IF NOT EXISTS background_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_type TEXT NOT NULL CHECK (section_type IN ('services', 'portfolio')),
  section_name TEXT NOT NULL,
  background_image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section_type, section_name)
);

-- Quotations table for storing quotation requests
CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table for storing client reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default text content
INSERT OR IGNORE INTO text_content (key, value) VALUES
  ('photographer_name', 'Ankush Painuly'),
  ('tagline', 'Capturing Moments That Matter'),
  ('bio', 'With over 10 years of experience in portrait, wedding, nature, landscape, commercial, and event photography, I specialize in creating timeless images that tell your unique story. My approach combines technical excellence with genuine human connection, ensuring every shoot feels natural and authentic.'),
  ('email', 'ankushpainuly398@gmail.com'),
  ('phone', '+91 8171476174'),
  ('instagram_url', 'https://www.instagram.com/ankush_frames/'),
  ('linkedin_url', 'https://www.linkedin.com/in/ankush-painuly-1890b020b/'),
  ('address', ''),
  ('website_url', ''),
  ('facebook_url', ''),
  ('twitter_url', '');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_media_type ON media(media_type);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON media(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_text_content_key ON text_content(key);
CREATE INDEX IF NOT EXISTS idx_background_images_section_type ON background_images(section_type);
CREATE INDEX IF NOT EXISTS idx_background_images_section_name ON background_images(section_name);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at);
CREATE INDEX IF NOT EXISTS idx_quotations_service ON quotations(service);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);