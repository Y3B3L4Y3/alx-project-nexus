import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { mockProducts } from '../api/mock/products';

// Filter types
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
type RatingFilter = 'all' | '4+' | '3+' | '2+';

const PRODUCTS_PER_PAGE = 8;

const Products: React.FC = () => {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
    return uniqueCategories.map(cat => ({
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, '-'),
      count: mockProducts.filter(p => p.category === cat).length
    }));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      result = result.filter(p => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, sortBy, ratingFilter, priceRange, searchQuery]);

  // Products to display (paginated)
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMoreProducts = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('default');
    setRatingFilter('all');
    setPriceRange([0, 2000]);
    setSearchQuery('');
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  const hasActiveFilters = selectedCategory !== 'all' || sortBy !== 'default' || 
    ratingFilter !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 2000 || searchQuery;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1170px] mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4 sm:mb-6">
          <Link to="/" className="text-gray-500 hover:text-secondary-2 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Products</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-4 h-8 sm:w-5 sm:h-10 bg-secondary-2 rounded"></div>
              <span className="text-secondary-2 font-semibold text-sm sm:text-base">Shop</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-inter font-semibold text-text-2">All Products</h1>
            <p className="text-gray-500 text-sm">
              Showing {displayedProducts.length} of {filteredProducts.length} products
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 bg-secondary-2 text-white px-4 py-2.5 rounded hover:bg-red-600 transition-colors w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && <span className="bg-white text-secondary-2 text-xs px-2 py-0.5 rounded-full ml-1">Active</span>}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-[260px] xl:w-[280px] flex-shrink-0`}>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:sticky lg:top-24 space-y-5 sm:space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold text-text-2 mb-2 sm:mb-3 text-sm sm:text-base">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setVisibleCount(PRODUCTS_PER_PAGE);
                    }}
                    className="w-full px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2 focus:border-transparent"
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-text-2 mb-2 sm:mb-3 text-sm sm:text-base">Categories</h3>
                <div className="space-y-1.5 sm:space-y-2 max-h-[200px] sm:max-h-[250px] overflow-y-auto pr-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setVisibleCount(PRODUCTS_PER_PAGE);
                    }}
                    className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded transition-colors flex justify-between items-center text-sm ${
                      selectedCategory === 'all'
                        ? 'bg-secondary-2 text-white'
                        : 'hover:bg-gray-200 text-text-2'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-xs sm:text-sm opacity-70">({mockProducts.length})</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setVisibleCount(PRODUCTS_PER_PAGE);
                      }}
                      className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded transition-colors flex justify-between items-center text-sm ${
                        selectedCategory === cat.name
                          ? 'bg-secondary-2 text-white'
                          : 'hover:bg-gray-200 text-text-2'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs sm:text-sm opacity-70">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-text-2 mb-2 sm:mb-3 text-sm sm:text-base">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]);
                        setVisibleCount(PRODUCTS_PER_PAGE);
                      }}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([priceRange[0], parseInt(e.target.value) || 2000]);
                        setVisibleCount(PRODUCTS_PER_PAGE);
                      }}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], parseInt(e.target.value)]);
                      setVisibleCount(PRODUCTS_PER_PAGE);
                    }}
                    className="w-full accent-secondary-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-text-2 mb-2 sm:mb-3 text-sm sm:text-base">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2 bg-white text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold text-text-2 mb-2 sm:mb-3 text-sm sm:text-base">Rating</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {(['all', '4+', '3+', '2+'] as RatingFilter[]).map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setRatingFilter(rating);
                        setVisibleCount(PRODUCTS_PER_PAGE);
                      }}
                      className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded transition-colors flex items-center gap-2 text-sm ${
                        ratingFilter === rating
                          ? 'bg-secondary-2 text-white'
                          : 'hover:bg-gray-200 text-text-2'
                      }`}
                    >
                      {rating === 'all' ? (
                        <span>All Ratings</span>
                      ) : (
                        <>
                          <div className="flex items-center">
                            {[...Array(parseInt(rating))].map((_, i) => (
                              <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span>& Up</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 border border-secondary-2 text-secondary-2 rounded hover:bg-secondary-2 hover:text-white transition-colors font-medium text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {selectedCategory}
                    <button onClick={() => { setSelectedCategory('all'); setVisibleCount(PRODUCTS_PER_PAGE); }} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {sortBy !== 'default' && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    Sort: {sortBy.replace('-', ' → ')}
                    <button onClick={() => setSortBy('default')} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {ratingFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {ratingFilter} Stars
                    <button onClick={() => { setRatingFilter('all'); setVisibleCount(PRODUCTS_PER_PAGE); }} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    Search: "{searchQuery}"
                    <button onClick={() => { setSearchQuery(''); setVisibleCount(PRODUCTS_PER_PAGE); }} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">Try adjusting your filters or search query.</p>
                <button
                  onClick={clearFilters}
                  className="bg-secondary-2 text-white px-5 sm:px-6 py-2 rounded hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {displayedProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="flex justify-center animate-fade-in"
                      style={{ animationDelay: `${(index % PRODUCTS_PER_PAGE) * 50}ms` }}
                    >
                      <ProductCard
                        id={product.id}
                        title={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        discount={product.discount}
                        image={product.thumbnail}
                        rating={product.rating}
                        reviews={product.reviewCount}
                        isNew={product.isNew}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreProducts && (
                  <div className="flex justify-center mt-8 sm:mt-12">
                    <button 
                      onClick={handleLoadMore}
                      className="bg-secondary-2 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded hover:bg-red-600 transition-colors font-medium text-sm sm:text-base flex items-center gap-2"
                    >
                      <span>Load More Products</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                        {filteredProducts.length - visibleCount} left
                      </span>
                    </button>
                  </div>
                )}

                {/* All Products Loaded Message */}
                {!hasMoreProducts && filteredProducts.length > PRODUCTS_PER_PAGE && (
                  <div className="text-center mt-8 sm:mt-12 text-gray-500 text-sm">
                    You've viewed all {filteredProducts.length} products
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Services Section - Matching Home Page */}
        <div className="mt-12 sm:mt-16 md:mt-24 pt-12 sm:pt-16 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-20">
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-button flex items-center justify-center text-white text-xl sm:text-2xl">🚚</div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">FREE AND FAST DELIVERY</h3>
                <p className="text-xs sm:text-sm text-gray-600">Free delivery for all orders over $140</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-button flex items-center justify-center text-white text-xl sm:text-2xl">💬</div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">24/7 CUSTOMER SERVICE</h3>
                <p className="text-xs sm:text-sm text-gray-600">Friendly 24/7 customer support</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-button flex items-center justify-center text-white text-xl sm:text-2xl">✓</div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">MONEY BACK GUARANTEE</h3>
                <p className="text-xs sm:text-sm text-gray-600">We return money within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
