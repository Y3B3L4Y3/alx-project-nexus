import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // Static suggested items (these would typically come from an API)
  const suggestedItems = [
    { id: 101, title: 'ASUS FHD Gaming Laptop', price: 960, originalPrice: 1160, discount: 35, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65 },
    { id: 102, title: 'IPS LCD Gaming Monitor', price: 1160, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65 },
    { id: 103, title: 'HAVIT HV-G92 Gamepad', price: 560, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65, isNew: true },
    { id: 104, title: 'AK-900 Wired Keyboard', price: 200, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65 },
  ];

  const handleRemoveFromWishlist = (id: number) => {
    dispatch(removeFromWishlist(id));
  };

  const handleMoveAllToBag = () => {
    // Add all wishlist items to cart
    wishlistItems.forEach(item => {
      dispatch(addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image
      }));
    });
    // Clear wishlist
    dispatch(clearWishlist());
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        
        {/* Wishlist Header */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <h1 className="text-xl font-poppins text-text-2">Wishlist ({wishlistItems.length})</h1>
          {wishlistItems.length > 0 && (
            <Button 
              variant="secondary" 
              className="px-8 py-3 md:px-12 md:py-4 h-12 md:h-14 text-sm md:text-base bg-white border border-gray-300 !text-black hover:bg-gray-50 hover:shadow-none transform-none"
              onClick={handleMoveAllToBag}
            >
              Move All To Bag
            </Button>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20 justify-items-center sm:justify-items-start">
            {wishlistItems.map(item => (
              <ProductCard 
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                originalPrice={item.originalPrice}
                discount={item.discount}
                image={item.image}
                rating={item.rating ?? 4}
                reviews={item.reviews ?? 0}
                showTrashIcon={true}
                onRemove={() => handleRemoveFromWishlist(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 mb-20 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
              <p className="text-gray-400 text-sm">Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
            </div>
          </div>
        )}

        {/* Just For You Header */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <div className="flex items-center gap-4">
            <div className="w-5 h-10 bg-secondary-2 rounded"></div>
            <h2 className="text-xl font-poppins text-text-2">Just For You</h2>
          </div>
          <Button 
            variant="secondary" 
            className="px-8 py-3 md:px-12 md:py-4 h-12 md:h-14 text-sm md:text-base bg-white border border-gray-300 !text-black hover:bg-gray-50 hover:shadow-none transform-none"
          >
            See All
          </Button>
        </div>

        {/* Suggested Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center sm:justify-items-start">
          {suggestedItems.map(item => (
            <ProductCard 
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              originalPrice={item.originalPrice}
              discount={item.discount}
              image={item.image}
              rating={item.rating}
              reviews={item.reviews}
              isNew={item.isNew}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
