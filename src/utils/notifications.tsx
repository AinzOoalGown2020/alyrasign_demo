import useNotificationStore from "../stores/useNotificationStore";

export function notify(newNotification: {
  type?: string
  message: string
  description?: string
  txid?: string
}) {
  const store = useNotificationStore.getState()
  store.addNotification({ type: 'success', ...newNotification })
}
