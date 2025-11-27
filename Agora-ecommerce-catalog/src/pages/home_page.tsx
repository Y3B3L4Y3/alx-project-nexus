import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });
  const [musicTimeLeft, setMusicTimeLeft] = useState({ days: 5, hours: 23, minutes: 59, seconds: 35 });
  const [activeCategory, setActiveCategory] = useState('Camera');
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const flashSaleProducts = [
    { title: 'HAVIT HV-G92 Gamepad', price: 120, originalPrice: 160, discount: 40, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 88 },
    { title: 'AK-900 Wired Keyboard', price: 960, originalPrice: 1160, discount: 35, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 75 },
    { title: 'IPS LCD Gaming Monitor', price: 370, originalPrice: 400, discount: 30, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 99 },
    { title: 'S-Series Comfort Chair', price: 375, originalPrice: 400, discount: 25, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 99 },
  ];

  const bestSellingProducts = [
    { title: 'The north coat', price: 260, originalPrice: 360, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65 },
    { title: 'Gucci duffle bag', price: 960, originalPrice: 1160, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 65 },
    { title: 'RGB liquid CPU Cooler', price: 160, originalPrice: 170, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 65 },
    { title: 'Small BookSelf', price: 360, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65 },
  ];

  const exploreProducts = [
    { title: 'Breed Dry Dog Food', price: 100, image: 'https://via.placeholder.com/190x180', rating: 3, reviews: 35 },
    { title: 'CANON EOS DSLR Camera', price: 360, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 95 },
    { title: 'ASUS FHD Gaming Laptop', price: 700, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 325 },
    { title: 'Curology Product Set', price: 500, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 145 },
    { title: 'Kids Electric Car', price: 960, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 65, isNew: true },
    { title: 'Jr. Zoom Soccer Cleats', price: 1160, image: 'https://via.placeholder.com/190x180', rating: 5, reviews: 35 },
    { title: 'GP11 Shooter USB Gamepad', price: 660, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 55, isNew: true },
    { title: 'Quilted Satin Jacket', price: 660, image: 'https://via.placeholder.com/190x180', rating: 4, reviews: 55 },
  ];

  const categories = [
    { name: 'Phones', icon: '📱' },
    { name: 'Computers', icon: '💻' },
    { name: 'SmartWatch', icon: '⌚' },
    { name: 'Camera', icon: '📷' },
    { name: 'HeadPhones', icon: '🎧' },
    { name: 'Gaming', icon: '🎮' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    // Simulate filtering products by category
    console.log(`Filtering products by category: ${categoryName}`);
  };

  const scrollToFlashSales = () => {
    const element = document.getElementById('flash-sales');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative">
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
            <div className="cursor-pointer hover:text-secondary-2">Medicine</div>
            <div className="cursor-pointer hover:text-secondary-2">Sports & Outdoor</div>
            <div className="cursor-pointer hover:text-secondary-2">Baby's & Toys</div>
            <div className="cursor-pointer hover:text-secondary-2">Groceries & Pets</div>
            <div className="cursor-pointer hover:text-secondary-2">Health & Beauty</div>
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
      <div className="max-w-[1170px] mx-auto px-4 pb-16 border-b">
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
        <div className="flex gap-8 overflow-x-auto">
          {flashSaleProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        <div className="flex justify-center mt-8 md:mt-16">
          <Button variant="primary">View All Products</Button>
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
          {categories.map((category, index) => (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center justify-center gap-3 md:gap-4 h-28 md:h-36 rounded border transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                activeCategory === category.name 
                  ? 'bg-secondary-2 text-white border-secondary-2 scale-105' 
                  : 'border-gray-300 hover:bg-secondary-2 hover:text-white'
              } cursor-pointer`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className={`text-3xl md:text-5xl transition-transform ${activeCategory === category.name ? 'scale-110' : ''}`}>
                {category.icon}
              </span>
              <span className="text-sm md:text-base font-medium">{category.name}</span>
            </div>
          ))}
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
          <Button variant="primary">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
          {bestSellingProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
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
              <Button variant="success" onClick={() => alert('Redirecting to product page...')}>
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
          {exploreProducts.slice(0, visibleProducts).map((product, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard {...product} />
            </div>
          ))}
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
            onClick={() => alert('Navigating to all products...')}
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
          <h2 className="text-2xl md:text-4xl font-inter font-semibold">New Arrival</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 min-h-[400px] md:h-[600px]">
          <div className="bg-gradient-to-br from-gray-800 to-black rounded flex items-end p-6 md:p-8 relative overflow-hidden min-h-[300px] md:min-h-0 group cursor-pointer hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-colors"></div>
            <div className="relative z-10 text-text flex flex-col gap-3 md:gap-4 transform group-hover:translate-y-[-8px] transition-transform duration-300">
              <h3 className="text-xl md:text-2xl font-inter font-semibold">PlayStation 5</h3>
              <p className="text-xs md:text-sm">Black and White version of the PS5 coming out on sale.</p>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert('Navigating to PlayStation 5...'); }}
                className="text-sm md:text-base font-medium underline underline-offset-4 md:underline-offset-8 hover:text-button-1 transition-colors inline-flex items-center gap-2 group-hover:gap-3"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded flex items-end p-6 md:p-8 h-[250px] md:h-[284px] group cursor-pointer hover:shadow-2xl transition-all duration-300">
              <div className="text-text flex flex-col gap-3 md:gap-4 transform group-hover:translate-y-[-8px] transition-transform duration-300">
                <h3 className="text-xl md:text-2xl font-inter font-semibold">Women's Collections</h3>
                <p className="text-xs md:text-sm">Featured woman collections that give you another vibe.</p>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Navigating to Women\'s Collections...'); }}
                  className="text-sm md:text-base font-medium underline underline-offset-4 md:underline-offset-8 hover:text-button-1 transition-colors inline-flex items-center gap-2"
                >
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-600 rounded flex items-end p-4 md:p-6 min-h-[150px] group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="text-text flex flex-col gap-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  <h3 className="text-lg md:text-2xl font-inter font-semibold">Speakers</h3>
                  <p className="text-xs md:text-sm">Amazon speakers</p>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert('Navigating to Speakers...'); }}
                    className="text-sm md:text-base font-medium underline hover:text-button-1 transition-colors"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-end p-4 md:p-6 min-h-[150px] group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="text-text flex flex-col gap-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  <h3 className="text-lg md:text-2xl font-inter font-semibold">Perfume</h3>
                  <p className="text-xs md:text-sm">GUCCI INTENSE</p>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert('Navigating to Perfume...'); }}
                    className="text-sm md:text-base font-medium underline hover:text-button-1 transition-colors"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
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

