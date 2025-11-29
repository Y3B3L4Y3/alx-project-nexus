import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getOrderById, getStatusColor } from '../utils/orderMockData';
import { formatCurrency } from '../utils/currency';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return <Navigate to="/account/orders" replace />;
  }

  const getProgressSteps = () => {
    const steps = [
      { label: 'Order Placed', status: 'completed' },
      { label: 'Processing', status: order.status === 'Pending' ? 'current' : 'completed' },
      { label: 'Shipped', status: order.status === 'Shipped' ? 'current' : order.status === 'Delivered' ? 'completed' : 'pending' },
      { label: 'Delivered', status: order.status === 'Delivered' ? 'completed' : 'pending' },
    ];

    if (order.status === 'Cancelled') {
      return [
        { label: 'Order Placed', status: 'completed' },
        { label: 'Cancelled', status: 'current' },
      ];
    }

    return steps;
  };

  const progressSteps = getProgressSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-secondary-2">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/account" className="text-gray-500 hover:text-secondary-2">Account</Link>
          <span className="text-gray-400">/</span>
          <Link to="/account/orders" className="text-gray-500 hover:text-secondary-2">Orders</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{order.id}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
            <p className="text-gray-600">Order ID: <span className="font-semibold">{order.id}</span></p>
          </div>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 text-secondary-2 hover:text-red-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            {order.status !== 'Cancelled' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-secondary-2 transition-all duration-500"
                      style={{
                        width: `${((progressSteps.filter(s => s.status === 'completed').length - 1) / (progressSteps.length - 1)) * 100}%`
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {progressSteps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            step.status === 'completed'
                              ? 'bg-secondary-2 border-secondary-2'
                              : step.status === 'current'
                              ? 'bg-white border-secondary-2'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {step.status === 'completed' ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div
                              className={`w-3 h-3 rounded-full ${
                                step.status === 'current' ? 'bg-secondary-2' : 'bg-gray-300'
                              }`}
                            />
                          )}
                        </div>
                        <p
                          className={`mt-2 text-xs md:text-sm font-medium text-center ${
                            step.status === 'completed' || step.status === 'current'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = '/vite.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                      <p className="text-xs text-gray-500">each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p className="font-medium mb-1">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-secondary-2 text-lg">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-gray-600 mb-1">Tracking Number</p>
                    <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="block w-full text-center bg-secondary-2 text-white px-4 py-2.5 rounded hover:bg-red-600 transition-colors font-medium"
                >
                  Contact Support
                </Link>
                {order.status === 'Delivered' && (
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium">
                    Leave a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

