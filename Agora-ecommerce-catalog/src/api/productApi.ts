import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category, ProductReview, PaginatedResponse, ApiResponse, ProductFilters } from './types';

// API base URL: uses environment variable in development, backend server URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Transform backend product to frontend format
const transformProduct = (backendProduct: any): Product => {
  // Ensure images array always has at least the thumbnail
  const images = backendProduct.images && backendProduct.images.length > 0 
    ? backendProduct.images 
    : [backendProduct.thumbnail];
  
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    slug: backendProduct.slug,
    description: backendProduct.description,
    price: parseFloat(backendProduct.price),
    originalPrice: backendProduct.original_price ? parseFloat(backendProduct.original_price) : undefined,
    discount: backendProduct.discount || 0,
    thumbnail: backendProduct.thumbnail,
    images: images,
    rating: parseFloat(backendProduct.rating) || 0,
    reviewCount: backendProduct.review_count || 0,
    stock: backendProduct.stock || 0,
    category: backendProduct.category_name || backendProduct.category || '',
    categorySlug: backendProduct.category_slug || '',
    brand: backendProduct.brand || '',
    tags: backendProduct.tags || [],
    colors: backendProduct.colors || [],
    sizes: backendProduct.sizes || [],
    specifications: backendProduct.specifications || {},
    isNew: Boolean(backendProduct.is_new),
    isFeatured: Boolean(backendProduct.is_featured),
    createdAt: backendProduct.created_at,
  };
};

// Transform backend category to frontend format
const transformCategory = (backendCategory: any): Category => ({
  id: backendCategory.id,
  name: backendCategory.name,
  slug: backendCategory.slug,
  icon: backendCategory.icon || '',
  image: backendCategory.image || '',
  productCount: backendCategory.productCount || 0,
});

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['Product', 'Category', 'Review'],
  endpoints: (builder) => ({
    // Get all products with optional filters
    getProducts: builder.query<PaginatedResponse<Product>, { page?: number; limit?: number; filters?: ProductFilters }>({
      query: ({ page = 1, limit = 12, filters }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        
        if (filters) {
          if (filters.category) params.set('category', filters.category);
          if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
          if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
          if (filters.rating !== undefined) params.set('rating', String(filters.rating));
          if (filters.inStock) params.set('inStock', 'true');
          if (filters.brand) params.set('brand', filters.brand);
          if (filters.search) params.set('search', filters.search);
          if (filters.sortBy) params.set('sortBy', filters.sortBy);
        }
        
        return `/products?${params.toString()}`;
      },
      transformResponse: (response: any): PaginatedResponse<Product> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
        pagination: response.pagination || {
          page: 1,
          limit: 12,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      }),
      providesTags: ['Product'],
    }),

    // Get single product by ID
    getProductById: builder.query<ApiResponse<Product>, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any): ApiResponse<Product> => ({
        success: true,
        data: transformProduct(response.data),
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    // Get related products
    getRelatedProducts: builder.query<ApiResponse<Product[]>, { productId: number; limit?: number }>({
      query: ({ productId, limit = 4 }) => `/products/${productId}/related?limit=${limit}`,
      transformResponse: (response: any): ApiResponse<Product[]> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
      }),
    }),

    // Get featured products
    getFeaturedProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/products/featured',
      transformResponse: (response: any): ApiResponse<Product[]> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
      }),
      providesTags: ['Product'],
    }),

    // Get new arrivals
    getNewArrivals: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/products/new-arrivals',
      transformResponse: (response: any): ApiResponse<Product[]> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
      }),
      providesTags: ['Product'],
    }),

    // Get flash sale products (products with discount)
    getFlashSaleProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/products/flash-sale',
      transformResponse: (response: any): ApiResponse<Product[]> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
      }),
      providesTags: ['Product'],
    }),

    // Get best selling products
    getBestSellingProducts: builder.query<ApiResponse<Product[]>, number | undefined>({
      query: (limit = 8) => `/products/best-selling?limit=${limit}`,
      transformResponse: (response: any): ApiResponse<Product[]> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
      }),
      providesTags: ['Product'],
    }),

    // Get all categories
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => '/categories',
      transformResponse: (response: any): ApiResponse<Category[]> => ({
        success: true,
        data: (response.data || []).map(transformCategory),
      }),
      providesTags: ['Category'],
    }),

    // Get product reviews
    getProductReviews: builder.query<ApiResponse<ProductReview[]>, number>({
      query: (productId) => `/products/${productId}/reviews`,
      transformResponse: (response: any): ApiResponse<ProductReview[]> => ({
        success: true,
        data: response.data || [],
      }),
      providesTags: (_result, _error, productId) => [{ type: 'Review', id: productId }],
    }),

    // Search products
    searchProducts: builder.query<ApiResponse<Product[]>, string>({
      query: (query) => `/products/search?q=${encodeURIComponent(query)}`,
      transformResponse: (response: any): ApiResponse<Product[]> => ({
        success: true,
        data: (response.data || []).map(transformProduct),
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetFlashSaleProductsQuery,
  useGetBestSellingProductsQuery,
  useGetCategoriesQuery,
  useGetProductReviewsQuery,
  useSearchProductsQuery,
} = productApi;
