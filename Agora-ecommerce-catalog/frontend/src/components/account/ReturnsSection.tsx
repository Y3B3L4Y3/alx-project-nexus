import React from 'react';

interface ReturnItem {
  id: number;
  orderId: string;
  product: string;
  image: string;
  returnDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason: string;
}

const ReturnsSection: React.FC = () => {
  const returns: ReturnItem[] = [
    {
      id: 1,
      orderId: '#ORD-12345',
      product: 'HAVIT HV-G92 Gamepad',
      image: '/vite.svg',
      returnDate: '2024-01-15',
      status: 'approved',
      reason: 'Defective product',
    },
    {
      id: 2,
      orderId: '#ORD-12340',
      product: 'AK-900 Wired Keyboard',
      image: '/vite.svg',
      returnDate: '2024-01-10',
      status: 'completed',
      reason: 'Wrong item received',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-6 md:p-10 lg:p-20">
      <h2 className="text-xl font-poppins font-medium text-secondary-2 mb-8">
        My Returns
      </h2>

      {returns.length > 0 ? (
        <div className="flex flex-col gap-4">
          {returns.map((item) => (
            <div 
              key={item.id} 
              className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                    <img src={item.image} alt={item.product} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-base text-text-2">{item.product}</h4>
                    <p className="text-sm text-gray-500">Order: {item.orderId}</p>
                    <p className="text-sm text-gray-500">Return requested: {item.returnDate}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <p className="text-sm text-gray-500">Reason: {item.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
          </svg>
          <p>No return requests found.</p>
          <p className="text-sm mt-2">Items you've requested to return will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ReturnsSection;

