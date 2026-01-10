import React, { useState, useEffect } from 'react';
import { getPhotographerInfo } from '../data/portfolioData';
import SignatureTitle from './SignatureTitle';
import { Instagram, Linkedin, X, ExternalLink, Star, MessageSquare } from 'lucide-react';
import { useBackgroundImages } from '../hooks/useBackgroundImages';
import { apiService, Review } from '../lib/apiService';
import ReviewForm from './ReviewForm';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { getBackgroundImage, backgroundImages, refetch } = useBackgroundImages();
  const [servicesBackground, setServicesBackground] = useState<string | null>(null);
  const [forceRender, setForceRender] = useState(0);
  const [photographerInfo, setPhotographerInfo] = useState({
    name: 'Ankush Painuly',
    tagline: 'Capturing Moments That Matter',
    bio: 'Professional photographer with over 10 years of experience.',
    email: 'ankushpainuly398@gmail.com',
    phone: '+91 8171476174',
    social: {
      instagram: 'https://instagram.com/ankushpainuly',
      linkedin: 'https://linkedin.com/in/ankushpainuly'
    }
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [quotationModal, setQuotationModal] = useState<{ isOpen: boolean; service: string }>({
    isOpen: false,
    service: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
    message: ''
  });

  // Fetch photographer info from backend
  useEffect(() => {
    const fetchPhotographerInfo = async () => {
      try {
        const info = await getPhotographerInfo();
        setPhotographerInfo(info);
      } catch (error) {
        console.error('Error fetching photographer info:', error);
      }
    };
    
    fetchPhotographerInfo();
  }, []);

  // Fetch approved reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.getApprovedReviews();
        if (response.success && response.data) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    fetchReviews();
  }, []);

  // Listen for review updates from admin panel
  useEffect(() => {
    const handleReviewsUpdate = async () => {
      try {
        const response = await apiService.getApprovedReviews();
        if (response.success && response.data) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    window.addEventListener('reviewsUpdated', handleReviewsUpdate);
    
    return () => {
      window.removeEventListener('reviewsUpdated', handleReviewsUpdate);
    };
  }, []);

  // Listen for text content updates from admin panel
  useEffect(() => {
    const handleTextContentUpdate = () => {
      const fetchPhotographerInfo = async () => {
        try {
          const info = await getPhotographerInfo();
          setPhotographerInfo(info);
        } catch (error) {
          console.error('Error fetching photographer info:', error);
        }
      };
      
      fetchPhotographerInfo();
    };
    
    window.addEventListener('textContentUpdated', handleTextContentUpdate);
    
    return () => {
      window.removeEventListener('textContentUpdated', handleTextContentUpdate);
    };
  }, []);

  // Listen for background image updates from admin panel
  useEffect(() => {
    const handleBackgroundUpdate = () => {
      refetch();
    };
    
    window.addEventListener('backgroundImagesUpdated', handleBackgroundUpdate);
    
    return () => {
      window.removeEventListener('backgroundImagesUpdated', handleBackgroundUpdate);
    };
  }, [refetch]);

  // Force re-render when background images change
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, [backgroundImages]);

  const handleWeddingHover = () => {
    const dynamicBg = getBackgroundImage('services', 'Wedding Photography', '/wedding-photo.jpg');
    setServicesBackground(dynamicBg);
  };

  const handleWeddingLeave = () => {
    setServicesBackground(null);
  };

  const handlePortraitHover = () => {
    const dynamicBg = getBackgroundImage('services', 'Portrait Sessions', '/portrait-hover-bg.jpg');
    setServicesBackground(dynamicBg);
  };

  const handlePortraitLeave = () => {
    setServicesBackground(null);
  };

  const handleCommercialHover = () => {
    const dynamicBg = getBackgroundImage('services', 'Commercial Work', '/commercial-photo.jpg');
    setServicesBackground(dynamicBg);
  };

  const handleCommercialLeave = () => {
    setServicesBackground(null);
  };

  const handleFashionHover = () => {
    const dynamicBg = getBackgroundImage('services', 'Fashion Photography', '/fashion-photo.jpg');
    setServicesBackground(dynamicBg);
  };

  const handleFashionLeave = () => {
    setServicesBackground(null);
  };

  const handlePreWeddingHover = () => {
    const dynamicBg = getBackgroundImage('services', 'Pre Wedding Shots', '/prewedding-photo.jpg');
    setServicesBackground(dynamicBg);
  };

  const handlePreWeddingLeave = () => {
    setServicesBackground(null);
  };

  const handleEventCoverageHover = () => {
    const dynamicBg = getBackgroundImage('services', 'Event Coverage', '/commercial-photo.jpg');
    setServicesBackground(dynamicBg);
  };

  const handleEventCoverageLeave = () => {
    setServicesBackground(null);
  };

  const openQuotationModal = (service: string) => {
    setQuotationModal({ isOpen: true, service });
  };

  const closeQuotationModal = () => {
    setQuotationModal({ isOpen: false, service: '' });
    setFormData({
        name: '',
        email: '',
      phone: '',
      eventDate: '',
      location: '',
      message: ''
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const quotationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventDate: formData.eventDate,
        location: formData.location,
        message: formData.message,
        service: quotationModal.service
      };

      const response = await apiService.submitQuotation(quotationData);
      
      if (response.success) {
        alert('Thank you! We will get back to you with a quotation soon.');
        closeQuotationModal();
      } else {
        alert('Failed to submit quotation. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting quotation:', error);
      alert('Failed to submit quotation. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div>
      {/* Hero Section - Night Photography Background */}
      <div id="hero" className="relative h-screen w-full overflow-hidden">
        {/* Background Image - Night City Photography */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${getBackgroundImage('services', 'Hero Banner', '/ankiiii.jpg')}')`
          }}
        />
        {/* No overlay - seamless blend with header */}
        
        {/* Elegant Cursive Signature - Watermark Style */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-10">
          <SignatureTitle className="text-white" vertical={false} animated={true}>
            Ankush Painuly
          </SignatureTitle>
        </div>
      </div>

      {/* About Section */}
      <div id="about-section" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Me</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {photographerInfo.bio}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                With over 10 years of experience in photography, I specialize in capturing authentic moments and creating timeless memories. My passion lies in wedding photography, portrait sessions, and commercial work.
                </p>
              </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
                <div className="text-gray-600">Years Experience</div>
            </div>
                <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Happy Clients</div>
                </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">10k+</div>
                <div className="text-gray-600">Shoots</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
                <div className="text-gray-600">Awards Won</div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Portfolio Section - Redesigned */}
      <div id="portfolio-section" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">Our Portfolio</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">A curated collection of our finest photography work</p>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Weddings */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:-translate-y-4"
              onClick={() => window.open('/portfolio?category=Wedding', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Wedding portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Wedding', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Weddings', '/wedding-photo.jpg')}
                  alt="Wedding Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Wedding Photography</span>
          </div>
        </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Weddings
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">We capture your special day with the most beautiful moments and emotions.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
        </div>
      </div>

            {/* Pre Wedding */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:translate-y-4"
              onClick={() => window.open('/portfolio?category=Pre Wedding', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Pre Wedding portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Pre Wedding', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Pre Wedding', '/prewedding-photo.jpg')}
                  alt="Pre Wedding Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Pre Wedding Shoots</span>
          </div>
        </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Pre Wedding
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Our pre-wedding shoots will make your journey towards the wedding memorable.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
      </div>
      </div>

            {/* Engagement */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:translate-y-4 lg:ml-8"
              onClick={() => window.open('/portfolio?category=Engagement', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Engagement portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Engagement', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Engagement', '/engagement-photo.jpg')}
                  alt="Engagement Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Engagement Photography</span>
        </div>
      </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Engagement
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Celebrate your engagement with the perfect portraits capturing the essence of love.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
      </div>
          </div>

            {/* Fashion */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:-translate-y-4"
              onClick={() => window.open('/portfolio?category=Fashion', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Fashion portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Fashion', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Fashion', '/fashion-photo.jpg')}
                  alt="Fashion Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Fashion Photography</span>
    </div>
          </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Fashion
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Our fashion photography will make you stand out with the perfect combination of style and elegance.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
      </div>
              </div>
              
            {/* Portrait Photography */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:-translate-y-4 lg:mt-16"
              onClick={() => window.open('/portfolio?category=Portrait', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Portrait portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Portrait', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Portraits', '/portrait-photo.jpg')} 
                  alt="Portrait Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Portrait Photography</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Portrait
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Professional portraits that capture your personality and style with artistic flair.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
            </div>
          </div>

            {/* Commercial Photography */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:translate-y-4 lg:mt-16"
              onClick={() => window.open('/portfolio?category=Commercial', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Commercial portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Commercial', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Commercial', '/commercial-photo.jpg')}
                  alt="Commercial Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Commercial Photography</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Commercial
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">High-quality commercial photography for your business needs and brand promotion.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
        </div>
      </div>

            {/* Event Photography */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:translate-y-4 lg:ml-8 lg:mt-16"
              onClick={() => window.open('/portfolio?category=Event', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Event portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Event', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  key={`events-${forceRender}`}
                  src={getBackgroundImage('portfolio', 'Events', '/event-photo.jpg')} 
                  alt="Event Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    console.log('Events image failed to load:', e.currentTarget.src);
                    // Only hide if it's not the fallback image
                    if (!e.currentTarget.src.includes('/event-photo.jpg')) {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Event Photography</span>
                                  </div>
                                  </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Events
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Complete event documentation for special occasions and celebrations.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
                                </div>
            </div>

            {/* Maternity Photography */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:-translate-y-4 lg:mt-16"
              onClick={() => window.open('/portfolio?category=Maternity', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Maternity portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Maternity', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  key={`maternity-${forceRender}`}
                  src={getBackgroundImage('portfolio', 'Maternity', '/maternity-photo.jpg')} 
                  alt="Maternity Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    console.log('Maternity image failed to load:', e.currentTarget.src);
                    // Only hide if it's not the fallback image
                    if (!e.currentTarget.src.includes('/maternity-photo.jpg')) {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Maternity Photography</span>
              </div>
                          </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Maternity
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Celebrate the beautiful journey of motherhood with elegant maternity photography.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
                        </div>
                  </div>

            {/* Client Edits */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:-translate-y-4"
              onClick={() => window.open('/portfolio?category=Client Edits', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Client Edits portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Client Edits', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Client Edits', '/client-edits-photo.jpg')}
                  alt="Client Edits Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Client Edits</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Client Edits
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Expertly edited photographs showcasing refined post-processing and artistic enhancements.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
              </div>
            </div>

            {/* Reels */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:translate-y-4"
              onClick={() => window.open('/portfolio?category=Reels', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Reels portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Reels', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Reels', '/reels-photo.jpg')}
                  alt="Reels Video Content" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Video Reels</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Reels
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Dynamic video reels capturing moments in motion with cinematic storytelling.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
              </div>
            </div>

            {/* Celebrity Shoots */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:translate-y-4 lg:ml-8"
              onClick={() => window.open('/portfolio?category=Celebrity Shoots', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Celebrity Shoots portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Celebrity Shoots', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Celebrity Shoots', '/celebrity-photo.jpg')}
                  alt="Celebrity Photography" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Celebrity Photography</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Celebrity Shoots
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Exclusive celebrity photography sessions with high-end production value and style.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
              </div>
            </div>

            {/* Motion Graphics */}
            <div 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 transform lg:-translate-y-4"
              onClick={() => window.open('/portfolio?category=Motion Graphics', '_blank')}
              role="button"
              tabIndex={0}
              aria-label="View Motion Graphics portfolio in new tab"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/portfolio?category=Motion Graphics', '_blank');
                }
              }}
            >
              <div className="relative h-96 overflow-hidden p-4">
                <img 
                  src={getBackgroundImage('portfolio', 'Motion Graphics', '/motion-graphics-photo.jpg')}
                  alt="Motion Graphics" 
                  className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center hidden rounded-lg border-4 border-white shadow-lg">
                  <span className="text-gray-600 text-lg font-medium">Motion Graphics</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                  Motion Graphics
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">Creative motion graphics and animated visuals that bring your brand and stories to life.</p>
                <div className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Read More...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Services Section - Premium Photography Studio Style */}
        <div id="services-section" className="py-24 bg-gray-50 relative overflow-hidden">
          {/* Dynamic Background Image */}
          {servicesBackground && (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-60"
              style={{
                backgroundImage: `url(${servicesBackground})`
              }}
              onError={(e) => {
                console.warn('Failed to load background image:', servicesBackground);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          
          
          <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">Our Services</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">Professional photography services tailored to capture your most precious moments</p>
                                  </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Wedding Photography */}
            <div className="flip-card cursor-pointer" onMouseEnter={handleWeddingHover} onMouseLeave={handleWeddingLeave}>
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getBackgroundImage('services', 'Wedding Photography', '/wedding-photo.jpg')} 
                      alt="Wedding Photography" 
                      className="w-full aspect-[4/3] object-cover"
                                 onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                 }}
                               />
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Wedding Photography</span>
                                  </div>
                                </div>
                  <div className="pt-2 pb-4 px-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Wedding Photography</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-xs">Capturing your special day with artistic vision and timeless elegance.</p>
                    <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">Hover to Learn More</div>
                                </div>
                           </div>
                <div className="flip-card-back rounded-2xl overflow-hidden shadow-lg flex flex-col justify-center relative">
                  {/* Wedding Ceremony Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={'/wedding-photo.jpg?v=' + Date.now()}
                      alt="Beautiful Wedding Ceremony" 
                                 className="w-full h-full object-cover"
                                 onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Wedding Photography</span>
                             </div>
                            </div>

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  <div className="p-8 text-center relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">Wedding Photography</h3>
                    <ul className="text-gray-200 space-y-2 mb-6">
                      <li>• Full day coverage</li>
                      <li>• Pre-wedding consultation</li>
                      <li>• Online gallery</li>
                      <li>• Edited photos</li>
                      <li>• 2 photographers</li>
                    </ul>
                    <div className="text-pink-300 font-semibold mb-6">Starting from ₹50,000</div>
                    {/* Option 1: Glassmorphism Style */}
                                <button
                      onClick={() => openQuotationModal('Wedding Photography')}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-xl font-medium text-sm hover:bg-white/20 hover:border-white/30 hover:backdrop-blur-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                      Get Quotation
                                </button>
                            </div>
                          </div>
                        </div>
                  </div>

            {/* Portrait Sessions */}
            <div className="flip-card cursor-pointer" onMouseEnter={handlePortraitHover} onMouseLeave={handlePortraitLeave}>
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getBackgroundImage('services', 'Portrait Sessions', '/portrait-photo.jpg')} 
                      alt="Portrait Sessions" 
                      className="w-full aspect-[4/3] object-cover"
                                 onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                 }}
                               />
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Portrait Sessions</span>
                </div>
            </div>
                  <div className="pt-2 pb-4 px-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Portrait Sessions</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-xs">Professional portraits that tell your unique story with artistic flair.</p>
                    <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">Hover to Learn More</div>
              </div>
                  </div>
                <div className="flip-card-back bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-center">
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Portrait Sessions</h3>
                    <ul className="text-gray-600 space-y-2 mb-6">
                      <li>• 2-hour session</li>
                      <li>• Multiple locations</li>
                      <li>• Wardrobe consultation</li>
                      <li>• 50+ edited photos</li>
                      <li>• Online gallery</li>
                    </ul>
                    <div className="text-blue-600 font-semibold mb-6">Starting from ₹15,000</div>
                    {/* Option 2: Minimalist Outline */}
                           <button
                      onClick={() => openQuotationModal('Portrait Sessions')}
                      className="w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-white hover:text-gray-800 transition-all duration-300 hover:shadow-lg"
                           >
                      Get Quotation
                           </button>
                </div>
                  </div>
                </div>
                  </div>

            {/* Commercial Work */}
            <div className="flip-card cursor-pointer" onMouseEnter={handleCommercialHover} onMouseLeave={handleCommercialLeave}>
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getBackgroundImage('services', 'Commercial Work', '/commercial-photo.jpg')} 
                      alt="Commercial Work" 
                      className="w-full aspect-[4/3] object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Commercial Work</span>
                    </div>
                  </div>
                  <div className="pt-2 pb-4 px-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Commercial Photography</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-xs">High-quality commercial photography that elevates your business.</p>
                    <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">Hover to Learn More</div>
                  </div>
                </div>
                <div className="flip-card-back rounded-2xl overflow-hidden shadow-lg flex flex-col justify-center relative">
                  {/* Commercial Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={getBackgroundImage('services', 'Commercial Work', '/commercial-photo.jpg')}
                      alt="Professional Commercial Photography" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Commercial Photography</span>
                    </div>
                  </div>

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  <div className="p-8 text-center relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">Commercial Photography</h3>
                    <ul className="text-gray-200 space-y-2 mb-6">
                      <li>• Product photography</li>
                      <li>• Corporate headshots</li>
                      <li>• Brand campaigns</li>
                      <li>• High-res files</li>
                      <li>• Quick turnaround</li>
                    </ul>
                    <div className="text-green-300 font-semibold mb-6">Starting from ₹25,000</div>
                    {/* Glassmorphism Style Button */}
                    <button
                      onClick={() => openQuotationModal('Commercial Photography')}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-xl font-medium text-sm hover:bg-white/20 hover:border-white/30 hover:backdrop-blur-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>
                           
            {/* Event Coverage */}
            <div className="flip-card cursor-pointer" onMouseEnter={handleEventCoverageHover} onMouseLeave={handleEventCoverageLeave}>
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getBackgroundImage('services', 'Event Coverage', '/commercial-photo.jpg')} 
                      alt="Event Coverage" 
                      className="w-full aspect-[4/3] object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Event Coverage</span>
                    </div>
                  </div>
                  <div className="pt-2 pb-4 px-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Coverage</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-xs">Complete event documentation for special occasions and celebrations.</p>
                    <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">Hover to Learn More</div>
                  </div>
                </div>
                <div className="flip-card-back rounded-2xl overflow-hidden shadow-lg flex flex-col justify-center relative">
                  {/* Event Coverage Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={getBackgroundImage('services', 'Event Coverage', '/commercial-photo.jpg')}
                      alt="Professional Event Coverage" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Event Coverage</span>
                    </div>
                  </div>

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  <div className="p-8 text-center relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">Event Coverage</h3>
                    <ul className="text-gray-200 space-y-2 mb-6">
                      <li>• Corporate events</li>
                      <li>• Birthday parties</li>
                      <li>• Anniversaries</li>
                      <li>• Live coverage</li>
                      <li>• Same-day edits</li>
                    </ul>
                    <div className="text-orange-300 font-semibold mb-6">Starting from ₹20,000</div>
                    {/* Glassmorphism Style Button */}
                    <button
                      onClick={() => openQuotationModal('Event Coverage')}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-xl font-medium text-sm hover:bg-white/20 hover:border-white/30 hover:backdrop-blur-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fashion Photography */}
            <div className="flip-card cursor-pointer" onMouseEnter={handleFashionHover} onMouseLeave={handleFashionLeave}>
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getBackgroundImage('services', 'Fashion Photography', '/fashion-photo.jpg')} 
                      alt="Fashion Photography" 
                      className="w-full aspect-[4/3] object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Fashion Photography</span>
                             </div>
                             </div>
                  <div className="pt-2 pb-4 px-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Fashion Photography</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-xs">Professional fashion photography that brings your creative vision to life.</p>
                    <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">Hover to Learn More</div>
                           </div>
                           </div>
                <div className="flip-card-back rounded-2xl overflow-hidden shadow-lg flex flex-col justify-center relative">
                  {/* Fashion Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={getBackgroundImage('services', 'Fashion Photography', '/fashion-photo.jpg')}
                      alt="Professional Fashion Photography" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Fashion Photography</span>
                    </div>
                  </div>

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  <div className="p-8 text-center relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">Fashion Photography</h3>
                    <ul className="text-gray-200 space-y-2 mb-6">
                      <li>• Editorial shoots</li>
                      <li>• Model portfolios</li>
                      <li>• Fashion campaigns</li>
                      <li>• Studio setup</li>
                      <li>• Creative direction</li>
                    </ul>
                    <div className="text-purple-300 font-semibold mb-6">Starting from ₹30,000</div>
                    {/* Glassmorphism Style Button */}
                    <button
                      onClick={() => openQuotationModal('Fashion Photography')}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-xl font-medium text-sm hover:bg-white/20 hover:border-white/30 hover:backdrop-blur-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Quotation
                    </button>
                  </div>
                </div>
        </div>
      </div>

            {/* Pre Wedding */}
            <div className="flip-card cursor-pointer" onMouseEnter={handlePreWeddingHover} onMouseLeave={handlePreWeddingLeave}>
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getBackgroundImage('services', 'Pre Wedding Shots', '/prewedding-photo.jpg')} 
                      alt="Pre Wedding" 
                      className="w-full aspect-[4/3] object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Pre Wedding</span>
                    </div>
                  </div>
                  <div className="pt-2 pb-4 px-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pre Wedding Shoots</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-xs">Romantic pre-wedding sessions that capture your love story beautifully.</p>
                    <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">Hover to Learn More</div>
                  </div>
                </div>
                <div className="flip-card-back rounded-2xl overflow-hidden shadow-lg flex flex-col justify-center relative">
                  {/* Pre Wedding Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={getBackgroundImage('services', 'Pre Wedding Shots', '/prewedding-photo.jpg')}
                      alt="Beautiful Pre Wedding Photography" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center hidden">
                      <span className="text-gray-600 text-lg font-medium">Pre Wedding</span>
                    </div>
                  </div>

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  <div className="p-8 text-center relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">Pre Wedding Shoots</h3>
                    <ul className="text-gray-200 space-y-2 mb-6">
                      <li>• 4-hour session</li>
                      <li>• Multiple locations</li>
                      <li>• Outfit changes</li>
                      <li>• 100+ edited photos</li>
                      <li>• Love story album</li>
                    </ul>
                    <div className="text-rose-300 font-semibold mb-6">Starting from ₹35,000</div>
                    {/* Glassmorphism Style Button */}
                    <button
                      onClick={() => openQuotationModal('Pre Wedding Shoots')}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-xl font-medium text-sm hover:bg-white/20 hover:border-white/30 hover:backdrop-blur-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews-section" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Reviews</h2>
            <p className="text-gray-600 mb-6">What our clients say about our work</p>
            <button
              onClick={() => setReviewFormOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Share Your Experience</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                  <div className="text-gray-900 font-semibold">- {review.client_name}</div>
                  <div className="text-gray-500 text-sm mt-1">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {reviewFormOpen && (
        <ReviewForm
          onClose={() => setReviewFormOpen(false)}
          onSuccess={async () => {
            // Refresh reviews after successful submission
            try {
              const response = await apiService.getApprovedReviews();
              if (response.success && response.data) {
                setReviews(response.data);
              }
            } catch (error) {
              console.error('Error refreshing reviews:', error);
            }
          }}
        />
      )}

      {/* Let's Connect Section - Matching Website Theme */}
      <div id="contact-section" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">Let's Connect</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Ready to capture your story? Let's create something beautiful together.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="space-y-8">
            {/* Top Row - Three Main Boxes */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h3>
                <div className="space-y-6">
                  <a
                    href={`mailto:${photographerInfo.email}`}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">📧</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">Email Us</p>
                      <p className="text-gray-600">{photographerInfo.email}</p>
                    </div>
                  </a>
                  <a
                    href={`tel:${photographerInfo.phone}`}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">📱</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">Call Us</p>
                      <p className="text-gray-600">{photographerInfo.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent('Dehradun, Uttarakhand')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">📍</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">Visit Us</p>
                      <p className="text-gray-600">Dehradun, Uttarakhand</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${photographerInfo.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">💬</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">WhatsApp</p>
                      <p className="text-gray-600">Chat with us</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Follow Our Journey</h3>
                <div className="space-y-4">
                  <a
                    href={photographerInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">Instagram</p>
                      <p className="text-gray-600 text-sm">@ankushpainuly</p>
                    </div>
                  </a>
                  <a
                    href={photographerInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">LinkedIn</p>
                      <p className="text-gray-600 text-sm">Professional Network</p>
                    </div>
                  </a>
                  <a
                    href="https://facebook.com/ankushpainuly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg font-bold">f</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">Facebook</p>
                      <p className="text-gray-600 text-sm">Connect with us</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Ready to Start Box */}
              <div className="bg-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-white text-center h-full flex flex-col justify-center group hover:scale-105 transform">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Let's discuss your project and create something extraordinary together.
                  </p>
                </div>
                <button 
                  onClick={() => openQuotationModal('General Inquiry')}
                  className="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
                >
                  Get Started
                </button>
                <p className="text-gray-400 text-xs mt-4">
                  Free consultation • No obligation
                </p>
              </div>
            </div>

            {/* Bottom Row - Statistics Box */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
                  <div className="text-gray-600 font-medium">Happy Clients</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-gray-800 mb-2">10+</div>
                  <div className="text-gray-600 font-medium">Years Experience</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-gray-800 mb-2">10k+</div>
                  <div className="text-gray-600 font-medium">Shoots</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-gray-800 mb-2">24h</div>
                  <div className="text-gray-600 font-medium">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quotation Modal */}
      {quotationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Get Quotation</h3>
            <button
                  onClick={closeQuotationModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  Service: <span className="font-semibold text-gray-800">{quotationModal.service}</span>
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                </label>
                <input
                      type="text"
                      name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Your full name"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                </label>
                <input
                      type="email"
                      name="email"
                    value={formData.email}
                  onChange={handleInputChange}
                  required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="your.email@example.com"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                  onChange={handleInputChange}
                  required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="+91 9876543210"
                />
            </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                </label>
                <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                </label>
                <input
                  type="text"
                    name="location"
                    value={formData.location}
                  onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="City, State"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                  onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white resize-none"
                    placeholder="Tell us about your requirements, special requests, or any questions you have..."
                />
              </div>

                <div className="flex space-x-3 pt-4">
            <button
                    type="button"
                    onClick={closeQuotationModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
                    Cancel
            </button>
              <button
                type="submit"
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Send Request
              </button>
                </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}