import { useCallback } from 'react';
import { useNotificationStore } from '../stores/useNotificationStore';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
  txid?: string;
}

export const useNotification = () => {
  const setNotificationStore = useNotificationStore((state) => state.set);

  const notify = useCallback((notification: Notification) => {
    setNotificationStore((state) => ({
      ...state,
      notifications: [...state.notifications, notification],
    }));
  }, [setNotificationStore]);

  return { notify };
}; 