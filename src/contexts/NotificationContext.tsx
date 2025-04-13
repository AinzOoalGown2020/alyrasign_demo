import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationType } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, description?: string, txid?: string) => void;
  removeNotification: (index: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: NotificationType, message: string, description?: string, txid?: string) => {
    const newNotification: Notification = { type, message, description, txid };
    setNotifications((prev) => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((_, i) => i !== prev.length - 1));
    }, 5000);
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}; 