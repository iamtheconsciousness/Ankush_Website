import { Award, Camera, Heart, Users } from 'lucide-react';
import { photographerInfo } from '../data/portfolioData';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const stats = [
    { icon: Camera, value: '10+', label: 'Years Experience' },
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Heart, value: '10k+', label: 'Shoots' },
    { icon: Award, value: '15+', label: 'Awards Won' },
  ];

  const services = [
    {
      title: 'Wedding Photography',
      description:
        'Comprehensive wedding coverage from preparation to reception, capturing every precious moment of your special day.',
    },
    {
      title: 'Portrait Sessions',
      description:
        'Professional portrait photography for individuals, couples, families, and corporate headshots.',
    },
    {
      title: 'Commercial Work',
      description:
        'High-quality commercial photography for brands, products, and editorial content.',
    },
    {
      title: 'Event Coverage',
      description:
        'Complete event documentation for corporate functions, celebrations, and special occasions.',
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl sm:text-5xl font-light text-white mb-6 tracking-tight">
              About Me
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              {photographerInfo.bio}
            </p>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              My work has been featured in leading publications and I've had the
              privilege of working with clients around the world. Every project is
              an opportunity to tell a unique story through the lens.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-teal-400 text-black font-medium rounded-full hover:bg-teal-300 transition-all duration-300 shadow-lg hover:shadow-teal-400/50"
            >
              Work With Me
            </button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Photographer at work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-teal-400/20 rounded-lg backdrop-blur-sm border border-teal-400/30 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-teal-400 mx-auto mb-2" />
                <p className="text-white font-light">Passionate About</p>
                <p className="text-teal-400 font-medium">Storytelling</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-6 text-center border border-white/10 hover:border-teal-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <Icon className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <p className="text-3xl font-light text-white mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-light text-white mb-8 text-center">
            Services
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-8 border border-white/10 hover:border-teal-400/50 transition-all duration-300 group"
              >
                <h3 className="text-xl font-light text-white mb-3 group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-lg p-12 text-center border border-teal-400/30">
          <h2 className="text-3xl font-light text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Whether it's a wedding, portrait session, or commercial project, I'd love
            to hear about your vision and bring it to life.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-4 bg-teal-400 text-black font-medium rounded-full hover:bg-teal-300 transition-all duration-300 shadow-lg hover:shadow-teal-400/50"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}
