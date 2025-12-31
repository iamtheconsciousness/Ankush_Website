import { Heart, Camera, Building, Calendar, Clock, Star } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Heart,
      title: 'Wedding Photography',
      description: 'Capture your special day with romantic, timeless imagery that tells your love story.',
      features: [
        '8-hour coverage',
        'Engagement session',
        '500+ edited photos',
        'Online gallery'
      ],
      price: 'Starting at $2,500'
    },
    {
      icon: Camera,
      title: 'Portrait Sessions',
      description: 'Professional portraits that showcase your personality and capture your essence.',
      features: [
        '1-2 hour session',
        '50+ edited photos',
        'Multiple outfit changes',
        'Location flexibility'
      ],
      price: 'Starting at $350'
    },
    {
      icon: Building,
      title: 'Commercial Photography',
      description: 'High-quality images for your business, products, and brand marketing needs.',
      features: [
        'Product photography',
        'Brand imagery',
        'Team headshots',
        'Commercial rights'
      ],
      price: 'Starting at $500'
    },
    {
      icon: Calendar,
      title: 'Event Photography',
      description: 'Document your special events with professional coverage and beautiful memories.',
      features: [
        'Full event coverage',
        'Candid moments',
        '200+ edited photos',
        'Quick turnaround'
      ],
      price: 'Starting at $800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light text-purple-400 mb-6 tracking-tight">
            Services
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
            Professional photography services tailored to capture your most important moments
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-8 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-white mb-2">{service.title}</h3>
                    <p className="text-white/70 leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/70">
                        <Star className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-light text-purple-400">{service.price}</div>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Turnaround Section */}
        <div className="bg-white/5 rounded-lg p-8 border border-purple-400/30">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-light text-white mb-2">Quick Turnaround</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Most projects are delivered within 2-3 weeks, with sneak peeks available within 48 hours of your session.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium">
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
