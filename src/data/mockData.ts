// Mock data for frontend-only photography portfolio
export interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
  width: number;
  height: number;
  media_type?: 'photo' | 'video' | 'reel';
}

export const mockPhotos: Photo[] = [
  // Portrait Category
  {
    id: '1',
    url: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Professional Headshot',
    category: 'Portrait',
    width: 1200,
    height: 1800,
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Studio Portrait',
    category: 'Portrait',
    width: 1200,
    height: 1500,
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/1674666/pexels-photo-1674666.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Natural Light Portrait',
    category: 'Portrait',
    width: 1200,
    height: 1600,
  },
  
  // Wedding Category
  {
    id: '4',
    url: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Wedding Ceremony',
    category: 'Wedding',
    width: 1200,
    height: 800,
  },
  {
    id: '5',
    url: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Bridal Portrait',
    category: 'Wedding',
    width: 1200,
    height: 1800,
  },
  {
    id: '6',
    url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Reception Celebration',
    category: 'Wedding',
    width: 1200,
    height: 800,
  },
  
  // Fashion Category
  {
    id: '7',
    url: 'https://images.pexels.com/photos/1936936/pexels-photo-1936936.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Fashion Editorial',
    category: 'Fashion',
    width: 1200,
    height: 1600,
  },
  {
    id: '8',
    url: 'https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Street Style',
    category: 'Fashion',
    width: 1200,
    height: 1800,
  },
  {
    id: '9',
    url: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Model Portfolio',
    category: 'Fashion',
    width: 1200,
    height: 1800,
  },
  
  // Commercial Category
  {
    id: '10',
    url: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Product Photography',
    category: 'Commercial',
    width: 1200,
    height: 1200,
  },
  {
    id: '11',
    url: 'https://images.pexels.com/photos/1124724/pexels-photo-1124724.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Brand Campaign',
    category: 'Commercial',
    width: 1200,
    height: 1600,
  },
  {
    id: '12',
    url: 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Corporate Headshots',
    category: 'Commercial',
    width: 1200,
    height: 1800,
  },
  
  // Engagement Category
  {
    id: '13',
    url: 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Engagement Session',
    category: 'Engagement',
    width: 1200,
    height: 800,
  },
  {
    id: '14',
    url: 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Couple Portrait',
    category: 'Engagement',
    width: 1200,
    height: 800,
  },
  {
    id: '15',
    url: 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Romantic Moments',
    category: 'Engagement',
    width: 1200,
    height: 800,
  },
];

export const photographerInfo = {
  name: 'Ankush Painuly',
  tagline: 'Capturing Moments That Matter',
  bio: 'With over 10 years of experience in portrait, wedding, nature, landscape, commercial, and event photography, I specialize in creating timeless images that tell your unique story. My approach combines technical excellence with genuine human connection, ensuring every shoot feels natural and authentic.',
  email: 'ankushpainuly398@gmail.com',
  phone: '+91 8171476174',
  social: {
    instagram: 'https://www.instagram.com/ankush_frames/',
    linkedin: 'https://www.linkedin.com/in/ankush-painuly-1890b020b/',
  },
};

export const categories = [
  'All',
  'Portrait',
  'Wedding',
  'Fashion',
  'Commercial',
  'Engagement',
  'Pre Wedding',
  'Events',
  'Maternity'
];
