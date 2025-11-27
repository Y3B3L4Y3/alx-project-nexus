import React, { useState } from 'react';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, originalPrice, discount, image, rating, reviews, isNew = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = () => {
    alert(`Added "${title}" to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    alert(isWishlisted ? `Removed "${title}" from wishlist` : `Added "${title}" to wishlist!`);
  };

  const handleQuickView = () => {
    alert(`Quick view for "${title}"`);
  };

  const handleProductClick = () => {
    alert(`Navigating to "${title}" details page...`);
  };
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'fill-[#FFAD33]' : 'fill-gray-300'}`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="group flex flex-col gap-4 w-[270px] transform hover:scale-105 transition-all duration-300">
      <div className="relative bg-secondary rounded h-[250px] flex items-center justify-center overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow">
        {discount && (
          <div className="absolute top-3 left-3 bg-secondary-2 text-text px-3 py-1 rounded text-xs font-poppins z-10 animate-pulse">
            -{discount}%
          </div>
        )}
        {isNew && (
          <div className="absolute top-3 left-3 bg-button-1 text-text px-3 py-1 rounded text-xs font-poppins z-10 animate-bounce-slow">
            NEW
          </div>
        )}
        
        {/* Wishlist and Quick View Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); handleWishlist(); }}
            className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
              isWishlisted 
                ? 'bg-secondary-2 text-white' 
                : 'bg-white hover:bg-secondary-2 hover:text-white'
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleQuickView(); }}
            className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center hover:bg-secondary-2 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
            title="Quick view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>

        <img 
          src={image} 
          alt={title} 
          onClick={handleProductClick}
          className="max-h-[180px] max-w-[190px] object-contain transform group-hover:scale-110 transition-transform duration-300" 
        />
        
        {/* Add to Cart on Hover */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
          className="absolute bottom-0 left-0 right-0 bg-button text-white py-2 font-poppins font-medium text-base opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800 transform translate-y-2 group-hover:translate-y-0"
        >
          Add To Cart
        </button>
      </div>
      
      <div className="flex flex-col gap-2 cursor-pointer" onClick={handleProductClick}>
        <h3 className="font-poppins font-medium text-base text-text-2 hover:text-secondary-2 transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-secondary-2 font-poppins font-medium text-base">${price}</span>
          {originalPrice && (
            <span className="text-button opacity-50 font-poppins font-medium text-base line-through">
              ${originalPrice}
            </span>
          )}
          {discount && (
            <span className="text-xs text-button-1 font-semibold bg-green-100 px-2 py-0.5 rounded">
              Save ${originalPrice! - price}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
          <span className="text-text-2 opacity-50 font-poppins font-semibold text-sm">({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

