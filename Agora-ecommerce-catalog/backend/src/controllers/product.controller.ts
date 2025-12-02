import { Request, Response } from 'express';
import ProductModel from '../models/product.model';
import { sendSuccess, sendPaginated, sendNotFound } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { parsePagination } from '../utils/pagination';
import { ProductFilters } from '../types';

// Get all products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
  
  const filters: ProductFilters = {
    category: req.query.category as string,
    minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
    maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
    inStock: req.query.inStock === 'true',
    brand: req.query.brand as string,
    sortBy: req.query.sortBy as ProductFilters['sortBy'],
    search: req.query.search as string,
  };

  const { products, total } = await ProductModel.findAll({ page, limit, filters });

  // Get images for each product
  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const images = await ProductModel.getImages(product.id);
      return {
        ...product,
        images: images.map((img) => img.image_url),
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
        colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
        sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
      };
    })
  );

  sendPaginated(res, productsWithImages, { page, limit, total });
});

// Get product by ID
export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const product = await ProductModel.findById(id);

  if (!product) {
    sendNotFound(res, 'Product');
    return;
  }

  const images = await ProductModel.getImages(id);
  
  const productWithDetails = {
    ...product,
    images: images.map((img) => img.image_url),
    tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
    colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
  };

  sendSuccess(res, productWithDetails);
});

// Get product by slug
export const getProductBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await ProductModel.findBySlug(req.params.slug);

  if (!product) {
    sendNotFound(res, 'Product');
    return;
  }

  const images = await ProductModel.getImages(product.id);
  
  const productWithDetails = {
    ...product,
    images: images.map((img) => img.image_url),
    tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
    colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
  };

  sendSuccess(res, productWithDetails);
});

// Helper function to add images and parse JSON fields for products
const addProductDetails = async (products: any[]) => {
  return Promise.all(
    products.map(async (product) => {
      const images = await ProductModel.getImages(product.id);
      return {
        ...product,
        images: images.map((img) => img.image_url),
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : product.tags || [],
        colors: typeof product.colors === 'string' ? JSON.parse(product.colors || '[]') : product.colors || [],
        sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
      };
    })
  );
};

// Get featured products
export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductModel.findFeatured();
  const productsWithImages = await addProductDetails(products);
  sendSuccess(res, productsWithImages);
});

// Get new arrivals
export const getNewArrivals = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductModel.findNewArrivals();
  const productsWithImages = await addProductDetails(products);
  sendSuccess(res, productsWithImages);
});

// Get flash sale products
export const getFlashSaleProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductModel.findFlashSale();
  const productsWithImages = await addProductDetails(products);
  sendSuccess(res, productsWithImages);
});

// Get best selling products
export const getBestSellingProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
  const products = await ProductModel.findBestSelling(limit);
  const productsWithImages = await addProductDetails(products);
  sendSuccess(res, productsWithImages);
});

// Get related products
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id, 10);
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
  
  const products = await ProductModel.findRelated(productId, limit);
  const productsWithImages = await addProductDetails(products);
  sendSuccess(res, productsWithImages);
});

// Search products
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
  const searchQuery = req.query.q as string;

  const { products, total } = await ProductModel.findAll({
    page,
    limit,
    filters: { search: searchQuery },
  });

  sendPaginated(res, products, { page, limit, total });
});

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getFlashSaleProducts,
  getBestSellingProducts,
  getRelatedProducts,
  searchProducts,
};

