import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);
router.get('/:slug/products', CategoryController.getCategoryProducts);

export default router;

