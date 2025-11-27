import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home_page';
import Signup from './pages/Signup';

// Layout wrapper component that conditionally shows Header/Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(true);
  
  // Pages that have their own complete layout (Header, Footer included in the page)
  const standalonePages = ['/signup', '/login'];
  const isStandalonePage = standalonePages.includes(location.pathname);

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showBanner && (
        <div className="bg-button text-text py-3 relative animate-fade-in">
          <div className="max-w-[1170px] mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 flex-1 justify-center md:justify-start">
              <span className="text-xs md:text-sm">Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
              <a 
                href="#flash-sales" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('flash-sales')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-semibold underline ml-2 hover:text-button-1 transition-colors"
              >
                ShopNow
              </a>
            </div>
            <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-button-1 transition-colors">
              <span>English</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute right-4 md:relative md:right-0 hover:text-secondary-2 transition-colors ml-4"
              aria-label="Close banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<div className="p-8">Contact Page</div>} />
          <Route path="/about" element={<div className="p-8">About Page</div>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<div className="p-8">Login Page</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
