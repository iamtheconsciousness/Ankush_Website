-- D1-compatible schema for the photography portfolio

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT NOT NULL,
  media_type TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS text_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS background_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_type TEXT NOT NULL,
  section_name TEXT NOT NULL,
  background_image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section_type, section_name)
);

CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO text_content (key, value) VALUES
 ('photographer_name','Ankush Painuly'),
 ('tagline','Capturing Moments That Matter'),
 ('bio','With over 10 years of experience in portrait, wedding, nature, landscape, commercial, and event photography, I specialize in creating timeless images that tell your unique story. My approach combines technical excellence with genuine human connection, ensuring every shoot feels natural and authentic.'),
 ('email','ankushpainuly398@gmail.com'),
 ('phone','+91 8171476174'),
 ('instagram_url','https://www.instagram.com/ankush_frames/'),
 ('linkedin_url','https://www.linkedin.com/in/ankush-painuly-1890b020b/'),
 ('address',''),
 ('website_url',''),
 ('facebook_url',''),
 ('twitter_url','');

