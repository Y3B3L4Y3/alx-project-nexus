import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockOrders, getStatusColor } from '../utils/orderMockData';
import { formatCurrency } from '../utils/currency';

const Orders: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'Delivered' | 'Shipped' | 'Pending' | 'Cancelled'>('all');

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filter);

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
              onClick={() => setFilter('Delivered')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Delivered' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-green-600'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter('Shipped')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Shipped' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-600'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">You don't have any {filter !== 'all' && filter.toLowerCase()} orders yet.</p>
            <Link
              to="/"
              className="inline-block bg-secondary-2 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <p className="text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = '/vite.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{order.productName}</h3>
                      <p className="text-gray-600 text-sm">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-lg font-bold text-secondary-2">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="flex-1 text-center bg-secondary-2 text-white px-4 py-2.5 rounded hover:bg-red-600 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                    {order.status === 'Delivered' && (
                      <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium">
                        Leave Review
                      </button>
                    )}
                    {order.status === 'Shipped' && (
                      <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

