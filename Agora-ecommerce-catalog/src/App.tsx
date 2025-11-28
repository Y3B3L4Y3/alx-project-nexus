import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home_page';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Messages from './pages/admin/Messages';
import Settings from './pages/admin/Settings';

const App: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <Router>
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
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
