import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-10 md:mb-20">
          <Link to="/" className="hover:text-secondary-2 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-2">404 Error</span>
        </div>

        {/* 404 Content */}
        <div className="flex flex-col items-center justify-center py-10 md:py-20">
          <h1 className="text-[60px] md:text-[110px] font-inter font-medium text-text-2 mb-6 md:mb-10 tracking-wider">
            404 Not Found
          </h1>
          <p className="text-base text-text-2 mb-10 md:mb-20 text-center max-w-md">
            Your visited page not found. You may go home page.
          </p>
          <Link to="/">
            <Button variant="primary">
              Back to home page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

