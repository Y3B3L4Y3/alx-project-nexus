import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { useGetProductByIdQuery, useGetRelatedProductsQuery, useGetProductReviewsQuery } from '../api/productApi';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import SEO from '../components/common/SEO';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '1', 10);
  const dispatch = useDispatch();
  
  // Fetch product data from API
  const { data: productResponse, isLoading, error } = useGetProductByIdQuery(productId);
  const { data: relatedResponse } = useGetRelatedProductsQuery({ productId, limit: 4 });
  const { data: reviewsResponse } = useGetProductReviewsQuery(productId);

  const product = productResponse?.data;
  const relatedProducts = relatedResponse?.data || [];
  const reviews = reviewsResponse?.data || [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  // Set default selections when product loads
  React.useEffect(() => {
    if (product) {
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.sizes?.length) setSelectedSize(product.sizes[Math.floor(product.sizes.length / 2)]);
    }
  }, [product]);

  const isInWishlist = useSelector((state: RootState) => 
    state.wishlist.items.some(item => item.id === productId)
  );

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.thumbnail,
      quantity: quantity,
    }));
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.thumbnail,
      originalPrice: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      reviews: product.reviewCount,
    }));
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'fill-[#FFAD33]' : 'fill-gray-300'}`} 
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-2"></div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1170px] mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-inter font-semibold text-text-2 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {product && (
        <SEO 
          title={`${product.name} - Buy Now`}
          description={product.description}
          keywords={`${product.category}, ${product.brand}, ${product.tags?.join(', ')}, buy online`}
          image={product.thumbnail}
          type="product"
        />
      )}
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-10 md:mb-20">
          <Link to="/" className="hover:text-secondary-2 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.categorySlug}`} className="hover:text-secondary-2 transition-colors">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-text-2">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[70px] mb-20 md:mb-[140px]">
          {/* Left - Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-[30px]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-[100px] md:w-[170px] h-[100px] md:h-[138px] bg-secondary rounded overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'ring-2 ring-secondary-2' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-secondary rounded overflow-hidden h-[300px] md:h-[600px]">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-inter font-semibold text-text-2 mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-400">({product.reviewCount} Reviews)</span>
              <span className="text-gray-300">|</span>
              <span className={`text-sm ${product.stock > 0 ? 'text-button-1' : 'text-secondary-2'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-inter text-text-2">${product.price}.00</span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">${product.originalPrice}.00</span>
              )}
              {product.discount && (
                <span className="px-2 py-1 bg-secondary-2 text-white text-xs rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-text-2 leading-relaxed mb-6 pb-6 border-b border-gray-200">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-6 mb-6">
                <span className="text-xl font-inter text-text-2">Colours:</span>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-5 h-5 rounded-full transition-all ${
                        selectedColor === color 
                          ? 'ring-2 ring-offset-2 ring-text-2' 
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-6 mb-6">
                <span className="text-xl font-inter text-text-2">Size:</span>
                <div className="flex items-center gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[32px] h-8 px-2 rounded border text-sm font-medium transition-all ${
                        selectedSize === size 
                          ? 'bg-secondary-2 text-white border-secondary-2' 
                          : 'border-gray-300 text-text-2 hover:border-secondary-2'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-11 flex items-center justify-center hover:bg-secondary-2 hover:text-white transition-colors border-r border-gray-300"
                  disabled={quantity <= 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-16 h-11 flex items-center justify-center font-poppins text-xl font-medium border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-11 flex items-center justify-center bg-secondary-2 text-white hover:bg-hover-button transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Buy Now Button */}
              <Button variant="primary" onClick={handleAddToCart} disabled={product.stock === 0}>
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </Button>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`w-10 h-10 rounded border flex items-center justify-center transition-all ${
                  isInWishlist 
                    ? 'bg-secondary-2 text-white border-secondary-2' 
                    : 'border-gray-300 text-text-2 hover:border-secondary-2 hover:text-secondary-2'
                }`}
              >
                <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="flex items-center gap-4 p-4 border-b border-gray-300">
                <svg className="w-10 h-10 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <div>
                  <h4 className="font-poppins font-medium text-base text-text-2">Free Delivery</h4>
                  <p className="text-xs text-text-2 underline cursor-pointer">Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <svg className="w-10 h-10 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <h4 className="font-poppins font-medium text-base text-text-2">Return Delivery</h4>
                  <p className="text-xs text-text-2">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-base font-poppins transition-colors ${
                activeTab === 'description'
                  ? 'text-secondary-2 border-b-2 border-secondary-2 font-medium'
                  : 'text-gray-500 hover:text-secondary-2'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-base font-poppins transition-colors ${
                activeTab === 'reviews'
                  ? 'text-secondary-2 border-b-2 border-secondary-2 font-medium'
                  : 'text-gray-500 hover:text-secondary-2'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="prose max-w-none">
              <p className="text-text-2 leading-relaxed">{product.description}</p>
              {product.specifications && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-text-2 mb-4">Specifications</h3>
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="py-2 text-gray-500 w-1/3">{key}</td>
                          <td className="py-2 text-text-2">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-secondary rounded-lg">
                    <div className="flex items-start gap-4">
                      <img 
                        src={review.userAvatar || `https://i.pravatar.cc/50?u=${review.userId}`}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-poppins font-medium text-text-2">{review.userName}</h4>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <h5 className="font-medium text-text-2 mb-1">{review.title}</h5>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          <button className="hover:text-secondary-2">👍 Helpful ({review.helpful})</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>

        {/* Related Items Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-5 h-10 bg-secondary-2 rounded"></div>
              <h2 className="text-xl font-poppins font-medium text-secondary-2">Related Item</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-[30px] justify-items-center sm:justify-items-start">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discount={item.discount}
                  image={item.thumbnail}
                  rating={item.rating}
                  reviews={item.reviewCount}
                  isNew={item.isNew}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
