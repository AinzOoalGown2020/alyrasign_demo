import { useEffect, useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useNotificationStore from '../../../stores/useNotificationStore';
import { WaitlistStatus } from '../types';

interface NotificationStore {
  notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }>;
  set: (fn: (state: { notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }> }) => { notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }> }) => void;
}

export const useWaitlistNotifications = (formationPubkey: string) => {
  const { connection } = useConnection();
  const setNotificationStore = useNotificationStore((state: NotificationStore) => state.set);

  const handleWaitlistUpdate = useCallback(async (waitlistEntry: any) => {
    if (!waitlistEntry) return;

    const status = waitlistEntry.status as WaitlistStatus;
    const position = waitlistEntry.position;

    switch (status) {
      case WaitlistStatus.PendingPromotion:
        setNotificationStore((state) => ({
          notifications: [...state.notifications, {
            type: 'success',
            message: 'Place disponible !',
            description: `Une place s'est libérée à la position ${position + 1}. Vous avez 24h pour accepter la promotion.`,
          }],
        }));
        break;

      case WaitlistStatus.Promoted:
        setNotificationStore((state) => ({
          notifications: [...state.notifications, {
            type: 'success',
            message: 'Promotion acceptée',
            description: 'Vous êtes maintenant inscrit à la formation.',
          }],
        }));
        break;

      case WaitlistStatus.Declined:
        setNotificationStore((state) => ({
          notifications: [...state.notifications, {
            type: 'info',
            message: 'Promotion refusée',
            description: 'Vous avez refusé la promotion. Vous restez sur la liste d\'attente.',
          }],
        }));
        break;

      case WaitlistStatus.Expired:
        setNotificationStore((state) => ({
          notifications: [...state.notifications, {
            type: 'error',
            message: 'Promotion expirée',
            description: 'Le délai pour accepter la promotion est expiré. Vous restez sur la liste d\'attente.',
          }],
        }));
        break;

      case WaitlistStatus.Reorganized:
        setNotificationStore((state) => ({
          notifications: [...state.notifications, {
            type: 'info',
            message: 'File d\'attente réorganisée',
            description: `Votre nouvelle position dans la liste d'attente est ${position + 1}.`,
          }],
        }));
        break;
    }
  }, [setNotificationStore]);

  useEffect(() => {
    if (!formationPubkey) return;

    const waitlistPubkey = new PublicKey(formationPubkey);
    let subscriptionId: number;

    const subscribeToWaitlistUpdates = async () => {
      try {
        subscriptionId = connection.onProgramAccountChange(
          new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!),
          async (accountInfo) => {
            if (accountInfo.accountId.equals(waitlistPubkey)) {
              await handleWaitlistUpdate(accountInfo.accountInfo.data);
            }
          },
          'confirmed'
        );
      } catch (error) {
        console.error('Erreur lors de la souscription aux mises à jour:', error);
      }
    };

    subscribeToWaitlistUpdates();

    return () => {
      if (subscriptionId) {
        connection.removeProgramAccountChangeListener(subscriptionId);
      }
    };
  }, [connection, formationPubkey, handleWaitlistUpdate]);
}; 