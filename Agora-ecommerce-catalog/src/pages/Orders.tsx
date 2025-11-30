import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { useGetUserOrdersQuery } from '../api/userApi';
import type { Order } from '../api/types';

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20 ml-auto"></div>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

const Orders: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'delivered' | 'shipped' | 'pending' | 'cancelled'>('all');
  const { data: ordersData, isLoading, error } = useGetUserOrdersQuery();

  const orders = ordersData?.data || [];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Orders</h3>
            <p className="text-gray-600 mb-6">Please try again later or contact support.</p>
            <Link
              to="/"
              className="inline-block bg-secondary-2 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors font-medium"
            >
              Back to Home
            </Link>
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
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-secondary-2 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-secondary-2'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'delivered' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-green-600'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'shipped' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-600'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">You don't have any {filter !== 'all' && filter} orders yet.</p>
            <Link
              to="/"
              className="inline-block bg-secondary-2 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const productName = firstItem?.product?.name || 'Order';
              const productImage = firstItem?.product?.thumbnail || '/vite.svg';

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <p className="text-gray-500">Order ID</p>
                          <p className="font-semibold text-gray-900">{order.orderId}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = '/vite.svg';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{productName}</h3>
                        <p className="text-gray-600 text-sm">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p className="text-lg font-bold text-secondary-2">{formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                      <Link
                        to={`/account/orders/${order.orderId}`}
                        className="flex-1 text-center bg-secondary-2 text-white px-4 py-2.5 rounded hover:bg-red-600 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium">
                          Leave Review
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium">
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
