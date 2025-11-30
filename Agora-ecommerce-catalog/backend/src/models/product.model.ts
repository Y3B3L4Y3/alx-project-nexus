import { query } from '../config/database';
import { Product, ProductImage, ProductFilters } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ProductRow extends Product, RowDataPacket {}
interface ImageRow extends ProductImage, RowDataPacket {}

// Generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Find product by ID
export const findById = async (id: number): Promise<Product | null> => {
  const products = await query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ? AND p.status != 'deleted'`,
    [id]
  );
  return products[0] || null;
};

// Find product by slug
export const findBySlug = async (slug: string): Promise<Product | null> => {
  const products = await query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.status != 'deleted'`,
    [slug]
  );
  return products[0] || null;
};

// Get product images
export const getImages = async (productId: number): Promise<ProductImage[]> => {
  return query<ImageRow[]>(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
    [productId]
  );
};

// Get all products with filters
export const findAll = async (options: {
  page: number;
  limit: number;
  filters?: ProductFilters;
}): Promise<{ products: Product[]; total: number }> => {
  const { page, limit, filters = {} } = options;
  const offset = (page - 1) * limit;
  
  let whereClause = "WHERE p.status = 'active'";
  const params: unknown[] = [];

  if (filters.category) {
    whereClause += ' AND c.slug = ?';
    params.push(filters.category);
  }

  if (filters.minPrice !== undefined) {
    whereClause += ' AND p.price >= ?';
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    whereClause += ' AND p.price <= ?';
    params.push(filters.maxPrice);
  }

  if (filters.rating !== undefined) {
    whereClause += ' AND p.rating >= ?';
    params.push(filters.rating);
  }

  if (filters.inStock) {
    whereClause += ' AND p.stock > 0';
  }

  if (filters.brand) {
    whereClause += ' AND p.brand = ?';
    params.push(filters.brand);
  }

  if (filters.search) {
    whereClause += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Sort order
  let orderClause = 'ORDER BY p.created_at DESC';
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        orderClause = 'ORDER BY p.price ASC';
        break;
      case 'price-desc':
        orderClause = 'ORDER BY p.price DESC';
        break;
      case 'rating':
        orderClause = 'ORDER BY p.rating DESC';
        break;
      case 'newest':
        orderClause = 'ORDER BY p.created_at DESC';
        break;
      case 'popular':
        orderClause = 'ORDER BY p.review_count DESC';
        break;
    }
  }

  // Get total count
  const countResult = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}`,
    params
  );
  const total = countResult[0].total as number;

  // Get products
  const products = await query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { products, total };
};

// Get featured products
export const findFeatured = async (limit: number = 8): Promise<Product[]> => {
  return query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_featured = TRUE AND p.status = 'active'
     ORDER BY p.created_at DESC
     LIMIT ?`,
    [limit]
  );
};

// Get new arrivals
export const findNewArrivals = async (limit: number = 8): Promise<Product[]> => {
  return query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_new = TRUE AND p.status = 'active'
     ORDER BY p.created_at DESC
     LIMIT ?`,
    [limit]
  );
};

// Get flash sale products (with discount)
export const findFlashSale = async (limit: number = 8): Promise<Product[]> => {
  return query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.discount > 0 AND p.status = 'active'
     ORDER BY p.discount DESC
     LIMIT ?`,
    [limit]
  );
};

// Get best selling products
export const findBestSelling = async (limit: number = 8): Promise<Product[]> => {
  return query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.status = 'active'
     ORDER BY p.review_count DESC
     LIMIT ?`,
    [limit]
  );
};

// Get related products
export const findRelated = async (productId: number, limit: number = 4): Promise<Product[]> => {
  const product = await findById(productId);
  if (!product) return [];

  return query<ProductRow[]>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
     ORDER BY RAND()
     LIMIT ?`,
    [product.category_id, productId, limit]
  );
};

// Create product
export const create = async (productData: Partial<Product>): Promise<number> => {
  const slug = generateSlug(productData.name || '');
  
  const result = await query<ResultSetHeader>(
    `INSERT INTO products (name, slug, description, price, original_price, discount,
     thumbnail, stock, category_id, brand, tags, colors, sizes, specifications,
     is_new, is_featured, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      productData.name,
      slug,
      productData.description,
      productData.price,
      productData.original_price || null,
      productData.discount || 0,
      productData.thumbnail,
      productData.stock || 0,
      productData.category_id,
      productData.brand,
      JSON.stringify(productData.tags || []),
      JSON.stringify(productData.colors || []),
      JSON.stringify(productData.sizes || []),
      JSON.stringify(productData.specifications || {}),
      productData.is_new || false,
      productData.is_featured || false,
      productData.status || 'active',
    ]
  );
  return result.insertId;
};

// Update product
export const update = async (id: number, productData: Partial<Product>): Promise<boolean> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  const fieldMap: Record<string, string> = {
    name: 'name',
    description: 'description',
    price: 'price',
    original_price: 'original_price',
    discount: 'discount',
    thumbnail: 'thumbnail',
    stock: 'stock',
    category_id: 'category_id',
    brand: 'brand',
    is_new: 'is_new',
    is_featured: 'is_featured',
    status: 'status',
  };

  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && fieldMap[key]) {
      fields.push(`${fieldMap[key]} = ?`);
      values.push(value);
    }
  });

  // Handle JSON fields
  if (productData.tags) {
    fields.push('tags = ?');
    values.push(JSON.stringify(productData.tags));
  }
  if (productData.colors) {
    fields.push('colors = ?');
    values.push(JSON.stringify(productData.colors));
  }
  if (productData.sizes) {
    fields.push('sizes = ?');
    values.push(JSON.stringify(productData.sizes));
  }
  if (productData.specifications) {
    fields.push('specifications = ?');
    values.push(JSON.stringify(productData.specifications));
  }

  // Update slug if name changed
  if (productData.name) {
    fields.push('slug = ?');
    values.push(generateSlug(productData.name));
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await query<ResultSetHeader>(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete product (soft delete)
export const softDelete = async (id: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    "UPDATE products SET status = 'deleted' WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

// Add product image
export const addImage = async (productId: number, imageUrl: string, sortOrder: number = 0): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
    [productId, imageUrl, sortOrder]
  );
  return result.insertId;
};

// Delete product image
export const deleteImage = async (imageId: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM product_images WHERE id = ?',
    [imageId]
  );
  return result.affectedRows > 0;
};

// Update product rating
export const updateRating = async (productId: number): Promise<void> => {
  await query(
    `UPDATE products p
     SET rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = ?),
         review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?)
     WHERE p.id = ?`,
    [productId, productId, productId]
  );
};

export default {
  findById,
  findBySlug,
  getImages,
  findAll,
  findFeatured,
  findNewArrivals,
  findFlashSale,
  findBestSelling,
  findRelated,
  create,
  update,
  softDelete,
  addImage,
  deleteImage,
  updateRating,
};

