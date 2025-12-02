import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// RBAC Permission types
export type Permission = 
  | 'dashboard.view'
  | 'products.view' | 'products.create' | 'products.edit' | 'products.delete'
  | 'categories.view' | 'categories.create' | 'categories.edit' | 'categories.delete'
  | 'orders.view' | 'orders.update' | 'orders.cancel'
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete' | 'users.manage_roles'
  | 'messages.view' | 'messages.reply'
  | 'settings.view' | 'settings.edit'
  | 'roles.view' | 'roles.manage';

export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'editor' | 'viewer' | 'customer';

// Role-based permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'dashboard.view',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
    'orders.view', 'orders.update', 'orders.cancel',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.manage_roles',
    'messages.view', 'messages.reply',
    'settings.view', 'settings.edit',
    'roles.view', 'roles.manage',
  ],
  admin: [
    'dashboard.view',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
    'orders.view', 'orders.update', 'orders.cancel',
    'users.view', 'users.edit',
    'messages.view', 'messages.reply',
    'settings.view', 'settings.edit',
  ],
  moderator: [
    'dashboard.view',
    'products.view', 'products.edit',
    'categories.view',
    'orders.view', 'orders.update',
    'users.view',
    'messages.view', 'messages.reply',
  ],
  editor: [
    'dashboard.view',
    'products.view', 'products.create', 'products.edit',
    'categories.view',
  ],
  viewer: [
    'dashboard.view',
    'products.view',
    'categories.view',
    'orders.view',
    'users.view',
  ],
  customer: [],
};

// RBAC Context
interface RBACContextType {
  userRole: UserRole;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessAdmin: boolean;
}

const RBACContext = createContext<RBACContextType>({
  userRole: 'customer',
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  canAccessAdmin: false,
});

export const useRBAC = () => useContext(RBACContext);

// Permission check component
export const CanAccess: React.FC<{
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permission, permissions = [], requireAll = false, fallback = null, children }) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();
  
  if (permission && hasPermission(permission)) {
    return <>{children}</>;
  }
  
  if (permissions.length > 0) {
    if (requireAll && hasAllPermissions(permissions)) {
      return <>{children}</>;
    }
    if (!requireAll && hasAnyPermission(permissions)) {
      return <>{children}</>;
    }
  }
  
  return <>{fallback}</>;
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  
  // Determine user role
  const userRole: UserRole = (user?.role as UserRole) || 'customer';
  const permissions = rolePermissions[userRole] || [];
  const canAccessAdmin = ['super_admin', 'admin', 'moderator', 'editor', 'viewer'].includes(userRole);
  
  // Permission helpers
  const hasPermission = (permission: Permission): boolean => permissions.includes(permission);
  const hasAnyPermission = (perms: Permission[]): boolean => perms.some(p => permissions.includes(p));
  const hasAllPermissions = (perms: Permission[]): boolean => perms.every(p => permissions.includes(p));

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !token) {
      navigate('/admin/login');
      return;
    }
    
    // Check if user has admin access
    if (!canAccessAdmin) {
      navigate('/');
      return;
    }
    
    setIsLoading(false);
  }, [isAuthenticated, token, canAccessAdmin, navigate]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary-2 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <RBACContext.Provider value={{ userRole, permissions, hasPermission, hasAnyPermission, hasAllPermissions, canAccessAdmin }}>
      <div className="min-h-screen bg-gray-50/50">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="flex-1 lg:pl-72">
            <Topbar onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </RBACContext.Provider>
  );
};

export default AdminLayout;
