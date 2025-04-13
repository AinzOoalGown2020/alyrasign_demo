import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { 
  initializeProgramStorage, 
  checkStorageAccount, 
  checkProgramState,
  initializeAccessStorage,
  initializeFormationStorage,
  initializeSessionStorage,
  initializeAttendanceStorage,
  initializeAllStorage,
  findAccessStoragePDA,
  findFormationStoragePDA,
  findSessionStoragePDA,
  findAttendanceStoragePDA,
  updateAdminAddress
} from '../../lib/solana';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { toast } from 'react-hot-toast';
import { PublicKey } from '@solana/web3.js';

// Types pour les états des comptes
interface AccountState {
  exists: boolean;
  address: string;
  loading: boolean;
  error?: string;
  balance?: number;
}

export default function InitializePage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  
  // États généraux
  const [status, setStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [helpMessage, setHelpMessage] = useState<string>('');
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  // États des comptes spécifiques
  const [programState, setProgramState] = useState<{
    programExists: boolean;
    storageExists: boolean;
    error?: string;
  }>({
    programExists: false,
    storageExists: false
  });
  
  const [storageAccount, setStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false,
    balance: 0
  });
  
  const [accessStorageAccount, setAccessStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false,
    balance: 0
  });
  
  const [formationStorageAccount, setFormationStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false,
    balance: 0
  });
  
  const [sessionStorageAccount, setSessionStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false,
    balance: 0
  });
  
  const [attendanceStorageAccount, setAttendanceStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false,
    balance: 0
  });

  // Vérifier le wallet et l'environnement au chargement
  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (wallet?.publicKey) {
          console.log('Wallet connecté avec la clé publique:', wallet.publicKey.toString());
          console.log('État du wallet:', {
            publicKey: wallet.publicKey.toString(),
            connected: wallet.connected,
            connecting: wallet.connecting,
            disconnecting: wallet.disconnecting,
            wallet: wallet.wallet?.adapter.name
          });
          setStatus(`Wallet connecté: ${wallet.publicKey.toString()}`);
          
          // Vérifier si l'utilisateur est admin
          const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
          const isAdminAddress = wallet.publicKey.toString() === adminAddress;
          setIsAdmin(isAdminAddress);
          
          if (isAdminAddress) {
            setHelpMessage('Vous êtes connecté en tant qu\'administrateur. Vous pouvez initialiser le programme.');
          } else {
            setHelpMessage('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme.');
          }
          
          // Vérifier le solde du wallet
          try {
            const balance = await connection.getBalance(wallet.publicKey);
            setWalletBalance(balance / 1e9); // Convertir en SOL
            console.log('Solde du wallet:', balance / 1e9, 'SOL');
          } catch (error) {
            console.error('Erreur lors de la vérification du solde:', error);
          }
          
          // Vérifier la connexion au réseau
          try {
            const version = await connection.getVersion();
            setNetworkInfo(`Réseau: ${connection.rpcEndpoint} (Version: ${version['solana-core']})`);
            console.log('Version de la connexion:', version);
          } catch (error) {
            console.error('Erreur lors de la vérification de la connexion:', error);
            setNetworkInfo(`Réseau: ${connection.rpcEndpoint} (Erreur de connexion)`);
          }
          
          // Vérifier l'état initial
          await checkInitializationStatus();
        } else {
          console.log('Wallet non connecté');
          setStatus('Veuillez connecter votre wallet');
          setIsAdmin(false);
          setHelpMessage('Connectez votre wallet pour accéder aux fonctionnalités d\'initialisation.');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du wallet:', error);
        setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        setIsAdmin(false);
        setHelpMessage('Une erreur est survenue lors de la vérification du wallet. Veuillez réessayer.');
      }
    };

    checkWallet();
  }, [wallet, connection]);

  // Vérifier l'état d'initialisation
  const checkInitializationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Vérification du compte de storage...');
      console.log('Connection:', connection?.rpcEndpoint);
      
      // Vérifier la connexion à la blockchain
      try {
        const version = await connection.getVersion();
        console.log('Version de la connexion:', version);
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion à la blockchain:', error);
        throw new Error('Impossible de se connecter à la blockchain');
      }
      
      // Vérifier l'état du programme et du storage
      const state = await checkProgramState(connection);
      console.log('État du programme:', state);
      setProgramState(state);
      
      const isInitialized = state.programExists && state.storageExists;
      setIsInitialized(isInitialized);
      setStatus(isInitialized ? 'Le compte est initialisé' : 'Le compte n\'est pas initialisé');
      
      if (isInitialized) {
        setHelpMessage('Le programme est déjà initialisé. Vous pouvez accéder à l\'administration blockchain.');
      } else {
        setHelpMessage('Le programme n\'est pas encore initialisé. Utilisez le bouton "Initialiser le compte" pour procéder à l\'initialisation.');
      }
      
      // Vérifier les comptes de stockage spécifiques
      await checkStorageAccounts();
      
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de la vérification de l\'état du programme. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Vérifier les comptes de stockage spécifiques
  const checkStorageAccounts = async () => {
    try {
      // Vérifier le compte de stockage principal
      setStorageAccount(prev => ({ ...prev, loading: true }));
      const [storagePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('storage')],
        new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || '')
      );
      const storageInfo = await connection.getAccountInfo(storagePda);
      const storageBalance = await connection.getBalance(storagePda);
      setStorageAccount({
        exists: !!storageInfo,
        address: storagePda.toString(),
        loading: false,
        balance: storageBalance / 1e9
      });
      
      // Vérifier le compte de stockage des demandes d'accès
      setAccessStorageAccount(prev => ({ ...prev, loading: true }));
      const [accessStoragePda] = await findAccessStoragePDA();
      const accessStorageInfo = await connection.getAccountInfo(accessStoragePda);
      const accessBalance = await connection.getBalance(accessStoragePda);
      setAccessStorageAccount({
        exists: !!accessStorageInfo,
        address: accessStoragePda.toString(),
        loading: false,
        balance: accessBalance / 1e9
      });
      
      // Vérifier le compte de stockage des formations
      setFormationStorageAccount(prev => ({ ...prev, loading: true }));
      const [formationStoragePda] = await findFormationStoragePDA();
      const formationStorageInfo = await connection.getAccountInfo(formationStoragePda);
      const formationBalance = await connection.getBalance(formationStoragePda);
      setFormationStorageAccount({
        exists: !!formationStorageInfo,
        address: formationStoragePda.toString(),
        loading: false,
        balance: formationBalance / 1e9
      });
      
      // Vérifier le compte de stockage des sessions
      setSessionStorageAccount(prev => ({ ...prev, loading: true }));
      const [sessionStoragePda] = await findSessionStoragePDA();
      const sessionStorageInfo = await connection.getAccountInfo(sessionStoragePda);
      const sessionBalance = await connection.getBalance(sessionStoragePda);
      setSessionStorageAccount({
        exists: !!sessionStorageInfo,
        address: sessionStoragePda.toString(),
        loading: false,
        balance: sessionBalance / 1e9
      });
      
      // Vérifier le compte de stockage des présences
      setAttendanceStorageAccount(prev => ({ ...prev, loading: true }));
      const [attendanceStoragePda] = await findAttendanceStoragePDA();
      const attendanceStorageInfo = await connection.getAccountInfo(attendanceStoragePda);
      const attendanceBalance = await connection.getBalance(attendanceStoragePda);
      setAttendanceStorageAccount({
        exists: !!attendanceStorageInfo,
        address: attendanceStoragePda.toString(),
        loading: false,
        balance: attendanceBalance / 1e9
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification des comptes de stockage:', error);
      setError(`Erreur lors de la vérification des comptes: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Initialiser le compte de stockage principal
  const handleInitialize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Initialisation en cours...');
      console.log('Tentative d\'initialisation avec:', {
        wallet: wallet ? {
          publicKey: wallet.publicKey?.toString()
        } : 'non disponible',
        connection: connection ? 'disponible' : 'non disponible'
      });

      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }

      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme');
      }

      // Vérifier la connexion à la blockchain
      try {
        const version = await connection.getVersion();
        console.log('Version de la connexion:', version);
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion à la blockchain:', error);
        throw new Error('Impossible de se connecter à la blockchain');
      }

      try {
        const success = await initializeProgramStorage(wallet, connection);
        if (success) {
          setStatus('Compte initialisé avec succès');
          setIsInitialized(true);
          setHelpMessage('Le programme a été initialisé avec succès. Vous pouvez maintenant accéder à l\'administration blockchain.');
          toast.success('Programme initialisé avec succès');
          
          // Vérifier l'état après l'initialisation
          await checkInitializationStatus();
        } else {
          setStatus('Échec de l\'initialisation');
          setError('L\'initialisation a échoué sans erreur spécifique');
          setHelpMessage('L\'initialisation a échoué. Veuillez vérifier les logs pour plus de détails.');
          toast.error('Échec de l\'initialisation');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        
        // Afficher des messages d'erreur plus détaillés
        if (error instanceof Error) {
          if (error.message.includes('User rejected')) {
            setError('Transaction rejetée par l\'utilisateur. Veuillez accepter la transaction dans votre wallet.');
            setHelpMessage('Vous avez rejeté la transaction. Veuillez accepter la transaction dans votre wallet pour initialiser le programme.');
          } else if (error.message.includes('insufficient funds')) {
            setError('Solde insuffisant pour payer les frais de transaction. Veuillez avoir au moins 0.1 SOL dans votre wallet.');
            setHelpMessage('Votre wallet n\'a pas assez de SOL pour payer les frais de transaction. Veuillez ajouter des SOL à votre wallet.');
          } else if (error.message.includes('network')) {
            setError('Erreur de réseau. Veuillez vérifier votre connexion et réessayer.');
            setHelpMessage('Une erreur de réseau est survenue. Veuillez vérifier votre connexion et réessayer.');
          } else if (error.message.includes('Unexpected error')) {
            setError('Erreur inattendue lors de l\'envoi de la transaction. Essayez de déconnecter et reconnecter votre wallet, puis réessayez.');
            setHelpMessage('Une erreur inattendue est survenue. Essayez de déconnecter et reconnecter votre wallet, puis réessayez.');
          } else {
            setError(`Erreur lors de l'initialisation: ${error.message}`);
            setHelpMessage(`Une erreur est survenue: ${error.message}. Veuillez vérifier les logs pour plus de détails.`);
          }
        } else {
          setError('Erreur inconnue lors de l\'initialisation');
          setHelpMessage('Une erreur inconnue est survenue. Veuillez vérifier les logs pour plus de détails.');
        }
        
        setStatus('Échec de l\'initialisation');
        toast.error('Échec de l\'initialisation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de l\'initialisation. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialiser tous les comptes de stockage
  const handleInitializeAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Initialisation de tous les comptes en cours...');
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }
      
      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme');
      }
      
      try {
        const success = await initializeAllStorage(wallet, connection);
        if (success) {
          setStatus('Tous les comptes ont été initialisés avec succès');
          setIsInitialized(true);
          setHelpMessage('Tous les comptes ont été initialisés avec succès. Vous pouvez maintenant accéder à l\'administration blockchain.');
          toast.success('Tous les comptes initialisés avec succès');
          
          // Vérifier l'état après l'initialisation
          await checkInitializationStatus();
        } else {
          setStatus('Échec de l\'initialisation de tous les comptes');
          setError('L\'initialisation a échoué sans erreur spécifique');
          setHelpMessage('L\'initialisation a échoué. Veuillez vérifier les logs pour plus de détails.');
          toast.error('Échec de l\'initialisation de tous les comptes');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de tous les comptes:', error);
        setError(`Erreur lors de l'initialisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setHelpMessage(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
        setStatus('Échec de l\'initialisation de tous les comptes');
        toast.error('Échec de l\'initialisation de tous les comptes');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de tous les comptes:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de l\'initialisation. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialiser un compte de stockage spécifique
  const handleInitializeSpecific = async (type: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus(`Initialisation du compte ${type} en cours...`);
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }
      
      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme');
      }
      
      let success = false;
      
      try {
        switch (type) {
          case 'access':
            success = await initializeAccessStorage(wallet, connection);
            break;
          case 'formation':
            success = await initializeFormationStorage(wallet, connection);
            break;
          case 'session':
            success = await initializeSessionStorage(wallet, connection);
            break;
          case 'attendance':
            success = await initializeAttendanceStorage(wallet, connection);
            break;
          default:
            throw new Error(`Type de compte inconnu: ${type}`);
        }
        
        if (success) {
          setStatus(`Compte ${type} initialisé avec succès`);
          setHelpMessage(`Le compte ${type} a été initialisé avec succès.`);
          toast.success(`Compte ${type} initialisé avec succès`);
          
          // Vérifier l'état après l'initialisation
          await checkInitializationStatus();
        } else {
          setStatus(`Échec de l'initialisation du compte ${type}`);
          setError('L\'initialisation a échoué sans erreur spécifique');
          setHelpMessage(`L'initialisation du compte ${type} a échoué. Veuillez vérifier les logs pour plus de détails.`);
          toast.error(`Échec de l'initialisation du compte ${type}`);
        }
      } catch (error) {
        console.error(`Erreur lors de l'initialisation du compte ${type}:`, error);
        setError(`Erreur lors de l'initialisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setHelpMessage(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
        setStatus(`Échec de l'initialisation du compte ${type}`);
        toast.error(`Échec de l'initialisation du compte ${type}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'initialisation du compte ${type}:`, error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de l\'initialisation. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour l'adresse admin
  const handleUpdateAdmin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Mise à jour de l\'adresse admin en cours...');
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }
      
      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour mettre à jour l\'adresse admin');
      }
      
      try {
        const result = await updateAdminAddress(connection, wallet, wallet.publicKey.toString());
        if (result.success) {
          setStatus('Adresse admin mise à jour avec succès');
          setHelpMessage('L\'adresse admin a été mise à jour avec succès.');
          toast.success('Adresse admin mise à jour avec succès');
        } else {
          setStatus('Échec de la mise à jour de l\'adresse admin');
          setError(result.error || 'Erreur inconnue');
          setHelpMessage(`L'erreur est: ${result.error || 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
          toast.error('Échec de la mise à jour de l\'adresse admin');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'adresse admin:', error);
        setError(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setHelpMessage(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
        setStatus('Échec de la mise à jour de l\'adresse admin');
        toast.error('Échec de la mise à jour de l\'adresse admin');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse admin:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de la mise à jour. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">Tableau de Bord d'Initialisation</h1>
          
          {/* Informations générales */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
            <h2 className="text-xl font-semibold mb-4">Informations Générales</h2>
            <div className="mb-4">
              <p><span className="font-bold">État du wallet:</span> {wallet ? 'Connecté' : 'Déconnecté'}</p>
              <p><span className="font-bold">Adresse:</span> {wallet?.publicKey?.toString() || 'Non connecté'}</p>
              <p><span className="font-bold">Rôle:</span> {isAdmin ? 'Administrateur' : 'Utilisateur standard'}</p>
              <p><span className="font-bold">Solde:</span> {walletBalance.toFixed(4)} SOL</p>
              <p><span className="font-bold">Réseau:</span> {networkInfo}</p>
              <p><span className="font-bold">État:</span> {status}</p>
              <p><span className="font-bold">Compte initialisé:</span> {isInitialized ? 'Oui' : 'Non'}</p>
              {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                  <p className="font-bold">Erreur:</p>
                  <p>{error}</p>
                </div>
              )}
              {helpMessage && (
                <div className="mt-2 p-2 bg-blue-100 text-blue-700 rounded">
                  <p className="font-bold">Aide:</p>
                  <p>{helpMessage}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={checkInitializationStatus}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!wallet || !wallet.publicKey || isLoading}
              >
                {isLoading ? 'Vérification en cours...' : 'Vérifier l\'état'}
              </Button>
              
              {isInitialized && (
                <Button
                  onClick={() => router.push('/admin/blockchain')}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Accéder à l'administration blockchain
                </Button>
              )}
            </div>
          </div>
          
          {/* État du programme */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
            <h2 className="text-xl font-semibold mb-4">État du Programme</h2>
            <div className="mb-4">
              <p><span className="font-bold">Programme déployé:</span> {programState.programExists ? 'Oui' : 'Non'}</p>
              <p><span className="font-bold">Storage initialisé:</span> {programState.storageExists ? 'Oui' : 'Non'}</p>
              <p><span className="font-bold">Compte principal:</span> {storageAccount.address || 'Non disponible'}</p>
              {programState.error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                  <p className="font-bold">Erreur:</p>
                  <p>{programState.error}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {isAdmin && !programState.storageExists && (
                <Button
                  onClick={handleInitialize}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || programState.storageExists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte principal'}
                </Button>
              )}
            </div>
          </div>
          
          {/* État des comptes de stockage */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
            <h2 className="text-xl font-semibold mb-4">État des Comptes de Stockage</h2>
            
            {/* Compte de stockage principal */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage Principal</h3>
              <p><span className="font-bold">État:</span> {storageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {storageAccount.address}</p>
              <p><span className="font-bold">Solde:</span> {storageAccount.balance?.toFixed(4)} SOL</p>
              {isAdmin && !storageAccount.exists && (
                <Button
                  onClick={handleInitialize}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || storageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des demandes d'accès */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Demandes d'Accès</h3>
              <p><span className="font-bold">État:</span> {accessStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {accessStorageAccount.address}</p>
              <p><span className="font-bold">Solde:</span> {accessStorageAccount.balance?.toFixed(4)} SOL</p>
              {isAdmin && !accessStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('access')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || accessStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des demandes d\'accès'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des formations */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Formations</h3>
              <p><span className="font-bold">État:</span> {formationStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {formationStorageAccount.address}</p>
              <p><span className="font-bold">Solde:</span> {formationStorageAccount.balance?.toFixed(4)} SOL</p>
              {isAdmin && !formationStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('formation')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || formationStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des formations'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des sessions */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Sessions</h3>
              <p><span className="font-bold">État:</span> {sessionStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {sessionStorageAccount.address}</p>
              <p><span className="font-bold">Solde:</span> {sessionStorageAccount.balance?.toFixed(4)} SOL</p>
              {isAdmin && !sessionStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('session')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || sessionStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des sessions'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des présences */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Présences</h3>
              <p><span className="font-bold">État:</span> {attendanceStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {attendanceStorageAccount.address}</p>
              <p><span className="font-bold">Solde:</span> {attendanceStorageAccount.balance?.toFixed(4)} SOL</p>
              {isAdmin && !attendanceStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('attendance')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || attendanceStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des présences'}
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {isAdmin && (
                <Button
                  onClick={handleInitializeAll}
                  className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser tous les comptes'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Configuration de l'admin */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
            <h2 className="text-xl font-semibold mb-4">Configuration de l'Admin</h2>
            <div className="mb-4">
              <p><span className="font-bold">Adresse admin actuelle:</span> {process.env.NEXT_PUBLIC_ADMIN_WALLET || 'Non définie'}</p>
              <p><span className="font-bold">Adresse du wallet connecté:</span> {wallet?.publicKey?.toString() || 'Non connecté'}</p>
              <p><span className="font-bold">Correspondance:</span> {wallet?.publicKey?.toString() === process.env.NEXT_PUBLIC_ADMIN_WALLET ? 'Oui' : 'Non'}</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {isAdmin && (
                <Button
                  onClick={handleUpdateAdmin}
                  className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || wallet?.publicKey?.toString() === process.env.NEXT_PUBLIC_ADMIN_WALLET}
                >
                  {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour l\'adresse admin'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 