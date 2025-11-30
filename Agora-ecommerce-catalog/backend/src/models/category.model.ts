import { query } from '../config/database';
import { Category } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CategoryRow extends Category, RowDataPacket {}

// Find category by ID
export const findById = async (id: number): Promise<Category | null> => {
  const categories = await query<CategoryRow[]>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  return categories[0] || null;
};

// Find category by slug
export const findBySlug = async (slug: string): Promise<Category | null> => {
  const categories = await query<CategoryRow[]>(
    'SELECT * FROM categories WHERE slug = ?',
    [slug]
  );
  return categories[0] || null;
};

// Get all categories with product count
export const findAll = async (): Promise<(Category & { productCount: number })[]> => {
  return query<(CategoryRow & { productCount: number })[]>(
    `SELECT c.*, COUNT(p.id) as productCount
     FROM categories c
     LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
     GROUP BY c.id
     ORDER BY c.name`
  );
};

// Get top-level categories (no parent)
export const findTopLevel = async (): Promise<Category[]> => {
  return query<CategoryRow[]>(
    'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY name'
  );
};

// Get subcategories
export const findSubcategories = async (parentId: number): Promise<Category[]> => {
  return query<CategoryRow[]>(
    'SELECT * FROM categories WHERE parent_id = ? ORDER BY name',
    [parentId]
  );
};

// Create category
export const create = async (categoryData: {
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parent_id?: number;
}): Promise<number> => {
  const result = await query<ResultSetHeader>(
    'INSERT INTO categories (name, slug, icon, image, parent_id) VALUES (?, ?, ?, ?, ?)',
    [
      categoryData.name,
      categoryData.slug,
      categoryData.icon || null,
      categoryData.image || null,
      categoryData.parent_id || null,
    ]
  );
  return result.insertId;
};

// Update category
export const update = async (id: number, categoryData: Partial<Category>): Promise<boolean> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (categoryData.name !== undefined) {
    fields.push('name = ?');
    values.push(categoryData.name);
  }
  if (categoryData.slug !== undefined) {
    fields.push('slug = ?');
    values.push(categoryData.slug);
  }
  if (categoryData.icon !== undefined) {
    fields.push('icon = ?');
    values.push(categoryData.icon);
  }
  if (categoryData.image !== undefined) {
    fields.push('image = ?');
    values.push(categoryData.image);
  }
  if (categoryData.parent_id !== undefined) {
    fields.push('parent_id = ?');
    values.push(categoryData.parent_id);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await query<ResultSetHeader>(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete category
export const remove = async (id: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// Check if slug exists
export const slugExists = async (slug: string, excludeId?: number): Promise<boolean> => {
  let sql = 'SELECT 1 FROM categories WHERE slug = ?';
  const params: unknown[] = [slug];

  if (excludeId) {
    sql += ' AND id != ?';
    params.push(excludeId);
  }

  const result = await query<RowDataPacket[]>(sql, params);
  return result.length > 0;
};

export default {
  findById,
  findBySlug,
  findAll,
  findTopLevel,
  findSubcategories,
  create,
  update,
  remove,
  slugExists,
};

