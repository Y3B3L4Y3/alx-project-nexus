import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import {
  useGetUserAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../api/userApi';
import type { Address } from '../api/types';

const AddressManagement: React.FC = () => {
  const { data: addressesData, isLoading, refetch } = useGetUserAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddressMutation] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const addresses = addressesData?.data || [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      phone: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: addresses.length === 0,
    });
    setEditingAddress(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress({
          id: editingAddress.id,
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          isDefault: formData.isDefault,
        }).unwrap();
        showToast('Address updated successfully!', 'success');
      } else {
        // Add new address
        await addAddress({
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          isDefault: formData.isDefault,
        }).unwrap();
        showToast('Address added successfully!', 'success');
      }

      setIsAddModalOpen(false);
      refetch();
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to save address', 'error');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id).unwrap();
      showToast('Default address updated!', 'success');
      refetch();
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to set default address', 'error');
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteAddressMutation(deletingId).unwrap();
        showToast('Address deleted successfully!', 'success');
        setDeletingId(null);
        refetch();
      } catch (error: any) {
        showToast(error?.data?.error || 'Failed to delete address', 'error');
      }
    }
  };

  const getTypeIcon = (isDefault: boolean) => {
    if (isDefault) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 h-48">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-secondary-2">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/account" className="text-gray-500 hover:text-secondary-2">Account</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">My Addresses</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-secondary-2 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Address
          </button>
        </div>

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Addresses Found</h3>
            <p className="text-gray-600 mb-6">Add your first address to start shopping.</p>
            <button
              onClick={handleOpenAddModal}
              className="inline-block bg-secondary-2 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors font-medium"
            >
              Add New Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
                  address.isDefault ? 'border-2 border-secondary-2' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-700">
                      {getTypeIcon(address.isDefault)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {address.isDefault ? 'Default Address' : 'Shipping Address'}
                    </span>
                  </div>
                  {address.isDefault && (
                    <span className="bg-secondary-2 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
                  <p className="text-gray-700 text-sm">{address.street}</p>
                  {address.apartment && (
                    <p className="text-gray-700 text-sm">{address.apartment}</p>
                  )}
                  <p className="text-gray-700 text-sm">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-700 text-sm">{address.country}</p>
                  <p className="text-gray-600 text-sm mt-1">Phone: {address.phone}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEditModal(address)}
                    className="flex-1 text-sm border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50 transition-colors font-medium"
                  >
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 text-sm bg-secondary-2 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors font-medium"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => setDeletingId(address.id)}
                    className="text-sm text-red-600 px-3 py-2 rounded hover:bg-red-50 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="lg"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment, Suite, etc.
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding || isUpdating}
                className="flex-1 px-6 py-2.5 bg-secondary-2 text-white rounded font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isAdding || isUpdating ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        variant="danger"
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AddressManagement;
