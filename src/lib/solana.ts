import { Program, AnchorProvider, Wallet as AnchorWallet, BN, Idl, IdlAccounts, IdlTypes, ProgramAccount, web3 } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, VersionedTransaction, SignatureResult, SystemProgram, SYSVAR_RENT_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState, Wallet } from '@solana/wallet-adapter-react';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { toast } from 'react-toastify';
import { IDL, PROGRAM_ID, AlyraSignAccountData } from './idl/alyrasign';
import { TransactionMessage } from '@solana/web3.js';
import { WaitlistEntry, WaitlistStatus } from '../features/formation/types';

// Types pour le wallet
export interface ExtendedWalletContextState extends Omit<WalletContextState, 'wallet'> {
  wallet: Wallet | null;
}

// Types pour les erreurs
export interface ProgramError extends Error {
  code?: string;
  logs?: string[];
}

// Types pour le programme
export type AlyraSignProgram = Program<Idl>;

// Types pour les comptes
export type AccessRequestAccount = IdlAccounts<typeof IDL>['AccessRequest'];
export type FormationAccount = IdlAccounts<typeof IDL>['Formation'];
export type SessionAccount = IdlAccounts<typeof IDL>['Session'];
export type AttendanceAccount = IdlAccounts<typeof IDL>['Attendance'];

// Types pour les PDAs
export type PDAResult = [PublicKey, number];

// Types pour les demandes d'accès
export interface RequestData {
  id: string;
  walletAddress: string;
  requestedRole: string;
  message: string;
  status: string;
  processedAt?: string;
  timestamp: string;
}

// Récupérer les seeds depuis .env.local
export const ACCESS_STORAGE_SEED = process.env.NEXT_PUBLIC_ACCESS_STORAGE_SEED || "access-storage";
export const FORMATION_STORAGE_SEED = process.env.NEXT_PUBLIC_FORMATION_STORAGE_SEED || "formation-storage";
export const SESSION_STORAGE_SEED = process.env.NEXT_PUBLIC_SESSION_STORAGE_SEED || "session-storage";
export const ATTENDANCE_STORAGE_SEED = process.env.NEXT_PUBLIC_ATTENDANCE_STORAGE_SEED || "attendance-storage";
export const REQUEST_SEED = process.env.NEXT_PUBLIC_REQUEST_SEED || "req";
export const FORMATION_SEED = process.env.NEXT_PUBLIC_FORMATION_SEED || "f";
export const SESSION_SEED = process.env.NEXT_PUBLIC_SESSION_SEED || "s";
export const ATTENDANCE_SEED = process.env.NEXT_PUBLIC_ATTENDANCE_SEED || "a";
export const ENROLLMENT_SEED = process.env.NEXT_PUBLIC_ENROLLMENT_SEED || "e";

// Configuration des tailles maximales depuis .env.local
export const MAX_ROLE_LENGTH = parseInt(process.env.NEXT_PUBLIC_MAX_ROLE_LENGTH || "20");
export const MAX_MESSAGE_LENGTH = parseInt(process.env.NEXT_PUBLIC_MAX_MESSAGE_LENGTH || "100");
export const MAX_TITLE_LENGTH = parseInt(process.env.NEXT_PUBLIC_MAX_TITLE_LENGTH || "100");
export const MAX_DESCRIPTION_LENGTH = parseInt(process.env.NEXT_PUBLIC_MAX_DESCRIPTION_LENGTH || "500");
export const MAX_LOCATION_LENGTH = parseInt(process.env.NEXT_PUBLIC_MAX_LOCATION_LENGTH || "100");

// Configuration des timeouts et limites
export const TX_TIMEOUT_MS = parseInt(process.env.NEXT_PUBLIC_TX_TIMEOUT_MS || "30000");
export const MAX_RETRIES = parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || "3");
export const RETRY_DELAY_MS = parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY_MS || "2000");

// Messages personnalisables
export const SUCCESS_ATTENDANCE_MESSAGE = process.env.NEXT_PUBLIC_SUCCESS_ATTENDANCE_MESSAGE || "Présence enregistrée avec succès";
export const ERROR_ATTENDANCE_MESSAGE = process.env.NEXT_PUBLIC_ERROR_ATTENDANCE_MESSAGE || "Erreur lors de l'enregistrement de la présence";
export const SUCCESS_ATTENDANCE_UPDATE_MESSAGE = process.env.NEXT_PUBLIC_SUCCESS_ATTENDANCE_UPDATE_MESSAGE || "Présence mise à jour avec succès";
export const ERROR_ATTENDANCE_UPDATE_MESSAGE = process.env.NEXT_PUBLIC_ERROR_ATTENDANCE_UPDATE_MESSAGE || "Erreur lors de la mise à jour de la présence";
export const SUCCESS_ATTENDANCE_LIST_MESSAGE = process.env.NEXT_PUBLIC_SUCCESS_ATTENDANCE_LIST_MESSAGE || "Liste des présences récupérée avec succès";
export const ERROR_ATTENDANCE_LIST_MESSAGE = process.env.NEXT_PUBLIC_ERROR_ATTENDANCE_LIST_MESSAGE || "Erreur lors de la récupération des présences";

// Messages d'administration
export const SUCCESS_ADMIN_INITIALIZATION_MESSAGE = process.env.NEXT_PUBLIC_SUCCESS_ADMIN_INITIALIZATION_MESSAGE || "Initialisation réussie";
export const ERROR_ADMIN_INITIALIZATION_MESSAGE = process.env.NEXT_PUBLIC_ERROR_ADMIN_INITIALIZATION_MESSAGE || "Erreur lors de l'initialisation";
export const SUCCESS_ADMIN_APPROVAL_MESSAGE = process.env.NEXT_PUBLIC_SUCCESS_ADMIN_APPROVAL_MESSAGE || "Demande approuvée avec succès";
export const ERROR_ADMIN_APPROVAL_MESSAGE = process.env.NEXT_PUBLIC_ERROR_ADMIN_APPROVAL_MESSAGE || "Erreur lors de l'approbation de la demande";
export const SUCCESS_ADMIN_REJECT_MESSAGE = process.env.NEXT_PUBLIC_SUCCESS_ADMIN_REJECT_MESSAGE || "Demande rejetée avec succès";
export const ERROR_ADMIN_REJECT_MESSAGE = process.env.NEXT_PUBLIC_ERROR_ADMIN_REJECT_MESSAGE || "Erreur lors du rejet de la demande";

// Variable pour contrôler l'utilisation de la blockchain
const USE_BLOCKCHAIN = process.env.NEXT_PUBLIC_USE_BLOCKCHAIN === 'true';
console.log("USE_BLOCKCHAIN value:", USE_BLOCKCHAIN, "Type:", typeof USE_BLOCKCHAIN);

// Types d'erreurs possibles
export const ErrorTypes = {
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  ALREADY_INITIALIZED: 'ALREADY_INITIALIZED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
};

export interface ExtendedSignatureResult extends SignatureResult {
  logs?: string[];
}

export interface CustomWalletAdapter extends WalletAdapter {
  adapter: {
    name: string;
  };
}

/**
 * Obtenir le provider Anchor avec le wallet actuel
 */
export const getProvider = (wallet: AnchorWallet, connection: Connection): AnchorProvider => {
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed'
  });
};

/**
 * Fonction utilitaire pour obtenir le programme
 */
export const getProgram = (wallet: AnchorWallet, connection: Connection): AlyraSignProgram => {
  const provider = getProvider(wallet, connection);
  return new Program(IDL, PROGRAM_ID, provider);
};

// Fonction pour trouver le PDA du stockage
export const findAccessStoragePDA = async () => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('access_storage')],
    PROGRAM_ID
  );
};

// Fonction pour trouver le PDA d'une demande d'accès
export const findAccessRequestPDA = async (user: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from("access_request"),
      user.toBuffer()
    ],
    new PublicKey(PROGRAM_ID)
  );
};

/**
 * Trouve l'adresse PDA pour le stockage des formations
 */
export const findFormationStoragePDA = async (): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FORMATION_STORAGE_SEED)],
    PROGRAM_ID
  );
};

/**
 * Trouve l'adresse PDA pour le stockage des sessions
 */
export const findSessionStoragePDA = async (): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SESSION_STORAGE_SEED)],
    PROGRAM_ID
  );
};

// Fonction pour récupérer les demandes d'accès
export const getAccessRequests = async (
  wallet: AnchorWallet,
  connection: Connection
): Promise<RequestData[]> => {
  try {
    if (!USE_BLOCKCHAIN) {
      // Mode simulation
      const requests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
      return requests.map((req: RequestData) => ({
        id: req.id,
        walletAddress: req.walletAddress,
        requestedRole: req.requestedRole,
        message: req.message,
        status: req.status,
        processedAt: req.processedAt,
        timestamp: req.timestamp
      }));
    }

    if (!wallet || !wallet.publicKey) {
      console.error("Wallet non initialisé");
      return [];
    }

    const program = getProgram(wallet, connection);
    if (!program) {
      console.error("Programme non disponible");
      return [];
    }

    try {
      // Récupérer le PDA du stockage
      const [storagePDA] = await findAccessStoragePDA();
      console.log("Storage PDA pour getAccessRequests:", storagePDA.toString());

      // Récupérer le compte de stockage
      const storageAccount = await program.account.accessRequestStorage.fetch(storagePDA);
      if (!storageAccount) {
        console.log("Aucun compte de stockage trouvé");
        return [];
      }

      console.log("Compte de stockage trouvé:", storageAccount);
      console.log("Nombre total de demandes:", storageAccount.requestCount);

      const requests: RequestData[] = [];
      
      // Parcourir toutes les demandes
      for (let i = 0; i < storageAccount.requestCount; i++) {
        try {
          const requestAddress = storageAccount.requests[i];
          if (!requestAddress) continue;

          const requestAccount = await program.account.accessRequest.fetch(requestAddress);
          if (!requestAccount) continue;

          requests.push({
            id: requestAddress.toString(),
            walletAddress: requestAccount.user.toString(),
            requestedRole: requestAccount.role,
            message: requestAccount.message,
            status: requestAccount.status,
            processedAt: requestAccount.updatedAt ? new Date(requestAccount.updatedAt * 1000).toISOString() : undefined,
            timestamp: new Date(requestAccount.createdAt * 1000).toISOString()
          });
        } catch (error) {
          console.error(`Erreur lors de la récupération de la demande ${i}:`, error);
          continue;
        }
      }

      return requests;
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      return [];
    }
  } catch (error) {
    console.error("Erreur générale dans getAccessRequests:", error);
    return [];
  }
};

/**
 * Calcule l'adresse PDA pour une formation
 */
export const calculateFormationPDA = async (formationId: string): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FORMATION_SEED), Buffer.from(formationId)],
    PROGRAM_ID
  );
};

/**
 * Calcule l'adresse PDA pour une session
 */
export const calculateSessionPDA = async (sessionId: string): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SESSION_SEED), Buffer.from(sessionId)],
    PROGRAM_ID
  );
};

/**
 * Fonction pour créer une formation avec intégration blockchain
 */
export const createFormation = async (
  title: string, 
  description: string, 
  wallet: AnchorWallet, 
  connection: Connection
): Promise<boolean> => {
  try {
    if (process.env.NEXT_PUBLIC_USE_BLOCKCHAIN === 'true') {
      const program = getProgram(wallet, connection);
      
      if (!wallet) {
        throw new Error("Wallet not connected");
      }
      
      const [storagePda] = await findFormationStoragePDA();
      const formationId = Date.now().toString();
      const [formationPda] = await calculateFormationPDA(formationId);
      
      await program.methods
        .upsertFormation(
          formationId,
          title,
          description
        )
        .accounts({
          signer: wallet.publicKey,
          formationStorage: storagePda,
          formation: formationPda,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .rpc();
      
      return true;
    } else {
      // Version simulation (localStorage)
      const formationsJson = localStorage.getItem('alyraSign_formations');
      const formations = formationsJson ? JSON.parse(formationsJson) : [];
      
      const newFormation = {
        id: Date.now().toString(),
        title,
        description,
        createdAt: Date.now()
      };
      
      formations.push(newFormation);
      localStorage.setItem('alyraSign_formations', JSON.stringify(formations));
      
      return true;
    }
  } catch (error: unknown) {
    console.error('Erreur lors de la création de la formation:', error);
    if (error instanceof Error) {
      toast.error('Erreur lors de la création de la formation: ' + error.message);
    }
    return false;
  }
};

/**
 * Fonction pour créer une session avec intégration blockchain
 */
export const createSession = async (formationId: string, title: string, date: string, location: string, wallet: any, connection: any) => {
  try {
    if (process.env.NEXT_PUBLIC_USE_BLOCKCHAIN === 'true') {
      const program = getProgram(wallet as AnchorWallet, connection) as AlyraSignProgram;
      
      if (!wallet) {
        throw new Error("Wallet not connected");
      }
      
      const [storagePda] = await findSessionStoragePDA();
      const startDate = Math.floor(new Date(date).getTime() / 1000);
      const endDate = startDate + 2 * 60 * 60;
      const sessionId = Date.now().toString();
      const [sessionPda] = await calculateSessionPDA(sessionId);
      
      await (program.methods
        .createSession(
          sessionId,
          formationId,
          new BN(startDate),
          new BN(endDate),
          location
        ) as any)
        .accounts({
          signer: wallet.publicKey,
          sessionStorage: storagePda,
          session: sessionPda,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .rpc();
      
      return true;
    } else {
      // Version simulation (localStorage)
      // Récupérer les sessions depuis le localStorage
      const sessionsJson = localStorage.getItem('alyraSign_sessions');
      const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
      
      // Créer une nouvelle session
      const newSession = {
        id: Date.now().toString(),
        formationId,
        title,
        date,
        location,
        createdAt: Date.now()
      };
      
      // Ajouter la nouvelle session à la liste
      sessions.push(newSession);
      
      // Enregistrer les modifications
      localStorage.setItem('alyraSign_sessions', JSON.stringify(sessions));
      
      return true;
    }
  } catch (error: unknown) {
    console.error('Erreur lors de la création de la session:', error);
    if (error instanceof Error) {
      toast.error('Erreur lors de la création de la session: ' + error.message);
    }
    return false;
  }
};

/**
 * Fonction pour récupérer les formations
 */
export const getFormations = async () => {
  try {
    if (process.env.NEXT_PUBLIC_USE_BLOCKCHAIN === 'true') {
      // Version blockchain - à implémenter avec des filtres de compte
      // Récupérer les formations depuis le programme
      
      // Exemple simplifié pour le moment
      const formationsJson = localStorage.getItem('alyraSign_formations');
      
      if (!formationsJson) return [];
      
      return JSON.parse(formationsJson);
    } else {
      // Version simulation (localStorage)
      // Récupérer les formations depuis le localStorage
      const formationsJson = localStorage.getItem('alyraSign_formations');
      
      if (!formationsJson) return [];
      
      return JSON.parse(formationsJson);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    return [];
  }
};

/**
 * Fonction pour récupérer les sessions
 */
export const getSessions = async () => {
  try {
    if (process.env.NEXT_PUBLIC_USE_BLOCKCHAIN === 'true') {
      // Version blockchain - à implémenter avec des filtres de compte
      // Récupérer les sessions depuis le programme
      
      // Exemple simplifié pour le moment
      const sessionsJson = localStorage.getItem('alyraSign_sessions');
      
      if (!sessionsJson) return [];
      
      return JSON.parse(sessionsJson);
    } else {
      // Version simulation (localStorage)
      // Récupérer les sessions depuis le localStorage
      const sessionsJson = localStorage.getItem('alyraSign_sessions');
      
      if (!sessionsJson) return [];
      
      return JSON.parse(sessionsJson);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return [];
  }
};

/**
 * Crée une demande d'accès
 */
export const createAccessRequest = async (
  wallet: Wallet,
  connection: Connection,
  role: string,
  name: string,
  email: string,
  message?: string
): Promise<string> => {
  try {
    if (!wallet) {
      throw new Error("Portefeuille non fourni");
    }

    if (!wallet.publicKey) {
      throw new Error("Portefeuille non connecté");
    }

    if (!wallet.payer) {
      throw new Error("Portefeuille non initialisé correctement");
    }

    // Vérifier si une demande existe déjà
    const existingRequests = await getAccessRequests(wallet as unknown as AnchorWallet, connection);
    const existingRequest = existingRequests.find(req => req.walletAddress === wallet.publicKey.toString());
    
    if (existingRequest) {
      throw new Error("Une demande existe déjà pour cette adresse");
    }

    const program = new Program(IDL, new PublicKey(PROGRAM_ID), {
      connection,
      wallet: wallet as unknown as AnchorWallet
    });

    const [requestPda] = await findAccessRequestPDA(wallet.publicKey);

    // Créer la transaction
    const tx = await program.methods
      .requestAccess(role, name, email, message || "")
      .accounts({
        accessRequest: requestPda,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet.payer])
      .rpc();

    return tx;
  } catch (error) {
    console.error("Erreur lors de la création de la demande d'accès:", error);
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la création de la demande: ${error.message}`);
    }
    throw new Error("Une erreur inattendue est survenue");
  }
};

/**
 * Calcule l'adresse PDA pour une demande d'accès
 */
export const calculateRequestPDA = async (walletAddress: PublicKey): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(REQUEST_SEED), walletAddress.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Fonction pour approuver une demande d'accès
 */
export const approveAccessRequest = async (
  requestId: string, 
  wallet: any, 
  connection: Connection,
  selectedRole: string
): Promise<boolean> => {
  try {
    console.log("approveAccessRequest appelé avec:", { 
      requestId, 
      walletConnected: !!wallet,
      selectedRole 
    });
    
    if (!USE_BLOCKCHAIN) {
      // Version simulation (localStorage)
      const pendingRequestsJson = localStorage.getItem('alyraSign_pendingRequests');
      const processedRequestsJson = localStorage.getItem('alyraSign_processedRequests');
      
      if (!pendingRequestsJson || !processedRequestsJson) {
        throw new Error("Données non disponibles");
      }
      
      const pendingRequests = JSON.parse(pendingRequestsJson);
      const processedRequests = JSON.parse(processedRequestsJson);
      
      console.log("Demandes en attente avant traitement:", pendingRequests);
      console.log("Demandes traitées avant traitement:", processedRequests);
      
      // Trouver la demande à approuver
      const requestIndex = pendingRequests.findIndex((req: any) => req.id === requestId);
      if (requestIndex === -1) {
        throw new Error("Demande non trouvée");
      }
      
      const request = pendingRequests[requestIndex];
      console.log("Demande à approuver:", request);
      
      // Mettre à jour le statut et le rôle
      request.status = 'approved';
      request.requestedRole = selectedRole;
      request.processedAt = new Date().toISOString();
      
      // Déplacer la demande vers les demandes traitées
      processedRequests[requestId] = request;
      pendingRequests.splice(requestIndex, 1);
      
      console.log("Demandes en attente après traitement:", pendingRequests);
      console.log("Demandes traitées après traitement:", processedRequests);
      
      // Sauvegarder les modifications
      localStorage.setItem('alyraSign_pendingRequests', JSON.stringify(pendingRequests));
      localStorage.setItem('alyraSign_processedRequests', JSON.stringify(processedRequests));
      
      // Stocker l'information de reconnexion pour prévenir les boucles infinies
      localStorage.setItem('alyraSign_lastConnectedRole', selectedRole);
      
      return true;
    }

    const program = getProgram(wallet as AnchorWallet, connection);
    if (!program) {
      throw new Error("Programme non disponible");
    }

    // Récupérer le PDA de la demande
    const [storagePDA] = await findAccessStoragePDA();
    const requestIdNumber = parseInt(requestId, 10);
    const [requestPDA] = await findAccessRequestPDA(wallet.publicKey);
    
    // Approuver la demande avec le rôle sélectionné
    await (program.methods as any)
      .approveAccessRequest(selectedRole)
      .accounts({
        request: requestPDA,
        admin: wallet.publicKey,
      })
      .rpc();

    return true;
  } catch (error) {
    console.error("Erreur dans approveAccessRequest:", error);
    throw error;
  }
};

/**
 * Fonction pour rejeter une demande d'accès
 */
export const rejectAccessRequest = async (requestId: string, wallet: any, connection: Connection): Promise<boolean> => {
  try {
    console.log("rejectAccessRequest appelé avec:", { requestId, walletConnected: !!wallet });
    
    // Version simulation (localStorage)
    const pendingRequestsJson = localStorage.getItem('alyraSign_pendingRequests');
    const processedRequestsJson = localStorage.getItem('alyraSign_processedRequests');
    
    if (!pendingRequestsJson || !processedRequestsJson) {
      throw new Error("Données non disponibles");
    }
    
    const pendingRequests = JSON.parse(pendingRequestsJson);
    const processedRequests = JSON.parse(processedRequestsJson);
    
    // Trouver la demande à rejeter
    const requestIndex = pendingRequests.findIndex((req: any) => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error("Demande non trouvée");
    }
    
    const request = pendingRequests[requestIndex];
    
    // Mettre à jour le statut
    request.status = 'rejected';
    request.processedAt = new Date().toISOString();
    
    // Déplacer la demande vers les demandes traitées
    processedRequests[requestId] = request;
    pendingRequests.splice(requestIndex, 1);
    
    // Sauvegarder les modifications
    localStorage.setItem('alyraSign_pendingRequests', JSON.stringify(pendingRequests));
    localStorage.setItem('alyraSign_processedRequests', JSON.stringify(processedRequests));
    
    console.log("Demande rejetée avec succès:", request);
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors du rejet de la demande:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Une erreur est survenue lors du rejet');
    }
    return false;
  }
};

/**
 * Révoque les droits d'accès d'un utilisateur
 */
export const revokeAccess = async (requestId: string, wallet: any, connection: Connection): Promise<boolean> => {
  try {
    console.log('Révocation des droits pour la demande:', requestId);
    
    // Version simulation (localStorage)
    const processedRequestsJson = localStorage.getItem('alyraSign_processedRequests');
    
    if (!processedRequestsJson) {
      throw new Error("Données non disponibles");
    }
    
    const processedRequests = JSON.parse(processedRequestsJson);
    
    // Trouver la demande à révoquer
    const request = processedRequests[requestId];
    if (!request) {
      console.error('Demande non trouvée:', requestId);
      return false;
    }
    
    // Mettre à jour le statut de la demande
    request.status = 'rejected';
    request.processedAt = new Date().toISOString();
    
    // Sauvegarder les modifications
    localStorage.setItem('alyraSign_processedRequests', JSON.stringify(processedRequests));
    
    // Si c'était le dernier rôle connu, le supprimer
    const lastConnectedWallet = localStorage.getItem('alyraSign_lastConnectedWallet');
    if (lastConnectedWallet === request.walletAddress) {
      localStorage.removeItem('alyraSign_lastConnectedRole');
      localStorage.removeItem('alyraSign_lastConnectedWallet');
      localStorage.removeItem('alyraSign_onDashboard');
    }
    
    console.log('Droits révoqués avec succès pour la demande:', requestId);
    return true;
  } catch (error) {
    console.error('Erreur lors de la révocation des droits:', error);
    return false;
  }
};

/**
 * Initialise le compte de stockage des demandes d'accès
 */
export const initializeAccessStorage = async (wallet: any, connection: any) => {
  try {
    const program = getProgram(wallet as AnchorWallet, connection);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const [storagePda] = await findAccessStoragePDA();
    
    await (program.methods
      .initializeAccessStorage() as any)
      .accounts({
        admin: wallet.publicKey,
        accessStorage: storagePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'initialisation du stockage des accès:', error);
    return false;
  }
};

/**
 * Initialise le compte de stockage des formations
 */
export const initializeFormationStorage = async (wallet: any, connection: any) => {
  try {
    const program = getProgram(wallet as AnchorWallet, connection);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const [storagePda] = await findFormationStoragePDA();
    
    await (program.methods
      .initializeFormationStorage() as any)
      .accounts({
        admin: wallet.publicKey,
        formationStorage: storagePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'initialisation du stockage des formations:', error);
    return false;
  }
};

/**
 * Initialise le compte de stockage des sessions
 */
export const initializeSessionStorage = async (wallet: any, connection: any) => {
  try {
    const program = getProgram(wallet as AnchorWallet, connection);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const [storagePda] = await findSessionStoragePDA();
    
    await (program.methods
      .initializeSessionStorage() as any)
      .accounts({
        admin: wallet.publicKey,
        sessionStorage: storagePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'initialisation du stockage des sessions:', error);
    return false;
  }
};

/**
 * Trouve l'adresse PDA pour le stockage des présences
 */
export const findAttendanceStoragePDA = async (): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ATTENDANCE_STORAGE_SEED)],
    PROGRAM_ID
  );
};

/**
 * Calcule l'adresse PDA pour une présence
 */
export const calculateAttendancePDA = async (studentPubkey: PublicKey, sessionId: string): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ATTENDANCE_SEED), studentPubkey.toBuffer(), Buffer.from(sessionId)],
    PROGRAM_ID
  );
};

/**
 * Initialise le compte de stockage des présences
 */
export const initializeAttendanceStorage = async (wallet: any, connection: any) => {
  try {
    const program = getProgram(wallet as AnchorWallet, connection);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const [storagePda] = await findAttendanceStoragePDA();
    
    await (program.methods
      .initializeAttendanceStorage() as any)
      .accounts({
        admin: wallet.publicKey,
        attendanceStorage: storagePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'initialisation du stockage des présences:', error);
    return false;
  }
};

/**
 * Enregistre une présence (check-in)
 */
export const recordAttendance = async (sessionId: string, isPresent: boolean, note: string = "", wallet: any, connection: any) => {
  try {
    const program = getProgram(wallet as AnchorWallet, connection);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const [storagePda] = await findAttendanceStoragePDA();
    const [attendancePda] = await calculateAttendancePDA(wallet.publicKey, sessionId);
    
    await (program.methods
      .recordAttendance(
        sessionId,
        isPresent,
        note
      ) as any)
      .accounts({
        student: wallet.publicKey,
        attendanceStorage: storagePda,
        attendance: attendancePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'enregistrement de la présence:', error);
    return false;
  }
};

/**
 * Met à jour une présence (check-out)
 */
export const updateAttendance = async (sessionId: string, isPresent: boolean, note: string = "", wallet: any, connection: any) => {
  try {
    const program = getProgram(wallet as AnchorWallet, connection);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const [storagePda] = await findAttendanceStoragePDA();
    const [attendancePda] = await calculateAttendancePDA(wallet.publicKey, sessionId);
    
    await (program.methods
      .updateAttendance(isPresent, note) as any)
      .accounts({
        student: wallet.publicKey,
        attendanceStorage: storagePda,
        attendance: attendancePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    return true;
  } catch (error: unknown) {
    console.error('Erreur lors de la mise à jour de la présence:', error);
    return false;
  }
};

// Mise à jour de la fonction initializeAllStorage pour inclure l'initialisation des présences
export const initializeAllStorage = async (wallet: any, connection: any) => {
  try {
    const accessStorage = await initializeAccessStorage(wallet, connection);
    const formationStorage = await initializeFormationStorage(wallet, connection);
    const sessionStorage = await initializeSessionStorage(wallet, connection);
    const attendanceStorage = await initializeAttendanceStorage(wallet, connection);
    
    return accessStorage && formationStorage && sessionStorage && attendanceStorage;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des comptes de stockage:', error);
    toast.error('Erreur lors de l\'initialisation des comptes de stockage');
    return false;
  }
};

// Alias pour submitAccessRequest vers createAccessRequest
export const submitAccessRequest = createAccessRequest;

/**
 * Vérifie si un utilisateur a un rôle spécifique - version simulée
 */
export const checkUserRole = async (userPublicKey: string, role: string) => {
  try {
    const processedRequestsJson = localStorage.getItem('alyraSign_processedRequests');
    if (!processedRequestsJson) return false;
    
    const processedRequests = JSON.parse(processedRequestsJson) as Record<string, RequestData>;
    const userRequests = Object.values(processedRequests)
      .filter((req) => req.walletAddress === userPublicKey && req.requestedRole === role);
    
    return userRequests.length > 0;
  } catch (error: unknown) {
    console.error('Erreur lors de la vérification du rôle:', error);
    return false;
  }
};

/**
 * Récupère l'historique des présences d'un étudiant
 */
export const getStudentAttendances = async (studentPubkey: PublicKey, wallet: AnchorWallet, connection: Connection): Promise<AttendanceAccount[]> => {
  try {
    if (process.env.NEXT_PUBLIC_USE_BLOCKCHAIN === 'true') {
      const program = getProgram(wallet, connection);
      const attendances = await program.account.attendance.all([
        {
          memcmp: {
            offset: 8 + 8 + 8, // Après id et sessionId
            bytes: studentPubkey.toBase58()
          }
        }
      ]);
      
      return attendances.map(({ account }) => account as AttendanceAccount);
    } else {
      const attendancesJson = localStorage.getItem('alyraSign_attendances');
      const allAttendances = attendancesJson ? JSON.parse(attendancesJson) : [];
      const studentAddress = studentPubkey.toString();
      
      return allAttendances
        .filter((a: any) => a.student === studentAddress)
        .map((a: any) => ({
          ...a,
          student: new PublicKey(a.student)
        }));
    }
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des présences:', error);
    toast.error('Erreur lors de la récupération des présences');
    return [];
  }
};

/**
 * Trouve l'adresse PDA pour une formation spécifique
 */
export const findFormationPDA = async (trainer: PublicKey): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FORMATION_SEED), trainer.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Trouve l'adresse PDA pour une session spécifique
 */
export const findSessionPDA = async (formation: PublicKey): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SESSION_SEED), formation.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Trouve l'adresse PDA pour une présence spécifique
 */
export const findAttendancePDA = async (session: PublicKey, student: PublicKey): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ATTENDANCE_SEED), session.toBuffer(), student.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Trouve l'adresse PDA pour une inscription spécifique
 */
export const findEnrollmentPDA = async (formation: PublicKey, student: PublicKey): Promise<PDAResult> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ENROLLMENT_SEED), formation.toBuffer(), student.toBuffer()],
    PROGRAM_ID
  );
};

// Exporter uniquement l'IDL
export { IDL } from './idl/alyrasign';

export const getWaitlistEntries = async (
  formationId: string,
  wallet: AnchorWallet,
  connection: Connection
): Promise<WaitlistEntry[]> => {
  try {
    const program = getProgram(wallet, connection);
    const formationPubkey = new PublicKey(formationId);
    const entries = await program.account.waitlistEntry.all([
      {
        memcmp: {
          offset: 8,
          bytes: formationPubkey.toBase58(),
        },
      },
    ]);

    return entries.map((entry: { publicKey: PublicKey; account: any }) => ({
      id: entry.publicKey.toString(),
      student: entry.account.student.toString(),
      formation: entry.account.formation.toString(),
      position: entry.account.position,
      status: entry.account.status as WaitlistStatus,
      timestamp: entry.account.timestamp.toNumber(),
      createdAt: entry.account.createdAt.toNumber(),
      updatedAt: entry.account.updatedAt.toNumber(),
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste d\'attente:', error);
    throw error;
  }
};

export const joinWaitlist = async (
  formationId: string,
  wallet: AnchorWallet,
  connection: Connection
): Promise<string> => {
  try {
    const program = getProgram(wallet, connection);
    const provider = getProvider(wallet, connection);
    const formationPubkey = new PublicKey(formationId);
    const [waitlistEntry] = await PublicKey.findProgramAddress(
      [
        Buffer.from('waitlist'),
        formationPubkey.toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .joinWaitlist()
      .accounts({
        formation: formationPubkey,
        waitlistEntry,
        student: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la liste d\'attente:', error);
    throw error;
  }
};

export const promoteFromWaitlist = async (
  formationId: string,
  entryId: string,
  wallet: AnchorWallet,
  connection: Connection
): Promise<string> => {
  try {
    const program = getProgram(wallet, connection);
    const formationPubkey = new PublicKey(formationId);
    const waitlistEntryPubkey = new PublicKey(entryId);
    const [enrollment] = await PublicKey.findProgramAddress(
      [
        Buffer.from('enrollment'),
        formationPubkey.toBuffer(),
        waitlistEntryPubkey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .promoteFromWaitlist()
      .accounts({
        formation: formationPubkey,
        waitlistEntry: waitlistEntryPubkey,
        enrollment,
        trainer: wallet.publicKey,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error('Erreur lors de la promotion de la liste d\'attente:', error);
    throw error;
  }
};

/**
 * Initialise le compte de stockage principal du programme
 */
export async function initializeProgramStorage(
  wallet: ExtendedWalletContextState,
  connection: Connection
): Promise<void> {
  try {
    if (!wallet.connected || !wallet.wallet || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const walletAdapter: AnchorWallet = {
      publicKey: wallet.publicKey,
      signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T) => {
        if (!wallet.signTransaction) {
          throw new Error('Wallet does not support transaction signing');
        }
        return wallet.signTransaction(tx);
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]) => {
        if (!wallet.signAllTransactions) {
          throw new Error('Wallet does not support signing all transactions');
        }
        return wallet.signAllTransactions(txs);
      }
    };

    const provider = getProvider(walletAdapter, connection);
    const program = getProgram(walletAdapter, connection);

    // Trouver le PDA pour le stockage
    const [storagePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('storage')],
      PROGRAM_ID
    );

    // Appeler l'instruction initialize du programme
    const tx = await program.methods
      .initialize()
      .accounts({
        admin: wallet.publicKey,
        storage: storagePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Attendre la confirmation
    const confirmation = await connection.confirmTransaction(tx, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(`Erreur lors de la confirmation: ${JSON.stringify(confirmation.value.err)}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

/**
 * Obtient l'adresse du PDA de stockage
 */
export const getStoragePda = async () => {
  const [storagePda] = await PublicKey.findProgramAddress(
    [Buffer.from('storage')],
    PROGRAM_ID
  );
  return storagePda;
};

/**
 * Vérifie l'état du compte de stockage
 */
export const checkStorageAccount = async (connection: any) => {
  try {
    const storagePda = await getStoragePda();
    const accountInfo = await connection.getAccountInfo(storagePda);
    
    if (!accountInfo) {
      console.log('Le compte de stockage n\'existe pas encore');
      return false;
    }
    
    console.log('Le compte de stockage existe et contient des données');
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du compte de stockage:', error);
    return false;
  }
};

export async function checkProgramState(connection: Connection): Promise<{
  programExists: boolean;
  storageExists: boolean;
  error?: string;
}> {
  try {
    // Vérifier le programme
    const programInfo = await connection.getAccountInfo(PROGRAM_ID);
    if (!programInfo) {
      return {
        programExists: false,
        storageExists: false,
        error: 'Programme non déployé'
      };
    }

    // Vérifier le storage
    const [storagePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('storage')],
      PROGRAM_ID
    );
    const storageInfo = await connection.getAccountInfo(storagePda);

    return {
      programExists: true,
      storageExists: !!storageInfo,
      error: !storageInfo ? 'Storage non initialisé' : undefined
    };
  } catch (error) {
    console.error('Erreur vérification:', error);
    return {
      programExists: false,
      storageExists: false,
      error: 'Erreur de vérification'
    };
  }
}

export async function updateAdminAddress(
  connection: Connection,
  wallet: WalletContextState,
  newAdminAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Début updateAdminAddress');
    console.log('Wallet:', wallet);
    console.log('Connection:', connection);
    console.log('Nouvelle adresse admin:', newAdminAddress);

    if (!wallet.publicKey) {
      throw new Error('Wallet non connecté');
    }

    // Vérifier l'état des comptes
    const state = await checkProgramState(connection);
    console.log('État des comptes:', state);

    if (!state.programExists) {
      throw new Error('Le programme n\'est pas déployé');
    }

    if (!state.storageExists) {
      throw new Error('Le compte de stockage n\'est pas initialisé');
    }

    // Créer la transaction
    const transaction = new Transaction();
    
    // Ajouter l'instruction d'update
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: new PublicKey(newAdminAddress), isSigner: false, isWritable: false }
      ],
      programId: PROGRAM_ID,
      data: Buffer.from([1]) // Instruction pour update admin
    });

    transaction.add(instruction);

    // Envoyer la transaction
    const signature = await wallet.sendTransaction(transaction, connection, {
      signers: [],
      preflightCommitment: 'confirmed',
      maxRetries: 3
    });

    console.log('Transaction envoyée:', signature);

    // Attendre la confirmation
    const confirmation = await connection.confirmTransaction(signature);
    console.log('Confirmation:', confirmation);

    if (confirmation.value.err) {
      throw new Error('Erreur de confirmation');
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur updateAdminAddress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

export const getProgramInstance = async (): Promise<AlyraSignProgram> => {
  const wallet = await getWallet();
  const connection = await getConnection();
  return getProgram(wallet as AnchorWallet, connection);
};

export const getProgramAccounts = async (): Promise<Array<{ pubkey: PublicKey; account: any }>> => {
  const programInstance = await getProgramInstance();
  return programInstance.account.all();
};

export const getProgramAccountsByOwner = async (owner: PublicKey): Promise<Array<{ pubkey: PublicKey; account: any }>> => {
  const programInstance = await getProgramInstance();
  return programInstance.account.all([{ memcmp: { offset: 8, bytes: owner.toBase58() } }]);
};

export const getProgramAccountsByOwnerAndType = async (owner: PublicKey, type: string): Promise<Array<{ pubkey: PublicKey; account: any }>> => {
  const programInstance = await getProgramInstance();
  return programInstance.account.all([
    { memcmp: { offset: 8, bytes: owner.toBase58() } },
    { memcmp: { offset: 40, bytes: type } }
  ]);
}; 