import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import { useRBAC, CanAccess } from '../../components/admin/AdminLayout';
import {
  useGetAdminUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useUpdateUserPasswordMutation,
  type AdminUser,
} from '../../api/adminApi';

const Users: React.FC = () => {
  const { toasts = [], showToast, removeToast } = useToast();
  const { hasPermission, userRole } = useRBAC();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<string>('customer');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Create user form state
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'customer',
  });
  const [createFormErrors, setCreateFormErrors] = useState<Record<string, string>>({});
  
  // Edit user form state
  const [editFormData, setEditFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  // API hooks
  const { data: usersData, isLoading, refetch } = useGetAdminUsersQuery({
    page,
    limit: 20,
    search: searchTerm || undefined,
    role: roleFilter || undefined,
  });

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserPassword, { isLoading: isUpdatingPassword }] = useUpdateUserPasswordMutation();

  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  const handleEditRole = (user: AdminUser) => {
    if (!hasPermission('users.edit')) {
      showToast('You do not have permission to edit users', 'error');
      return;
    }
    setSelectedUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const handleEditUser = (user: AdminUser) => {
    if (!hasPermission('users.edit')) {
      showToast('You do not have permission to edit users', 'error');
      return;
    }
    setSelectedUser(user);
    setEditFormData({
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
    });
    setShowEditModal(true);
  };

  const handleCreateUser = () => {
    if (!hasPermission('users.create')) {
      showToast('You do not have permission to create users', 'error');
      return;
    }
    setCreateFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'customer',
    });
    setCreateFormErrors({});
    setShowCreateModal(true);
  };

  const validateCreateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!createFormData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!createFormData.password) {
      errors.password = 'Password is required';
    } else if (createFormData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (createFormData.password !== createFormData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!createFormData.firstName) {
      errors.firstName = 'First name is required';
    }
    
    if (!createFormData.lastName) {
      errors.lastName = 'Last name is required';
    }
    
    setCreateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCreateForm()) return;
    
    try {
      await createUser({
        email: createFormData.email,
        password: createFormData.password,
        firstName: createFormData.firstName,
        lastName: createFormData.lastName,
        phone: createFormData.phone || undefined,
        role: createFormData.role,
      }).unwrap();
      showToast('User created successfully', 'success');
      setShowCreateModal(false);
      refetch();
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to create user', 'error');
    }
  };

  const handleSubmitEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      await updateUser({
        id: selectedUser.id,
        data: {
          email: editFormData.email,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          phone: editFormData.phone || undefined,
        },
      }).unwrap();
      showToast('User updated successfully', 'success');
      setShowEditModal(false);
      refetch();
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to update user', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Only super_admin can change roles to admin/super_admin
    if (['admin', 'super_admin'].includes(newRole) && userRole !== 'super_admin') {
      showToast('Only Super Admins can assign Admin roles', 'error');
      return;
    }

    try {
      await updateUserRole({ id: selectedUser.id, role: newRole }).unwrap();
      showToast('User role updated successfully', 'success');
      setShowModal(false);
      refetch();
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to update user role', 'error');
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    if (!hasPermission('users.edit')) {
      showToast('You do not have permission to modify users', 'error');
      return;
    }

    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateUserStatus({ id: userId, status: newStatus }).unwrap();
      showToast(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`, 'success');
      refetch();
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to update user status', 'error');
    }
  };

  const handleOpenPasswordModal = (user: AdminUser) => {
    if (!hasPermission('users.edit')) {
      showToast('You do not have permission to reset passwords', 'error');
      return;
    }
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Validate password
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await updateUserPassword({ id: selectedUser.id, newPassword }).unwrap();
      showToast('Password reset successfully', 'success');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showToast(error?.data?.error || 'Failed to reset password', 'error');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'editor':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'viewer':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'customer':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      moderator: 'Moderator',
      editor: 'Editor',
      viewer: 'Viewer',
      customer: 'Customer',
    };
    return roleNames[role] || role;
  };

  // Stats
  const totalUsers = pagination?.total || users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => ['super_admin', 'admin'].includes(u.role)).length;

  // Available roles based on current user's role
  const getAvailableRoles = () => {
    if (userRole === 'super_admin') {
      return ['customer', 'viewer', 'editor', 'moderator', 'admin', 'super_admin'];
    }
    if (userRole === 'admin') {
      return ['customer', 'viewer', 'editor', 'moderator'];
    }
    return ['customer'];
  };

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Manage user accounts and permissions ({totalUsers} users)</p>
        </div>
        <CanAccess permission="users.create">
          <Button variant="primary" onClick={handleCreateUser}>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create User
            </span>
          </Button>
        </CanAccess>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Active</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Admins</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">{adminUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Customers</p>
              <p className="text-xl md:text-2xl font-bold text-orange-600">
                {users.filter(u => u.role === 'customer').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-semibold text-gray-900">All Users</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2/30"
            >
              <option value="">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="customer">Customer</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 md:pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2/30"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Joined
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-100 rounded w-32"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-4 md:px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-4 md:px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : users.length > 0 ? users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-2 to-hover-button rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 md:px-3 py-1 md:py-1.5 inline-flex text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 md:px-3 py-1 md:py-1.5 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <CanAccess permission="users.edit">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-2 md:px-3 py-1 md:py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm"
                          title="Edit user details"
                        >
                          Edit
                        </button>
                      </CanAccess>
                      <CanAccess permission="users.edit">
                        <button
                          onClick={() => handleEditRole(user)}
                          className="px-2 md:px-3 py-1 md:py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors text-sm"
                          title="Change user role"
                        >
                          Role
                        </button>
                      </CanAccess>
                      <CanAccess permission="users.edit">
                        <button
                          onClick={() => handleOpenPasswordModal(user)}
                          className="px-2 md:px-3 py-1 md:py-1.5 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors text-sm"
                          title="Reset password"
                        >
                          PW
                        </button>
                      </CanAccess>
                      <CanAccess permission="users.edit">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium transition-colors text-sm ${
                            user.status === 'active'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </CanAccess>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No users found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm bg-secondary-2 text-white rounded-lg">
                {page}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Role Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit User Role"
      >
        {selectedUser && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 p-5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary-2 to-hover-button rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.firstName?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {selectedUser.id}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all cursor-pointer"
              >
                {getAvailableRoles().map((role) => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Permissions Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Permissions for {getRoleDisplayName(newRole)}:
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                {newRole === 'super_admin' && <p>• Full access to all features</p>}
                {newRole === 'admin' && (
                  <>
                    <p>• Manage products, categories, orders</p>
                    <p>• View and edit users (cannot manage other admins)</p>
                    <p>• Access settings and messages</p>
                  </>
                )}
                {newRole === 'moderator' && (
                  <>
                    <p>• Edit products (no delete)</p>
                    <p>• View and update orders</p>
                    <p>• View users and reply to messages</p>
                  </>
                )}
                {newRole === 'editor' && (
                  <>
                    <p>• Create and edit products</p>
                    <p>• View categories</p>
                  </>
                )}
                {newRole === 'viewer' && (
                  <p>• Read-only access to all sections</p>
                )}
                {newRole === 'customer' && (
                  <p>• No admin panel access</p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Warning</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Changing user roles will affect their permissions and access to the system immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Update Role
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Reset User Password"
      >
        {selectedUser && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="bg-gray-50 p-5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  passwordError ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter new password (min 8 characters)"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  passwordError ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Confirm new password"
                minLength={8}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This will reset the user's password and invalidate all their active sessions. They will need to log in again with the new password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : 'Reset Password'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
      >
        <form onSubmit={handleSubmitCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createFormData.firstName}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  createFormErrors.firstName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="John"
              />
              {createFormErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createFormData.lastName}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  createFormErrors.lastName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Doe"
              />
              {createFormErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={createFormData.email}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                createFormErrors.email ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="john@example.com"
            />
            {createFormErrors.email && (
              <p className="text-red-500 text-xs mt-1">{createFormErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={createFormData.phone}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
              placeholder="+1234567890"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={createFormData.password}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  createFormErrors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Min 8 characters"
              />
              {createFormErrors.password && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={createFormData.confirmPassword}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  createFormErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Confirm password"
              />
              {createFormErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={createFormData.role}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all cursor-pointer"
            >
              {getAvailableRoles().map((role) => (
                <option key={role} value={role}>
                  {getRoleDisplayName(role)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={isCreatingUser}>
              {isCreatingUser ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Details Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User Details"
      >
        {selectedUser && (
          <form onSubmit={handleSubmitEditUser} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <p className="text-sm text-gray-500">Editing user ID: {selectedUser.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="+1234567890"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={isUpdatingUser}>
                {isUpdatingUser ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Users;
