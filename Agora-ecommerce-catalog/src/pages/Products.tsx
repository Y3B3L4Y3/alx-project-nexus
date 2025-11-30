import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productApi';

// Filter types
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
type RatingFilter = 'all' | '4+' | '3+' | '2+';

const PRODUCTS_PER_PAGE = 12;

// Loading skeleton for product cards
const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const Products: React.FC = () => {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Build API filters
  const apiFilters = useMemo(() => {
    const filters: Record<string, any> = {};
    
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }
    if (priceRange[0] > 0) {
      filters.minPrice = priceRange[0];
    }
    if (priceRange[1] < 2000) {
      filters.maxPrice = priceRange[1];
    }
    if (ratingFilter !== 'all') {
      filters.rating = parseInt(ratingFilter);
    }
    if (searchQuery) {
      filters.search = searchQuery;
    }
    if (sortBy !== 'default') {
      // Map frontend sort options to backend
      const sortMap: Record<string, string> = {
        'price-asc': 'price_asc',
        'price-desc': 'price_desc',
        'rating-desc': 'rating_desc',
        'newest': 'newest',
      };
      filters.sortBy = sortMap[sortBy] || sortBy;
    }
    
    return filters;
  }, [selectedCategory, priceRange, ratingFilter, searchQuery, sortBy]);

  // Fetch products from API
  const { 
    data: productsData, 
    isLoading: isLoadingProducts, 
    isFetching,
    error: productsError 
  } = useGetProductsQuery({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    filters: apiFilters,
  });

  // Fetch categories from API
  const { 
    data: categoriesData, 
    isLoading: isLoadingCategories 
  } = useGetCategoriesQuery();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;
  const categories = categoriesData?.data || [];
  const totalProducts = pagination?.total || products.length;
  const totalPages = pagination?.totalPages || 1;

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('default');
    setRatingFilter('all');
    setPriceRange([0, 2000]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== 'all' || sortBy !== 'default' || 
    ratingFilter !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 2000 || searchQuery;

  const hasMoreProducts = currentPage < totalPages;

  // Reset page when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

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
              {isLoadingProducts ? 'Loading products...' : `Showing ${products.length} of ${totalProducts} products`}
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
                    onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
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
                  {isLoadingCategories ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleFilterChange(() => setSelectedCategory('all'))}
                        className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded transition-colors flex justify-between items-center text-sm ${
                          selectedCategory === 'all'
                            ? 'bg-secondary-2 text-white'
                            : 'hover:bg-gray-200 text-text-2'
                        }`}
                      >
                        <span>All Categories</span>
                        <span className="text-xs sm:text-sm opacity-70">({totalProducts})</span>
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleFilterChange(() => setSelectedCategory(cat.slug))}
                          className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded transition-colors flex justify-between items-center text-sm ${
                            selectedCategory === cat.slug
                              ? 'bg-secondary-2 text-white'
                              : 'hover:bg-gray-200 text-text-2'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs sm:text-sm opacity-70">({cat.productCount})</span>
                        </button>
                      ))}
                    </>
                  )}
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
                      onChange={(e) => handleFilterChange(() => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]))}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handleFilterChange(() => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000]))}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => handleFilterChange(() => setPriceRange([priceRange[0], parseInt(e.target.value)]))}
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
                  onChange={(e) => handleFilterChange(() => setSortBy(e.target.value as SortOption))}
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
                      onClick={() => handleFilterChange(() => setRatingFilter(rating))}
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
                    {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => handleFilterChange(() => setSelectedCategory('all'))} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {sortBy !== 'default' && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    Sort: {sortBy.replace('-', ' → ')}
                    <button onClick={() => handleFilterChange(() => setSortBy('default'))} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {ratingFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {ratingFilter} Stars
                    <button onClick={() => handleFilterChange(() => setRatingFilter('all'))} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    Search: "{searchQuery}"
                    <button onClick={() => handleFilterChange(() => setSearchQuery(''))} className="hover:text-secondary-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Error State */}
            {productsError && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">There was an error loading products. Please try again.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-secondary-2 text-white px-5 sm:px-6 py-2 rounded hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoadingProducts && !productsError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!isLoadingProducts && !productsError && products.length === 0 ? (
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
            ) : !isLoadingProducts && !productsError && (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 ${isFetching ? 'opacity-50' : ''}`}>
                  {products.map((product, index) => (
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
                      disabled={isFetching}
                      className="bg-secondary-2 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded hover:bg-red-600 transition-colors font-medium text-sm sm:text-base flex items-center gap-2 disabled:opacity-50"
                    >
                      {isFetching ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Products</span>
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                            Page {currentPage} of {totalPages}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* All Products Loaded Message */}
                {!hasMoreProducts && products.length > 0 && (
                  <div className="text-center mt-8 sm:mt-12 text-gray-500 text-sm">
                    You've viewed all {totalProducts} products
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
