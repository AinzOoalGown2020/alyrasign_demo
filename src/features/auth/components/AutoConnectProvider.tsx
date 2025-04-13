import { FC, ReactNode, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useNotificationStore from '../../../stores/useNotificationStore';
import { NotificationState } from '../../../types/notification';

interface AutoConnectProviderProps {
  /** Composants enfants à wrapper */
  children: ReactNode;
  /** Délai avant la tentative de reconnexion (en ms) */
  reconnectDelay?: number;
}

/**
 * Provider qui tente de reconnecter automatiquement le wallet Solana
 */
export const AutoConnectProvider: FC<AutoConnectProviderProps> = ({ 
  children,
  reconnectDelay = 1000
}) => {
  const { connect, connected, wallet, connecting } = useWallet();
  const setNotificationStore = useNotificationStore((state: NotificationState) => state.set);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const attemptConnection = async () => {
      if (!connected && wallet && !connecting) {
        try {
          await connect();
          setNotificationStore((prev: NotificationState) => ({
            ...prev,
            notifications: [
              ...prev.notifications,
              {
                type: 'success',
                message: 'Connexion automatique réussie',
                description: `Connecté avec ${wallet.adapter.name}`
              }
            ]
          }));
        } catch (error) {
          console.error('Erreur lors de la connexion automatique:', error);
          setNotificationStore((prev: NotificationState) => ({
            ...prev,
            notifications: [
              ...prev.notifications,
              {
                type: 'error',
                message: 'Échec de la connexion automatique',
                description: 'Veuillez vous connecter manuellement'
              }
            ]
          }));
          // Réessayer après le délai spécifié
          timeoutId = setTimeout(attemptConnection, reconnectDelay);
        }
      }
    };

    attemptConnection();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [connected, connect, wallet, connecting, reconnectDelay, setNotificationStore]);

  return <>{children}</>;
}; 