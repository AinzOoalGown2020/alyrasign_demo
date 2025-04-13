import create from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
}

interface NotificationStore extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

type SetState = (
  partial: NotificationState | ((state: NotificationState) => NotificationState),
  replace?: boolean
) => void;

export const useNotificationStore = create<NotificationStore>((set: SetState) => ({
  notifications: [],
  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    set((state: NotificationState) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state: NotificationState) => ({
          notifications: state.notifications.filter((n: Notification) => n.id !== id),
        }));
      }, notification.duration || 5000);
    }
  },
  removeNotification: (id: string) => {
    set((state: NotificationState) => ({
      notifications: state.notifications.filter((n: Notification) => n.id !== id),
    }));
  },
})); 