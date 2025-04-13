import create from 'zustand'

interface Notification {
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string
  description?: string
  txid?: string
  timestamp?: number
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (index: number) => void
  set: (fn: (state: NotificationStore) => NotificationStore) => void
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification: Notification) =>
    set((state: NotificationStore) => ({
      notifications: [
        ...state.notifications,
        { ...notification, timestamp: Date.now() },
      ],
    })),
  removeNotification: (index: number) =>
    set((state: NotificationStore) => ({
      notifications: state.notifications.filter((_: Notification, i: number) => i !== index),
    })),
  set: (fn) => set(fn),
}))

export default useNotificationStore 