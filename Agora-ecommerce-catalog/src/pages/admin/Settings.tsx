import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';

// Types for settings (defined locally instead of importing from mock data)
interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: string;
  shippingFee: string;
  freeShippingThreshold: string;
}

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

// Default values (can be loaded from localStorage or API in the future)
const getStoredSettings = (): StoreSettings => {
  try {
    const stored = localStorage.getItem('storeSettings');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    storeName: 'Agora E-Commerce',
    storeEmail: 'support@agora.com',
    storePhone: '+1 234 567 8900',
    storeAddress: '123 Commerce Street, Business City, BC 12345',
    currency: 'USD',
    taxRate: '10',
    shippingFee: '9.99',
    freeShippingThreshold: '100',
  };
};

const getStoredSocialLinks = (): SocialLinks => {
  try {
    const stored = localStorage.getItem('socialLinks');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  };
};

const Settings: React.FC = () => {
  const { toasts = [], showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState('store');
  const [isSaving, setIsSaving] = useState(false);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(getStoredSettings);

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(getStoredSocialLinks);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    shippingUpdates: true,
    promotionalEmails: false,
    lowStockAlerts: true,
    newUserRegistration: true,
    orderReviews: true,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginNotifications: true,
  });

  const handleSaveStoreSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for persistence
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
      // TODO: Save to backend when API endpoint is available
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Store settings saved successfully', 'success');
    } catch {
      showToast('Failed to save store settings', 'error');
    }
    setIsSaving(false);
  };

  const handleSaveSocialLinks = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Social links saved successfully', 'success');
    } catch {
      showToast('Failed to save social links', 'error');
    }
    setIsSaving(false);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Notification settings saved successfully', 'success');
    } catch {
      showToast('Failed to save notification settings', 'error');
    }
    setIsSaving(false);
  };

  const handleSaveSecurity = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('securitySettings', JSON.stringify(security));
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Security settings saved successfully', 'success');
    } catch {
      showToast('Failed to save security settings', 'error');
    }
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showToast('Account deletion requested. You will receive a confirmation email.', 'info');
    }
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: '🏪' },
    { id: 'social', label: 'Social Links', icon: '🔗' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

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
      <div>
        <h1 className="text-2xl md:text-3xl font-inter font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your store settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                activeTab === tab.id
                  ? 'bg-secondary-2 text-white shadow-lg shadow-secondary-2/20'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Store Info Tab */}
      {activeTab === 'store' && (
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>
              <p className="text-sm text-gray-500">Basic information about your store</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="Your store name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Email
              </label>
              <input
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="contact@store.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Phone
              </label>
              <input
                type="tel"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all cursor-pointer"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Address
              </label>
              <textarea
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all resize-none"
                placeholder="Your store address"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={storeSettings.taxRate}
                onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shipping Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={storeSettings.shippingFee}
                onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="9.99"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                value={storeSettings.freeShippingThreshold}
                onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="100"
              />
              <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
            <Button variant="primary" onClick={handleSaveStoreSettings} disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Social Media Links</h2>
              <p className="text-sm text-gray-500">Connect your social media accounts</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/yourpage' },
              { key: 'twitter', label: 'Twitter / X', icon: '🐦', placeholder: 'https://twitter.com/yourhandle' },
              { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/yourprofile' },
              { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/yourcompany' },
              { key: 'youtube', label: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/@yourchannel' },
            ].map((social) => (
              <div key={social.key} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {social.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {social.label}
                  </label>
                  <input
                    type="url"
                    value={socialLinks[social.key as keyof SocialLinks]}
                    onChange={(e) => setSocialLinks({ ...socialLinks, [social.key]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                    placeholder={social.placeholder}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
            <Button variant="primary" onClick={handleSaveSocialLinks} disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
              <p className="text-sm text-gray-500">Manage your email notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'orderConfirmation', label: 'Order Confirmations', description: 'Receive email when a new order is placed' },
              { key: 'shippingUpdates', label: 'Shipping Updates', description: 'Receive email when order status changes' },
              { key: 'promotionalEmails', label: 'Promotional Emails', description: 'Receive marketing and promotional emails' },
              { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Receive email when product stock is low' },
              { key: 'newUserRegistration', label: 'New User Registration', description: 'Receive email when a new user registers' },
              { key: 'orderReviews', label: 'Order Reviews', description: 'Receive email when a customer leaves a review' },
            ].map((notification) => (
              <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-gray-900">{notification.label}</p>
                  <p className="text-sm text-gray-500 truncate">{notification.description}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [notification.key]: !notifications[notification.key as keyof typeof notifications] })}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    notifications[notification.key as keyof typeof notifications] ? 'bg-secondary-2' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      notifications[notification.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
            <Button variant="primary" onClick={handleSaveNotifications} disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => setSecurity({ ...security, twoFactorAuth: !security.twoFactorAuth })}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    security.twoFactorAuth ? 'bg-secondary-2' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-gray-900">Login Notifications</p>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                </div>
                <button
                  onClick={() => setSecurity({ ...security, loginNotifications: !security.loginNotifications })}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    security.loginNotifications ? 'bg-secondary-2' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">Session Timeout</p>
                </div>
                <p className="text-sm text-gray-500 mb-3">Automatically log out after inactivity</p>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 transition-all cursor-pointer"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
              <Button variant="primary" onClick={handleSaveSecurity} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-red-200 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
                <p className="text-sm text-red-600">Irreversible and destructive actions</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-red-800">Delete Account</p>
                  <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleDeleteAccount}
                  className="!bg-red-600 !text-white hover:!bg-red-700 !border-red-600"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
