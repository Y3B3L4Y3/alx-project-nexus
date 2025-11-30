import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import { CanAccess } from '../../components/admin/AdminLayout';
import {
  useGetDashboardStatsQuery,
  useGetAdminOrdersQuery,
} from '../../api/adminApi';

// Loading skeleton component
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toasts = [], showToast, removeToast } = useToast();

  // API hooks
  const { data: statsData, isLoading: isLoadingStats } = useGetDashboardStatsQuery();
  const { data: ordersData, isLoading: isLoadingOrders } = useGetAdminOrdersQuery({ page: 1, limit: 5 });

  const stats = statsData?.data || {
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    newOrdersToday: 0,
    newUsersToday: 0,
    newMessagesToday: 0,
  };

  const recentOrders = ordersData?.data || [];

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      change: '+20.1%',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgGradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+12.5%',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgGradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+8.2%',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgGradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '-3.4%',
      isPositive: false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgGradient: 'from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products');
    setTimeout(() => {
      showToast('Click "Add Product" to create a new product', 'info');
    }, 500);
  };

  if (isLoadingStats || isLoadingOrders) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {Array.isArray(toasts) && toasts.length > 0 && toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast?.(toast.id)}
          />
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Welcome back! Here's what's happening with your store.</p>
        </div>
        <CanAccess permission="products.create">
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary-2 text-white rounded-xl hover:bg-hover-button transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </CanAccess>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.lightBg} rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <div className={`bg-gradient-to-br ${stat.bgGradient} text-white p-1.5 md:p-2 rounded-md md:rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat.isPositive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <svg className={`w-3 h-3 ${stat.isPositive ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {stat.change}
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mb-1">{stat.title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-2">vs last month</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-xs md:text-sm text-gray-500">Latest customer orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs md:text-sm text-secondary-2 hover:text-hover-button font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Amount
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="text-xs md:text-sm font-semibold text-gray-900">{order.orderId}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-[10px] md:text-xs font-medium text-gray-600">
                            {order.customerName?.split(' ').map(n => n[0]).join('') || '?'}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm text-gray-700 truncate max-w-[80px] md:max-w-none">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-xs md:text-sm font-semibold text-gray-900">${order.total}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 inline-flex text-[10px] md:text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2 md:space-y-3">
              <CanAccess permission="products.view">
                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Add Product</p>
                    <p className="text-xs text-gray-500">Create a new product</p>
                  </div>
                </Link>
              </CanAccess>

              <CanAccess permission="orders.view">
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-green-50 rounded-lg md:rounded-xl hover:bg-green-100 transition-colors group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">View Orders</p>
                    <p className="text-xs text-gray-500">Manage all orders</p>
                  </div>
                </Link>
              </CanAccess>

              <CanAccess permission="users.view">
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-purple-50 rounded-lg md:rounded-xl hover:bg-purple-100 transition-colors group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Manage Users</p>
                    <p className="text-xs text-gray-500">View all customers</p>
                  </div>
                </Link>
              </CanAccess>

              <CanAccess permission="messages.view">
                <Link
                  to="/admin/messages"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-orange-50 rounded-lg md:rounded-xl hover:bg-orange-100 transition-colors group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Messages</p>
                    <p className="text-xs text-gray-500">View customer inquiries</p>
                  </div>
                </Link>
              </CanAccess>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-gradient-to-br from-secondary-2 to-hover-button rounded-xl md:rounded-2xl p-4 md:p-6 text-white">
            <h3 className="text-base md:text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">New Orders</span>
                <span className="font-semibold">{stats.newOrdersToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Pending Orders</span>
                <span className="font-semibold">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">New Messages</span>
                <span className="font-semibold">{stats.newMessagesToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">New Users</span>
                <span className="font-semibold">{stats.newUsersToday}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
