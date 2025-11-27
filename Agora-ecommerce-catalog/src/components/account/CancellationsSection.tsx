import React from 'react';

interface CancelledOrder {
  id: number;
  orderId: string;
  product: string;
  image: string;
  cancelDate: string;
  reason: string;
  refundStatus: 'pending' | 'processed' | 'completed';
  refundAmount: number;
}

const CancellationsSection: React.FC = () => {
  const cancellations: CancelledOrder[] = [
    {
      id: 1,
      orderId: '#ORD-12342',
      product: 'IPS LCD Gaming Monitor',
      image: '/vite.svg',
      cancelDate: '2024-01-12',
      reason: 'Changed my mind',
      refundStatus: 'completed',
      refundAmount: 370,
    },
    {
      id: 2,
      orderId: '#ORD-12338',
      product: 'RGB Liquid CPU Cooler',
      image: '/vite.svg',
      cancelDate: '2024-01-08',
      reason: 'Found better price elsewhere',
      refundStatus: 'processed',
      refundAmount: 160,
    },
  ];

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processed':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-6 md:p-10 lg:p-20">
      <h2 className="text-xl font-poppins font-medium text-secondary-2 mb-8">
        My Cancellations
      </h2>

      {cancellations.length > 0 ? (
        <div className="flex flex-col gap-4">
          {cancellations.map((item) => (
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
                    <p className="text-sm text-gray-500">Cancelled: {item.cancelDate}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Refund:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRefundStatusColor(item.refundStatus)}`}>
                      {item.refundStatus}
                    </span>
                  </div>
                  <p className="font-poppins font-medium text-secondary-2">${item.refundAmount}</p>
                  <p className="text-xs text-gray-400">Reason: {item.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p>No cancelled orders found.</p>
          <p className="text-sm mt-2">Orders you've cancelled will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default CancellationsSection;

