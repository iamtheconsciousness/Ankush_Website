import { Mail, Phone, Instagram, Send, MapPin, Camera, Linkedin } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { photographerInfo } from '../data/portfolioData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceInterest: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submission:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        serviceInterest: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div id="contact-section" className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light text-purple-400 mb-6 tracking-tight">
            Let's Create Together
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
            Ready to capture your special moments? Get in touch to discuss your photography needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-2 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/80 mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="serviceInterest" className="block text-white/80 mb-2 text-sm">
                  Service Interest
                </label>
                <select
                  id="serviceInterest"
                  name="serviceInterest"
                  value={formData.serviceInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                >
                  <option value="" className="bg-gray-800">Select a service</option>
                  <option value="wedding" className="bg-gray-800">Wedding Photography</option>
                  <option value="portrait" className="bg-gray-800">Portrait Sessions</option>
                  <option value="commercial" className="bg-gray-800">Commercial Photography</option>
                  <option value="event" className="bg-gray-800">Event Photography</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-white/80 mb-2 text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                  placeholder="Tell me about your vision..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`w-full py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  submitted
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-400/50'
                }`}
              >
                {submitted ? (
                  <>
                    <span>Thank you for contacting Ankush Frames!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Contact Info & CTA */}
          <div className="space-y-8">
            {/* Contact Information Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60 text-sm">Location</span>
                </div>
                <p className="text-white font-medium">New York, NY</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60 text-sm">Phone</span>
                </div>
                <p className="text-white font-medium">+1 (555) 123-4567</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60 text-sm">Email</span>
                </div>
                <p className="text-white font-medium">hello@photostudio.com</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <Instagram className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60 text-sm">Instagram</span>
                </div>
                <a 
                  href="https://www.instagram.com/ankush_frames/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-purple-400 transition-colors"
                >
                  @ankush_frames
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <Linkedin className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60 text-sm">LinkedIn</span>
                </div>
                <a 
                  href="https://www.linkedin.com/in/ankush-painuly-1890b020b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-purple-400 transition-colors"
                >
                  Ankush Painuly
                </a>
              </div>
            </div>

            {/* Ready to Book Section */}
            <div className="bg-white/5 rounded-lg p-8 border border-purple-400/30 text-center">
              <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Ready to Book?</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Let's discuss your vision and create something beautiful together. I'm excited to hear about your project!
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
