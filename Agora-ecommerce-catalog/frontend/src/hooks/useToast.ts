import { useState, useCallback } from 'react';
import type { ToastType } from '../components/common/Toast';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  // Single toast state (legacy support)
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  // Multiple toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Show single toast (legacy)
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({
      isVisible: true,
      message,
      type,
    });

    // Also add to toasts array for multi-toast support
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  // Hide single toast (legacy)
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Remove specific toast from array
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return {
    // Legacy single toast
    toast,
    showToast,
    hideToast,
    // Multi-toast support
    toasts,
    removeToast,
    clearToasts,
    // Convenience methods
    success,
    error,
    warning,
    info,
  };
};
