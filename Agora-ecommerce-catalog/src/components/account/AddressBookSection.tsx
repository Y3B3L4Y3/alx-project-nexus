import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import Button from '../common/Button';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
}

const AddressBookSection: React.FC = () => {
  // Get logged-in user
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || 'User';

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: userName,
      phone: '+1 234 567 8900',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      country: 'United States',
      isDefault: true,
    },
    {
      id: 2,
      name: `${userName} (Office)`,
      phone: '+1 234 567 8901',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      country: 'United States',
      isDefault: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id: number) => {
    const addressToDelete = addresses.find(a => a.id === id);
    if (addressToDelete?.isDefault) {
      alert('Cannot delete default address. Set another address as default first.');
      return;
    }
    if (confirm(`Are you sure you want to delete this address?`)) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address || !newAddress.city) {
      alert('Please fill in all required fields');
      return;
    }
    setAddresses(prev => [...prev, {
      id: Date.now(),
      ...newAddress,
      isDefault: prev.length === 0
    }]);
    setNewAddress({ name: '', phone: '', address: '', city: '', country: '' });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-6 md:p-10 lg:p-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-poppins font-medium text-secondary-2">
          Address Book
        </h2>
        <Button 
          variant="primary" 
          onClick={() => setIsAdding(true)}
          className="text-sm px-6 py-2"
        >
          Add New Address
        </Button>
      </div>

      {/* Add New Address Form */}
      {isAdding && (
        <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-secondary rounded-lg">
          <h3 className="font-poppins font-medium text-base text-text-2 mb-4">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={newAddress.name}
              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-[50px] bg-white rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full h-[50px] bg-white rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address *"
            value={newAddress.address}
            onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
            className="w-full h-[50px] bg-white rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30 mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="City *"
              value={newAddress.city}
              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
              className="w-full h-[50px] bg-white rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30"
            />
            <input
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
              className="w-full h-[50px] bg-white rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 font-poppins text-base text-text-2 hover:text-secondary-2 transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" className="text-sm px-6 py-2">
              Save Address
            </Button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            className={`p-6 rounded-lg border-2 transition-all ${
              addr.isDefault ? 'border-secondary-2 bg-secondary-2/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {addr.isDefault && (
              <span className="inline-block px-3 py-1 bg-secondary-2 text-white text-xs font-medium rounded mb-3">
                Default
              </span>
            )}
            <h4 className="font-poppins font-medium text-base text-text-2 mb-2">{addr.name}</h4>
            <p className="text-sm text-gray-500 mb-1">{addr.phone}</p>
            <p className="text-sm text-gray-500 mb-1">{addr.address}</p>
            <p className="text-sm text-gray-500 mb-4">{addr.city}, {addr.country}</p>
            
            <div className="flex gap-4">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-sm text-secondary-2 hover:underline font-medium"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-sm text-gray-500 hover:text-secondary-2 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>No addresses saved yet.</p>
        </div>
      )}
    </div>
  );
};

export default AddressBookSection;

