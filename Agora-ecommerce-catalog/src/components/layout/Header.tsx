import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-[1170px] mx-auto px-4 py-10 flex items-center justify-between">
        <Link to="/" className="text-2xl font-inter font-bold text-text-2">
          Exclusive
        </Link>
        <nav className="flex items-center gap-12">
          <Link to="/" className="text-base text-text-2">Home</Link>
          <Link to="/contact" className="text-base text-text-2">Contact</Link>
          <Link to="/about" className="text-base text-text-2">About</Link>
          <Link to="/signup" className="text-base text-text-2">Sign Up</Link>
        </nav>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-secondary rounded px-5 py-2 gap-8">
            <input type="text" placeholder="What are you looking for?" className="bg-transparent outline-none text-xs w-[200px]" />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-secondary-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

