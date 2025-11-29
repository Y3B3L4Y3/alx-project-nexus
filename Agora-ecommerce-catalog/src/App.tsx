import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import SkipToContent from './components/common/SkipToContent';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/home_page'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Products = lazy(() => import('./pages/Products'));

// User Account lazy imports
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AddressManagement = lazy(() => import('./pages/AddressManagement'));
const ProfileSettings = lazy(() => import('./pages/Profile_Settings'));

// Admin lazy imports
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const Users = lazy(() => import('./pages/admin/Users'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <LoadingSpinner />
  </div>
);

const App: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <Router>
      <SkipToContent />
      <div className="flex flex-col min-h-screen">
        {showBanner && (
          <div className="bg-button text-text py-3 relative animate-fade-in" role="banner">
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
                  aria-label="Shop now for flash sales"
                >
                  ShopNow
                </a>
              </div>
              <div 
                className="hidden md:flex items-center gap-1 cursor-pointer hover:text-button-1 transition-colors"
                role="button"
                tabIndex={0}
                aria-label="Select language"
              >
                <span>English</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button 
                onClick={() => setShowBanner(false)}
                className="absolute right-4 md:relative md:right-0 hover:text-secondary-2 transition-colors ml-4"
                aria-label="Close promotional banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<Users />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Customer Routes */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="flex-1" id="main-content" role="main">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/orders" element={<Orders />} />
                    <Route path="/account/orders/:id" element={<OrderDetail />} />
                    <Route path="/account/addresses" element={<AddressManagement />} />
                    <Route path="/account/settings" element={<ProfileSettings />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
