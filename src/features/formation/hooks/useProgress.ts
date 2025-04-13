import { useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useNotification } from '../../../hooks/useNotification';
import { useProgram } from '../../../hooks/useProgram';
import { Progress, ProgressStatus } from '../types';

export const useProgress = () => {
  const { publicKey, signTransaction } = useWallet();
  const { program } = useProgram();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProgress = useCallback(async (formationPubkey: string): Promise<Progress | null> => {
    if (!publicKey || !program) {
      setError('Wallet not connected or program not initialized');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupération du compte de progression
      const [progressPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('progress'),
          new PublicKey(formationPubkey).toBuffer(),
          publicKey.toBuffer(),
        ],
        program.programId
      );

      const progressAccount = await program.account.progress.fetch(progressPda);
      return progressAccount;
    } catch (err: any) {
      if (err.message.includes('Account does not exist')) {
        return null;
      }
      const errorMessage = err.message || 'Erreur lors de la récupération de la progression';
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

  const updateProgress = useCallback(async (formationPubkey: string, sessionId: string): Promise<string | null> => {
    if (!publicKey || !signTransaction || !program) {
      setError('Wallet not connected or program not initialized');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'instruction update_progress
      const tx = await program.methods
        .updateProgress()
        .accounts({
          formation: formationPubkey,
          session: sessionId,
          student: publicKey,
        })
        .rpc();

      notify({
        type: 'success',
        message: 'Progression mise à jour',
        description: 'Votre progression a été mise à jour avec succès.',
        txid: tx,
      });

      return tx;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour de la progression';
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
  }, [publicKey, signTransaction, program, notify]);

  return {
    getProgress,
    updateProgress,
    loading,
    error,
  };
}; 