import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { useNotification } from '../../../stores/useNotificationStore';
import { getWaitlistEntries, joinWaitlist, promoteFromWaitlist } from '../../../lib/solana';
import { WaitlistEntry } from '../types';

export const useWaitlist = (formationId: string) => {
  const { publicKey } = useWallet();
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setNotificationStore } = useNotification();

  useEffect(() => {
    if (formationId) {
      loadWaitlistEntries();
    }
  }, [formationId]);

  const loadWaitlistEntries = async () => {
    try {
      setIsLoading(true);
      const entries = await getWaitlistEntries(formationId);
      setWaitlistEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la liste d\'attente');
      setNotificationStore({
        type: 'error',
        message: 'Erreur',
        description: 'Impossible de charger la liste d\'attente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    if (!publicKey) {
      setNotificationStore({
        type: 'error',
        message: 'Erreur',
        description: 'Veuillez connecter votre wallet',
      });
      return;
    }

    try {
      setIsLoading(true);
      await joinWaitlist(formationId);
      setNotificationStore({
        type: 'success',
        message: 'Succès',
        description: 'Vous avez été ajouté à la liste d\'attente',
      });
      await loadWaitlistEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout à la liste d\'attente');
      setNotificationStore({
        type: 'error',
        message: 'Erreur',
        description: 'Impossible de vous ajouter à la liste d\'attente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteFromWaitlist = async (entryId: string) => {
    if (!publicKey) {
      setNotificationStore({
        type: 'error',
        message: 'Erreur',
        description: 'Veuillez connecter votre wallet',
      });
      return;
    }

    try {
      setIsLoading(true);
      await promoteFromWaitlist(formationId, entryId);
      setNotificationStore({
        type: 'success',
        message: 'Succès',
        description: 'L\'étudiant a été promu de la liste d\'attente',
      });
      await loadWaitlistEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la promotion');
      setNotificationStore({
        type: 'error',
        message: 'Erreur',
        description: 'Impossible de promouvoir l\'étudiant',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    waitlistEntries,
    isLoading,
    error,
    joinWaitlist: handleJoinWaitlist,
    promoteFromWaitlist: handlePromoteFromWaitlist,
    refreshWaitlist: loadWaitlistEntries,
  };
}; 