// Mock data for addresses - frontend only

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export const mockAddresses: Address[] = [
  {
    id: 'addr-001',
    name: 'John Doe',
    phone: '+1 234 567 8900',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    isDefault: true,
    type: 'home',
  },
  {
    id: 'addr-002',
    name: 'John Doe',
    phone: '+1 234 567 8901',
    address: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    country: 'United States',
    isDefault: false,
    type: 'work',
  },
];

export const getAddressById = (id: string): Address | undefined => {
  return mockAddresses.find((address) => address.id === id);
};

export const createAddress = (address: Omit<Address, 'id'>): Address => {
  return {
    ...address,
    id: `addr-${Date.now()}`,
  };
};

