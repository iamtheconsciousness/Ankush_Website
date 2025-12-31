import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';
import Portfolio from './components/Portfolio';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Check URL on component mount and when URL changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/portfolio') {
      setCurrentPage('portfolio');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Listen for URL changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage('admin');
      } else if (path === '/portfolio') {
        setCurrentPage('portfolio');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    
    // Update URL
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'portfolio') {
      window.history.pushState({}, '', '/portfolio');
    } else {
      window.history.pushState({}, '', '/');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show admin page if current page is admin
  if (currentPage === 'admin') {
    return <AdminPage />;
  }

  // Show portfolio page if current page is portfolio
  if (currentPage === 'portfolio') {
    return <Portfolio />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation onNavigate={handleNavigate} currentPage={currentPage} />

      <Hero onNavigate={handleNavigate} />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
export default App;