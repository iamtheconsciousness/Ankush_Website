import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Linkedin } from 'lucide-react';
import { getPhotographerInfo } from '../data/portfolioData';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navigation({ onNavigate, currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/ankushpainuly',
    linkedin: 'https://linkedin.com/in/ankushpainuly'
  });

  // Fetch social links from backend
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const info = await getPhotographerInfo();
        setSocialLinks({
          instagram: info.social.instagram,
          linkedin: info.social.linkedin
        });
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };
    
    fetchSocialLinks();
  }, []);

  // Listen for text content updates from admin panel
  useEffect(() => {
    const handleTextContentUpdate = () => {
      const fetchSocialLinks = async () => {
        try {
          const info = await getPhotographerInfo();
          setSocialLinks({
            instagram: info.social.instagram,
            linkedin: info.social.linkedin
          });
        } catch (error) {
          console.error('Error fetching social links:', error);
        }
      };
      
      fetchSocialLinks();
    };
    
    window.addEventListener('textContentUpdated', handleTextContentUpdate);
    
    return () => {
      window.removeEventListener('textContentUpdated', handleTextContentUpdate);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', scrollTo: 'hero' },
    { id: 'about', label: 'About', scrollTo: 'about-section' },
    { id: 'portfolio', label: 'Portfolio', scrollTo: 'portfolio-section' },
    { id: 'services', label: 'Services', scrollTo: 'services-section' },
    { id: 'reviews', label: 'Reviews', scrollTo: 'reviews-section' },
    { id: 'contact', label: 'Contact', scrollTo: 'contact-section' },
  ];

  const handleNavClick = (item: any) => {
    if (item.scrollTo) {
      const element = document.getElementById(item.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent hover:bg-black/40 backdrop-blur-none hover:backdrop-blur-sm transition-all duration-300 group">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Empty space for logo */}
          <div></div>

          {/* Desktop Navigation - Hidden by default, visible on hover */}
          <div className="hidden lg:flex items-center space-x-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`text-white hover:text-gray-300 transition-colors ${
                  currentPage === item.id ? 'text-gray-300' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Section - Hidden by default, visible on hover */}
          <div className="hidden lg:flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Social Media Links */}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-gray-300 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800">
          <div className="px-8 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`block w-full text-left py-3 transition-colors ${
                  currentPage === item.id
                    ? 'text-white border-l-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Social Media Links for Mobile */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}