import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import type { RootState } from '../../redux/store';

interface ProductCardProps {
  id?: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  showTrashIcon?: boolean;
  onRemove?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id,
  title, 
  price, 
  originalPrice, 
  discount, 
  image, 
  rating, 
  reviews, 
  isNew = false,
  showTrashIcon = false,
  onRemove
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Simple stable hash for fallback numeric id if not provided
  const fallbackId = React.useMemo(() => {
    let hash = 0;
    const str = `${title}-${price}`;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
    return Math.abs(hash) || Date.now();
  }, [title, price]);

  const productId = id ?? fallbackId;

  // Check if product is in wishlist from Redux state
  const isInWishlist = useSelector((state: RootState) => 
    state.wishlist.items.some(item => item.id === productId)
  );

  // Fallback image if none provided
  const productImage = image || '/vite.svg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ id: productId, title, price, image: productImage }));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ 
      id: productId, 
      title, 
      price, 
      image: productImage,
      originalPrice,
      discount,
      rating,
      reviews
    }));
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const handleProductClick = () => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating: number) => {
    const stars = [] as React.ReactNode[];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? 'fill-[#FFAD33]' : 'fill-gray-300'}`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="group relative flex flex-col gap-3 sm:gap-4 w-full max-w-[270px] z-0 hover:z-10">
      <div 
        className="relative bg-secondary rounded h-[200px] sm:h-[250px] flex items-center justify-center overflow-visible cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
        onClick={handleProductClick}
      >
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-secondary-2 text-text px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-poppins z-20">
            -{discount}%
          </div>
        )}
        {/* New Badge */}
        {isNew && !discount && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-button-1 text-text px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-poppins z-20">
            NEW
          </div>
        )}
        
        {/* Wishlist / Remove / Quick View Buttons */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-30">
          {showTrashIcon ? (
            <button 
              onClick={handleRemove}
              className="w-8 h-8 sm:w-[34px] sm:h-[34px] bg-white rounded-full flex items-center justify-center hover:bg-secondary-2 hover:text-white transition-colors shadow-lg cursor-pointer"
              title="Remove from wishlist"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={handleWishlist}
              className={`w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                isInWishlist 
                  ? 'bg-secondary-2 text-white' 
                  : 'bg-white hover:bg-secondary-2 hover:text-white'
              }`}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
          {!showTrashIcon && (
            <button 
              onClick={handleQuickView}
              className="w-8 h-8 sm:w-[34px] sm:h-[34px] bg-white rounded-full flex items-center justify-center hover:bg-secondary-2 hover:text-white transition-all duration-300 shadow-lg cursor-pointer"
              title="View product"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Product Image */}
        <img 
          src={productImage} 
          alt={title} 
          className="max-h-[140px] sm:max-h-[180px] max-w-[150px] sm:max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none" 
          onError={(e) => {
            e.currentTarget.src = '/vite.svg';
          }}
        />
        
        {/* Add to Cart Button on Hover */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-button text-white py-2 sm:py-2.5 font-poppins font-medium text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800 cursor-pointer z-20"
          type="button"
        >
          Add To Cart
        </button>
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col gap-1.5 sm:gap-2 cursor-pointer" onClick={handleProductClick}>
        <h3 className="font-poppins font-medium text-sm sm:text-base text-text-2 hover:text-secondary-2 transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-secondary-2 font-poppins font-medium text-sm sm:text-base">${price}</span>
          {originalPrice && (
            <span className="text-button opacity-50 font-poppins font-medium text-sm sm:text-base line-through">
              ${originalPrice}
            </span>
          )}
          {discount && originalPrice && (
            <span className="text-[10px] sm:text-xs text-button-1 font-semibold bg-green-100 px-1.5 sm:px-2 py-0.5 rounded">
              Save ${originalPrice - price}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
          <span className="text-text-2 opacity-50 font-poppins font-semibold text-xs sm:text-sm">({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
