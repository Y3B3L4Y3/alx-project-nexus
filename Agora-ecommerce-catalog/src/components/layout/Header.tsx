import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Get cart and wishlist counts from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1170px] mx-auto px-4 py-6 md:py-8 flex items-center justify-between">
        <Link to="/" className="text-2xl font-inter font-bold text-text-2 hover:text-secondary-2 transition-colors">
          Exclusive
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link to="/" className={`text-base transition-colors ${isActive('/') ? 'text-secondary-2 font-medium' : 'text-text-2 hover:text-secondary-2'}`}>Home</Link>
          <Link to="/contact" className={`text-base transition-colors ${isActive('/contact') ? 'text-secondary-2 font-medium' : 'text-text-2 hover:text-secondary-2'}`}>Contact</Link>
          <Link to="/about" className={`text-base transition-colors ${isActive('/about') ? 'text-secondary-2 font-medium' : 'text-text-2 hover:text-secondary-2'}`}>About</Link>
          <Link to="/signup" className={`text-base transition-colors ${isActive('/signup') ? 'text-secondary-2 font-medium' : 'text-text-2 hover:text-secondary-2'}`}>Sign Up</Link>
        </nav>

        {/* Icons & Search */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center bg-secondary rounded px-4 py-2 gap-3">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="bg-transparent outline-none text-sm w-[180px] placeholder:text-gray-500" 
            />
            <svg className="w-5 h-5 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <Link to="/wishlist" className="relative group" aria-label="Wishlist">
            <svg className={`w-7 h-7 transition-colors ${isActive('/wishlist') ? 'text-secondary-2 fill-secondary-2' : 'text-text-2 group-hover:text-secondary-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-2 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative group" aria-label="Cart">
            <svg className="w-7 h-7 text-text-2 group-hover:text-secondary-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-2 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-text-2 hover:text-secondary-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/" className="text-base text-text-2 hover:text-secondary-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/contact" className="text-base text-text-2 hover:text-secondary-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/about" className="text-base text-text-2 hover:text-secondary-2" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/signup" className="text-base text-text-2 hover:text-secondary-2" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
          <div className="flex items-center bg-secondary rounded px-4 py-2 gap-3 mt-2">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500" 
            />
            <svg className="w-5 h-5 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
