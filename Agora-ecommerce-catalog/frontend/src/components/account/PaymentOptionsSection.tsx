import React, { useState } from 'react';
import Button from '../common/Button';

interface PaymentMethod {
  id: number;
  type: 'visa' | 'mastercard' | 'paypal';
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

const PaymentOptionsSection: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: 'visa',
      lastFour: '4242',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      lastFour: '8888',
      expiryDate: '06/24',
      isDefault: false,
    },
  ]);

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const handleDelete = (id: number) => {
    if (paymentMethods.find(pm => pm.id === id)?.isDefault) {
      alert('Cannot delete default payment method. Set another as default first.');
      return;
    }
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return (
          <div className="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <div className="flex">
              <div className="w-4 h-4 bg-red-500 rounded-full -mr-1"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">PayPal</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-6 md:p-10 lg:p-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-poppins font-medium text-secondary-2">
          My Payment Options
        </h2>
        <Button 
          variant="primary" 
          onClick={() => alert('Add new payment method')}
          className="text-sm px-6 py-2"
        >
          Add New Card
        </Button>
      </div>

      {/* Payment Methods List */}
      <div className="flex flex-col gap-4">
        {paymentMethods.map((pm) => (
          <div 
            key={pm.id} 
            className={`p-6 rounded-lg border-2 flex items-center justify-between transition-all ${
              pm.isDefault ? 'border-secondary-2 bg-secondary-2/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              {getCardIcon(pm.type)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-poppins font-medium text-base text-text-2 capitalize">
                    {pm.type}
                  </span>
                  <span className="text-gray-500">•••• {pm.lastFour}</span>
                  {pm.isDefault && (
                    <span className="px-2 py-0.5 bg-secondary-2 text-white text-xs rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Expires {pm.expiryDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {!pm.isDefault && (
                <button
                  onClick={() => handleSetDefault(pm.id)}
                  className="text-sm text-secondary-2 hover:underline font-medium"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDelete(pm.id)}
                className="text-sm text-gray-500 hover:text-secondary-2 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p>No payment methods saved yet.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentOptionsSection;

