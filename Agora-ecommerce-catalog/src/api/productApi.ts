import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category, ProductReview, PaginatedResponse, ApiResponse, ProductFilters } from './types';
import { 
  mockProducts, 
  mockCategories, 
  getProductById, 
  getRelatedProducts, 
  getProductReviews,
  getFeaturedProducts,
  getNewProducts,
  searchProducts as searchMockProducts,
} from './mock';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product', 'Category', 'Review'],
  endpoints: (builder) => ({
    // Get all products with optional filters
    getProducts: builder.query<PaginatedResponse<Product>, { page?: number; limit?: number; filters?: ProductFilters }>({
      queryFn: async ({ page = 1, limit = 12, filters }) => {
        await delay(300); // Simulate network delay
        
        let filteredProducts = [...mockProducts];
        
        // Apply filters
        if (filters) {
          if (filters.category) {
            filteredProducts = filteredProducts.filter(p => p.categorySlug === filters.category);
          }
          if (filters.minPrice !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
          }
          if (filters.maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
          }
          if (filters.rating !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
          }
          if (filters.inStock) {
            filteredProducts = filteredProducts.filter(p => p.stock > 0);
          }
          if (filters.brand) {
            filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
          }
          if (filters.search) {
            filteredProducts = searchMockProducts(filters.search);
          }
          
          // Apply sorting
          if (filters.sortBy) {
            switch (filters.sortBy) {
              case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
              case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
              case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
              case 'newest':
                filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
              case 'popular':
                filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            }
          }
        }
        
        // Paginate
        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
        
        return {
          data: {
            success: true,
            data: paginatedProducts,
            pagination: {
              page,
              limit,
              total,
              totalPages,
            },
          },
        };
      },
      providesTags: ['Product'],
    }),

    // Get single product by ID
    getProductById: builder.query<ApiResponse<Product>, number>({
      queryFn: async (id) => {
        await delay(200);
        
        const product = getProductById(id);
        
        if (!product) {
          return {
            error: {
              status: 404,
              data: { success: false, error: 'Product not found' },
            },
          };
        }
        
        return {
          data: {
            success: true,
            data: product,
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    // Get related products
    getRelatedProducts: builder.query<ApiResponse<Product[]>, { productId: number; limit?: number }>({
      queryFn: async ({ productId, limit = 4 }) => {
        await delay(200);
        
        const relatedProducts = getRelatedProducts(productId, limit);
        
        return {
          data: {
            success: true,
            data: relatedProducts,
          },
        };
      },
    }),

    // Get featured products
    getFeaturedProducts: builder.query<ApiResponse<Product[]>, void>({
      queryFn: async () => {
        await delay(200);
        
        return {
          data: {
            success: true,
            data: getFeaturedProducts(),
          },
        };
      },
    }),

    // Get new arrivals
    getNewArrivals: builder.query<ApiResponse<Product[]>, void>({
      queryFn: async () => {
        await delay(200);
        
        return {
          data: {
            success: true,
            data: getNewProducts(),
          },
        };
      },
    }),

    // Get flash sale products (products with discount)
    getFlashSaleProducts: builder.query<ApiResponse<Product[]>, void>({
      queryFn: async () => {
        await delay(200);
        
        const flashSaleProducts = mockProducts.filter(p => p.discount && p.discount > 0);
        
        return {
          data: {
            success: true,
            data: flashSaleProducts,
          },
        };
      },
    }),

    // Get best selling products (by review count)
    getBestSellingProducts: builder.query<ApiResponse<Product[]>, number | undefined>({
      queryFn: async (limit) => {
        await delay(200);
        
        const bestSelling = [...mockProducts]
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, limit ?? 8);
        
        return {
          data: {
            success: true,
            data: bestSelling,
          },
        };
      },
    }),

    // Get all categories
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      queryFn: async () => {
        await delay(150);
        
        return {
          data: {
            success: true,
            data: mockCategories,
          },
        };
      },
      providesTags: ['Category'],
    }),

    // Get product reviews
    getProductReviews: builder.query<ApiResponse<ProductReview[]>, number>({
      queryFn: async (productId) => {
        await delay(200);
        
        const reviews = getProductReviews(productId);
        
        return {
          data: {
            success: true,
            data: reviews,
          },
        };
      },
      providesTags: (_result, _error, productId) => [{ type: 'Review', id: productId }],
    }),

    // Search products
    searchProducts: builder.query<ApiResponse<Product[]>, string>({
      queryFn: async (query) => {
        await delay(300);
        
        const results = searchMockProducts(query);
        
        return {
          data: {
            success: true,
            data: results,
          },
        };
      },
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

