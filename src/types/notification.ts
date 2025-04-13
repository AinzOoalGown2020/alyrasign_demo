export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  /** Type de notification */
  type: NotificationType;
  /** Message principal */
  message: string;
  /** Description détaillée (optionnelle) */
  description?: string;
  /** ID de la transaction Solana (optionnel) */
  txid?: string;
}

export interface NotificationState {
  /** Liste des notifications actives */
  notifications: Notification[];
  /** Fonction pour mettre à jour l'état */
  set: (state: NotificationState) => void;
} 