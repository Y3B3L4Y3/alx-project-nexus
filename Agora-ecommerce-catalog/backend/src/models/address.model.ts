import { query } from '../config/database';
import { Address } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface AddressRow extends Address, RowDataPacket {}

// Find address by ID
export const findById = async (id: number): Promise<Address | null> => {
  const addresses = await query<AddressRow[]>(
    'SELECT * FROM addresses WHERE id = ?',
    [id]
  );
  return addresses[0] || null;
};

// Get user addresses
export const findByUserId = async (userId: number): Promise<Address[]> => {
  return query<AddressRow[]>(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
    [userId]
  );
};

// Create address
export const create = async (addressData: Omit<Address, 'id'>): Promise<number> => {
  // If this is default, unset other defaults
  if (addressData.is_default) {
    await query(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
      [addressData.user_id]
    );
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO addresses (user_id, name, phone, street, apartment, city, state, country, zip_code, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      addressData.user_id,
      addressData.name,
      addressData.phone,
      addressData.street,
      addressData.apartment || null,
      addressData.city,
      addressData.state,
      addressData.country,
      addressData.zip_code,
      addressData.is_default || false,
    ]
  );
  return result.insertId;
};

// Update address
export const update = async (id: number, userId: number, addressData: Partial<Address>): Promise<boolean> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  const fieldMap: Record<string, string> = {
    name: 'name',
    phone: 'phone',
    street: 'street',
    apartment: 'apartment',
    city: 'city',
    state: 'state',
    country: 'country',
    zip_code: 'zip_code',
    is_default: 'is_default',
  };

  Object.entries(addressData).forEach(([key, value]) => {
    if (value !== undefined && fieldMap[key]) {
      fields.push(`${fieldMap[key]} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return false;

  // If setting as default, unset others
  if (addressData.is_default) {
    await query(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
      [userId, id]
    );
  }

  values.push(id, userId);
  const result = await query<ResultSetHeader>(
    `UPDATE addresses SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete address
export const remove = async (id: number, userId: number): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM addresses WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
};

// Set as default
export const setDefault = async (id: number, userId: number): Promise<boolean> => {
  await query(
    'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
    [userId]
  );
  
  const result = await query<ResultSetHeader>(
    'UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
};

export default {
  findById,
  findByUserId,
  create,
  update,
  remove,
  setDefault,
};

