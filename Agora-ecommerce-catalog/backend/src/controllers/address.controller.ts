import { Response } from 'express';
import AddressModel from '../models/address.model';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Get addresses
export const getAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const addresses = await AddressModel.findByUserId(req.user.userId);
  sendSuccess(res, addresses);
});

// Add address
export const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { name, phone, street, apartment, city, state, country, zipCode, isDefault } = req.body;

  const addressId = await AddressModel.create({
    user_id: req.user.userId,
    name,
    phone,
    street,
    apartment,
    city,
    state,
    country,
    zip_code: zipCode,
    is_default: isDefault || false,
  });

  const address = await AddressModel.findById(addressId);
  sendCreated(res, address, 'Address added successfully');
});

// Update address
export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const addressId = parseInt(req.params.id, 10);
  const { name, phone, street, apartment, city, state, country, zipCode, isDefault } = req.body;

  const updated = await AddressModel.update(addressId, req.user.userId, {
    name,
    phone,
    street,
    apartment,
    city,
    state,
    country,
    zip_code: zipCode,
    is_default: isDefault,
  });

  if (!updated) {
    sendNotFound(res, 'Address');
    return;
  }

  const address = await AddressModel.findById(addressId);
  sendSuccess(res, address, 'Address updated successfully');
});

// Delete address
export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const addressId = parseInt(req.params.id, 10);

  const deleted = await AddressModel.remove(addressId, req.user.userId);
  if (!deleted) {
    sendNotFound(res, 'Address');
    return;
  }

  sendSuccess(res, null, 'Address deleted successfully');
});

// Set default address
export const setDefaultAddress = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const addressId = parseInt(req.params.id, 10);

  const updated = await AddressModel.setDefault(addressId, req.user.userId);
  if (!updated) {
    sendNotFound(res, 'Address');
    return;
  }

  const addresses = await AddressModel.findByUserId(req.user.userId);
  sendSuccess(res, addresses, 'Default address updated');
});

export default {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

