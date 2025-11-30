import { Request, Response } from 'express';
import CategoryModel from '../models/category.model';
import ProductModel from '../models/product.model';
import { sendSuccess, sendPaginated, sendNotFound } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { parsePagination } from '../utils/pagination';

// Get all categories
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await CategoryModel.findAll();
  sendSuccess(res, categories);
});

// Get category by slug
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryModel.findBySlug(req.params.slug);

  if (!category) {
    return sendNotFound(res, 'Category');
  }

  sendSuccess(res, category);
});

// Get products in category
export const getCategoryProducts = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryModel.findBySlug(req.params.slug);

  if (!category) {
    return sendNotFound(res, 'Category');
  }

  const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });

  const { products, total } = await ProductModel.findAll({
    page,
    limit,
    filters: { category: req.params.slug },
  });

  sendPaginated(res, products, { page, limit, total });
});

export default {
  getCategories,
  getCategoryBySlug,
  getCategoryProducts,
};

