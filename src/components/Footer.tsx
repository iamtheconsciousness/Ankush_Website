import { photographerInfo } from '../data/portfolioData';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Ankush Painuly Photography. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}