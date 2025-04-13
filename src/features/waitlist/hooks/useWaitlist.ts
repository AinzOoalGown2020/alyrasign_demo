import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useNotification } from '../../../hooks/useNotification';
import { useProgram } from '../../../hooks/useProgram';
import { WaitlistEntry } from '../types';

export const useWaitlist = () => {
  const { publicKey, signTransaction } = useWallet();
  const { program } = useProgram();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinWaitlist = useCallback(async (formationPubkey: string) => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'instruction join_waitlist
      const tx = await program.methods
        .joinWaitlist()
        .accounts({
          formation: formationPubkey,
          student: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      notify({
        type: 'success',
        message: 'Inscription en liste d\'attente réussie',
        description: 'Vous avez été ajouté à la liste d\'attente avec succès.',
        txid: tx,
      });

      return tx;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription en liste d\'attente';
      setError(errorMessage);
      notify({
        type: 'error',
        message: 'Erreur',
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, program, notify]);

  const acceptPromotion = useCallback(async (formationPubkey: string) => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'instruction accept_promotion
      const tx = await program.methods
        .acceptPromotion()
        .accounts({
          formation: formationPubkey,
          student: publicKey,
        })
        .rpc();

      notify({
        type: 'success',
        message: 'Promotion acceptée',
        description: 'Vous avez accepté la promotion avec succès.',
        txid: tx,
      });

      return tx;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'acceptation de la promotion';
      setError(errorMessage);
      notify({
        type: 'error',
        message: 'Erreur',
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, program, notify]);

  const declinePromotion = useCallback(async (formationPubkey: string) => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'instruction decline_promotion
      const tx = await program.methods
        .declinePromotion()
        .accounts({
          formation: formationPubkey,
          student: publicKey,
        })
        .rpc();

      notify({
        type: 'success',
        message: 'Promotion refusée',
        description: 'Vous avez refusé la promotion avec succès.',
        txid: tx,
      });

      return tx;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du refus de la promotion';
      setError(errorMessage);
      notify({
        type: 'error',
        message: 'Erreur',
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, program, notify]);

  const dropFromWaitlist = useCallback(async (formationPubkey: string) => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'instruction drop_from_waitlist
      const tx = await program.methods
        .dropFromWaitlist()
        .accounts({
          formation: formationPubkey,
          student: publicKey,
        })
        .rpc();

      notify({
        type: 'success',
        message: 'Désistement effectué',
        description: 'Vous avez été retiré de la liste d\'attente avec succès.',
        txid: tx,
      });

      return tx;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du désistement de la liste d\'attente';
      setError(errorMessage);
      notify({
        type: 'error',
        message: 'Erreur',
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, program, notify]);

  const reorganizeWaitlist = useCallback(async (formationPubkey: string) => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'instruction reorganize_waitlist
      const tx = await program.methods
        .reorganizeWaitlist()
        .accounts({
          formation: formationPubkey,
          authority: publicKey,
        })
        .rpc();

      notify({
        type: 'success',
        message: 'File d\'attente réorganisée',
        description: 'La liste d\'attente a été réorganisée avec succès.',
        txid: tx,
      });

      return tx;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la réorganisation de la liste d\'attente';
      setError(errorMessage);
      notify({
        type: 'error',
        message: 'Erreur',
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, program, notify]);

  const getWaitlistPosition = useCallback(async (formationPubkey: string): Promise<WaitlistEntry | null> => {
    if (!publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupération de l'entrée de liste d'attente
      const [waitlistPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('waitlist'),
          new PublicKey(formationPubkey).toBuffer(),
          publicKey.toBuffer(),
        ],
        program.programId
      );

      const waitlistAccount = await program.account.waitlistEntry.fetch(waitlistPda);
      return waitlistAccount;
    } catch (err: any) {
      if (err.message.includes('Account does not exist')) {
        return null;
      }
      const errorMessage = err.message || 'Erreur lors de la récupération de la position';
      setError(errorMessage);
      notify({
        type: 'error',
        message: 'Erreur',
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [publicKey, program, notify]);

  return {
    joinWaitlist,
    acceptPromotion,
    declinePromotion,
    dropFromWaitlist,
    reorganizeWaitlist,
    getWaitlistPosition,
    loading,
    error,
  };
}; 