import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, Idl } from '@coral-xyz/anchor';
import { Alyrasign } from '../../../types/alyrasign';
import { useNotificationStore } from '../../../stores/notificationStore';
import { PublicKey, SystemProgram } from '@solana/web3.js';

interface AccessRequestData {
  name: string;
  email: string;
  role: 'student' | 'trainer';
  message: string;
  publicKey: string;
}

// Constantes de validation
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 200;
const MIN_NAME_LENGTH = 2;

// Fonction de validation des données
const validateForm = (data: AccessRequestData) => {
  if (!data.name || data.name.length < MIN_NAME_LENGTH) {
    throw new Error('Le nom doit contenir au moins 2 caractères');
  }
  if (data.name.length > MAX_NAME_LENGTH) {
    throw new Error(`Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères`);
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Email invalide');
  }
  if (data.email.length > MAX_EMAIL_LENGTH) {
    throw new Error(`L'email ne doit pas dépasser ${MAX_EMAIL_LENGTH} caractères`);
  }
  if (data.message && data.message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Le message ne doit pas dépasser ${MAX_MESSAGE_LENGTH} caractères`);
  }
};

// Fonction de traduction des erreurs
const translateError = (error: any): string => {
  const errorMessage = error.message || '';
  
  if (errorMessage.includes('Account does not exist')) {
    return 'Compte non trouvé';
  }
  if (errorMessage.includes('FieldTooLong')) {
    return 'Un des champs dépasse la longueur maximale autorisée';
  }
  if (errorMessage.includes('InvalidRole')) {
    return 'Rôle invalide';
  }
  if (errorMessage.includes('RequestAlreadyExists')) {
    return 'Une demande existe déjà pour ce wallet';
  }
  if (errorMessage.includes('Wallet non connecté')) {
    return 'Veuillez connecter votre wallet';
  }
  if (errorMessage.includes('DeclaredProgramIdMismatch')) {
    return 'Erreur de configuration du programme';
  }
  
  return 'Une erreur est survenue lors de la soumission de la demande';
};

export const useAccessRequest = (program: Program<Alyrasign>) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { addNotification } = useNotificationStore();

  const checkExistingRequest = async () => {
    if (!publicKey) return false;
    try {
      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from('request'), publicKey.toBuffer()],
        program.programId
      );
      try {
        // @ts-ignore - Le type est correct mais TypeScript ne le reconnaît pas
        const account = await program.account.accessRequest.fetch(pda);
        return account !== null;
      } catch (error: any) {
        // Si l'erreur est "Account does not exist", c'est normal pour une nouvelle demande
        if (error.message && error.message.includes('Account does not exist')) {
          return false;
        }
        // Pour toute autre erreur, on la propage
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la demande existante:', error);
      return false;
    }
  };

  const verifyRequestState = async (pda: PublicKey) => {
    try {
      // @ts-ignore - Le type est correct mais TypeScript ne le reconnaît pas
      const account = await program.account.accessRequest.fetch(pda);
      if (account.status !== 'Pending') {
        throw new Error('La demande a déjà été traitée');
      }
      return account;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'état:', error);
      throw error;
    }
  };

  const submitRequest = async (data: AccessRequestData) => {
    if (!publicKey) {
      throw new Error('Wallet non connecté');
    }

    try {
      // Validation des données
      validateForm(data);

      // Création du PDA
      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from('request'), publicKey.toBuffer()],
        program.programId
      );

      // Vérification de l'état existant
      const existingRequest = await checkExistingRequest();
      if (existingRequest) {
        const account = await verifyRequestState(pda);
        if (account.status !== 'Pending') {
          throw new Error('Une demande existe déjà et a été traitée');
        }
        throw new Error('Une demande est déjà en cours');
      }

      // Soumission de la demande
      await program.methods
        .createAccessRequest(data.role, data.message)
        .accounts({
          requester: publicKey,
          accessRequest: pda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      addNotification({
        type: 'success',
        message: 'Demande d\'accès soumise avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      const translatedError = translateError(error);
      addNotification({
        type: 'error',
        message: translatedError,
      });
      throw error;
    }
  };

  return {
    checkExistingRequest,
    submitRequest,
  };
}; 