import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import {
  useGetFlashSaleProductsQuery,
  useGetBestSellingProductsQuery,
  useGetNewArrivalsQuery,
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '../api/productApi';

// Loading skeleton for products
const ProductSkeleton = () => (
  <div className="animate-pulse w-[190px]">
    <div className="h-[180px] bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });
  const [musicTimeLeft, setMusicTimeLeft] = useState({ days: 5, hours: 23, minutes: 59, seconds: 35 });
  const [activeCategory, setActiveCategory] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch real data from API
  const { data: flashSaleData, isLoading: isLoadingFlashSale } = useGetFlashSaleProductsQuery();
  const { data: bestSellingData, isLoading: isLoadingBestSelling } = useGetBestSellingProductsQuery(4);
  const { data: newArrivalsData, isLoading: isLoadingNewArrivals } = useGetNewArrivalsQuery();
  // Featured products query available for future use
  // const { data: featuredData, isLoading: isLoadingFeatured } = useGetFeaturedProductsQuery();
  const { data: exploreData, isLoading: isLoadingExplore } = useGetProductsQuery({ page: 1, limit: 8 });
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  // Transform API data for ProductCard component
  const flashSaleProducts = flashSaleData?.data?.map(product => ({
    id: product.id,
    title: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    image: product.thumbnail || 'https://via.placeholder.com/190x180',
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
  })) || [];

  const bestSellingProducts = bestSellingData?.data?.map(product => ({
    id: product.id,
    title: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.thumbnail || 'https://via.placeholder.com/190x180',
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
  })) || [];

  const newArrivalsProducts = newArrivalsData?.data?.map(product => ({
    id: product.id,
    title: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    image: product.thumbnail || 'https://via.placeholder.com/190x180',
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
  })) || [];

  // Featured products transformation available for future use
  // const featuredProducts = featuredData?.data?.map(product => ({
  //   id: product.id,
  //   title: product.name,
  //   price: product.price,
  //   originalPrice: product.originalPrice,
  //   discount: product.discount,
  //   image: product.thumbnail || 'https://via.placeholder.com/190x180',
  //   rating: product.rating || 0,
  //   reviews: product.reviewCount || 0,
  // })) || [];

  const exploreProducts = exploreData?.data?.map(product => ({
    id: product.id,
    title: product.name,
    price: product.price,
    image: product.thumbnail || 'https://via.placeholder.com/190x180',
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
    isNew: product.isNew,
  })) || [];

  // Map categories with icons
  const categoryIcons: Record<string, string> = {
    'electronics': '📱',
    'fashion': '👕',
    'gaming': '🎮',
    'furniture': '🪑',
    'sports': '⚽',
    'health-beauty': '💄',
    'groceries': '🛒',
    'baby-toys': '🧸',
    'phones': '📱',
    'computers': '💻',
    'smartwatch': '⌚',
    'camera': '📷',
    'headphones': '🎧',
  };

  const categories = categoriesData?.data?.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    icon: categoryIcons[cat.slug.toLowerCase()] || '📦',
  })) || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const musicTimer = setInterval(() => {
      setMusicTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(musicTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    navigate(`/products?category=${categorySlug}`);
  };

  const scrollToFlashSales = () => {
    const element = document.getElementById('flash-sales');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative">
      <SEO 
        title="Agora - Your Premium E-Commerce Destination"
        description="Shop the latest electronics, fashion, gaming gear, and more at unbeatable prices. Free delivery on orders over $140. Flash sales up to 50% off!"
        keywords="ecommerce, online shopping, electronics, fashion, gaming, flash sales, free delivery"
      />
      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-secondary-2 hover:bg-hover-button text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 animate-fade-in"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      {/* Hero Section with Sidebar - Desktop/Tablet Only */}
      <div className="max-w-[1170px] mx-auto px-4 pt-4 md:pt-10 pb-16 md:pb-36">
        <div className="flex flex-col md:flex-row gap-4 md:gap-16">
          {/* Sidebar Categories - Hidden on Mobile */}
          <div className="hidden md:flex w-[217px] flex-col gap-4 pt-10 border-r border-gray-200 pr-16">
            {isLoadingCategories ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 9).map((category, index) => (
                <div 
                  key={index}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="flex items-center justify-between cursor-pointer hover:text-secondary-2 transition-colors"
                >
                  <span>{category.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between cursor-pointer hover:text-secondary-2">
                  <span>Woman's Fashion</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between cursor-pointer hover:text-secondary-2">
                  <span>Men's Fashion</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="cursor-pointer hover:text-secondary-2">Electronics</div>
                <div className="cursor-pointer hover:text-secondary-2">Home & Lifestyle</div>
                <div className="cursor-pointer hover:text-secondary-2">Sports & Outdoor</div>
                <div className="cursor-pointer hover:text-secondary-2">Baby's & Toys</div>
                <div className="cursor-pointer hover:text-secondary-2">Groceries & Pets</div>
                <div className="cursor-pointer hover:text-secondary-2">Health & Beauty</div>
              </>
            )}
          </div>
          {/* Hero Banner - Responsive with Animation */}
          <div className="flex-1 bg-button text-text rounded flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-8 md:py-14 gap-8 animate-fade-in">
            <div className="flex flex-col gap-4 md:gap-5 text-center md:text-left">
              <div className="flex items-center gap-4 md:gap-6 justify-center md:justify-start animate-slide-in-left">
                <div className="w-8 h-10 md:w-10 md:h-12 bg-white rounded animate-pulse"></div>
                <span className="text-sm md:text-base">iPhone 14 Series</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-inter font-semibold leading-tight animate-slide-in-left animation-delay-200">
                Up to 10%<br />off Voucher
              </h1>
              <button 
                onClick={scrollToFlashSales}
                className="flex items-center gap-2 justify-center md:justify-start hover:gap-4 transition-all duration-300 group animate-slide-in-left animation-delay-400"
              >
                <span className="font-medium underline underline-offset-4 md:underline-offset-8 cursor-pointer text-sm md:text-base group-hover:text-gray-200">
                  Shop Now
                </span>
                <svg className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="w-full max-w-[300px] md:w-[496px] h-[250px] md:h-[352px] bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center animate-slide-in-right hover:scale-105 transition-transform duration-300 cursor-pointer">
              <span className="text-white text-5xl md:text-6xl animate-bounce-slow">📱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sales Section */}
      <div id="flash-sales" className="max-w-[1170px] mx-auto px-4 pb-16 border-b">
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-end gap-20">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-5 h-10 bg-secondary-2 rounded"></div>
                <span className="text-secondary-2 font-semibold">Today's</span>
              </div>
              <h2 className="text-4xl font-inter font-semibold">Flash Sales</h2>
            </div>
            <div className="flex items-center gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <span className="text-xs font-medium mb-1">{unit}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-inter font-bold">{String(value).padStart(2, '0')}</span>
                    {unit !== 'seconds' && <span className="text-3xl font-bold text-secondary-2">:</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {isLoadingFlashSale ? (
            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : flashSaleProducts.length > 0 ? (
            flashSaleProducts.map((product, index) => (
              <ProductCard key={product.id || index} {...product} />
            ))
          ) : (
            <p className="text-gray-500">No flash sale products available at the moment.</p>
          )}
        </div>
        <div className="flex justify-center mt-8 md:mt-16">
          <Button variant="primary" onClick={() => navigate('/products')}>View All Products</Button>
        </div>
      </div>

      {/* Browse By Category - Responsive */}
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20 border-b">
        <div className="flex items-end justify-between mb-8 md:mb-16">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-4 h-8 md:w-5 md:h-10 bg-secondary-2 rounded"></div>
              <span className="text-secondary-2 font-semibold text-sm md:text-base">Categories</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-inter font-semibold">Browse By Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
          {isLoadingCategories ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 rounded animate-pulse"></div>
            ))
          ) : categories.length > 0 ? (
            categories.slice(0, 6).map((category, index) => (
              <div 
                key={index} 
                onClick={() => handleCategoryClick(category.slug)}
                className={`flex flex-col items-center justify-center gap-3 md:gap-4 h-28 md:h-36 rounded border transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  activeCategory === category.slug 
                    ? 'bg-secondary-2 text-white border-secondary-2 scale-105' 
                    : 'border-gray-300 hover:bg-secondary-2 hover:text-white'
                } cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className={`text-3xl md:text-5xl transition-transform ${activeCategory === category.slug ? 'scale-110' : ''}`}>
                  {category.icon}
                </span>
                <span className="text-sm md:text-base font-medium">{category.name}</span>
              </div>
            ))
          ) : (
            // Fallback categories if API returns empty
            [
              { name: 'Phones', icon: '📱' },
              { name: 'Computers', icon: '💻' },
              { name: 'SmartWatch', icon: '⌚' },
              { name: 'Camera', icon: '📷' },
              { name: 'HeadPhones', icon: '🎧' },
              { name: 'Gaming', icon: '🎮' },
            ].map((category, index) => (
              <div 
                key={index} 
                onClick={() => handleCategoryClick(category.name.toLowerCase())}
                className="flex flex-col items-center justify-center gap-3 md:gap-4 h-28 md:h-36 rounded border border-gray-300 hover:bg-secondary-2 hover:text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="text-3xl md:text-5xl">{category.icon}</span>
                <span className="text-sm md:text-base font-medium">{category.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Best Selling Products - Responsive */}
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20 border-b">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-16 gap-4">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-4 h-8 md:w-5 md:h-10 bg-secondary-2 rounded"></div>
              <span className="text-secondary-2 font-semibold text-sm md:text-base">This Month</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-inter font-semibold">Best Selling Products</h2>
          </div>
          <Button variant="primary" onClick={() => navigate('/products')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
          {isLoadingBestSelling ? (
            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product, index) => (
              <ProductCard key={product.id || index} {...product} />
            ))
          ) : (
            <p className="col-span-4 text-gray-500">No best selling products available.</p>
          )}
        </div>
      </div>

      {/* Music Experience Banner - Responsive */}
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        <div className="bg-button text-text rounded p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden gap-8">
          <div className="absolute right-0 top-0 w-64 h-64 md:w-96 md:h-96 bg-gray-600 rounded-full opacity-30 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-6 md:gap-8 max-w-md text-center md:text-left">
            <span className="text-button-1 font-semibold text-sm md:text-base animate-pulse">Categories</span>
            <h2 className="text-3xl md:text-5xl font-inter font-semibold leading-tight">Enhance Your Music Experience</h2>
            <div className="flex gap-4 md:gap-6 justify-center md:justify-start flex-wrap">
              {[
                {value: String(musicTimeLeft.days).padStart(2, '0'), label:'Days'},
                {value: String(musicTimeLeft.hours).padStart(2, '0'), label:'Hours'},
                {value: String(musicTimeLeft.minutes).padStart(2, '0'), label:'Min'},
                {value: String(musicTimeLeft.seconds).padStart(2, '0'), label:'Sec'}
              ].map((t,i)=>(
                <div key={i} className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-slow" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="text-sm md:text-base font-semibold text-button">{t.value}</span>
                  <span className="text-[10px] md:text-xs text-button">{t.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center md:justify-start">
              <Button variant="success" onClick={() => navigate('/products?category=headphones')}>
                Buy Now!
              </Button>
            </div>
          </div>
          <div className="w-full max-w-[400px] md:w-[600px] h-[300px] md:h-[420px] bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center hover:scale-105 transition-transform duration-500 cursor-pointer group">
            <span className="text-white text-7xl md:text-9xl group-hover:rotate-12 transition-transform duration-300">🎧</span>
          </div>
        </div>
      </div>

      {/* Explore Our Products - Responsive */}
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-16">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-4 h-8 md:w-5 md:h-10 bg-secondary-2 rounded"></div>
              <span className="text-secondary-2 font-semibold text-sm md:text-base">Our Products</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-inter font-semibold">Explore Our Products</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-16 justify-items-center">
          {isLoadingExplore ? (
            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : exploreProducts.length > 0 ? (
            exploreProducts.slice(0, visibleProducts).map((product, index) => (
              <div key={product.id || index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard {...product} />
              </div>
            ))
          ) : (
            <p className="col-span-4 text-gray-500">No products available.</p>
          )}
        </div>
        <div className="flex justify-center gap-4">
          {visibleProducts < exploreProducts.length && (
            <Button 
              variant="secondary"
              onClick={() => setVisibleProducts(prev => Math.min(prev + 4, exploreProducts.length))}
            >
              Load More
            </Button>
          )}
          <Button 
            variant="primary"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </div>
      </div>

      {/* New Arrival - Responsive */}
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-16">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-4 h-8 md:w-5 md:h-10 bg-secondary-2 rounded"></div>
            <span className="text-secondary-2 font-semibold text-sm md:text-base">Featured</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-4xl font-inter font-semibold">New Arrival</h2>
            <Button variant="primary" onClick={() => navigate('/products')}>View All</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
          {isLoadingNewArrivals ? (
            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            newArrivalsProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id || index} {...product} />
            ))
          )}
        </div>
      </div>

      {/* Services Section - Responsive */}
      <div className="max-w-[1170px] mx-auto px-4 py-16 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
          <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-button flex items-center justify-center text-white text-2xl">🚚</div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-semibold">FREE AND FAST DELIVERY</h3>
              <p className="text-xs md:text-sm">Free delivery for all orders over $140</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-button flex items-center justify-center text-white text-2xl">💬</div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-semibold">24/7 CUSTOMER SERVICE</h3>
              <p className="text-xs md:text-sm">Friendly 24/7 customer support</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-button flex items-center justify-center text-white text-2xl">✓</div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-semibold">MONEY BACK GUARANTEE</h3>
              <p className="text-xs md:text-sm">We return money within 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
