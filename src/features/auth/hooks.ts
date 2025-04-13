import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { User, AccessRequest, AuthState } from './types';
import { createAccessRequest, getAccessRequests, approveAccessRequest } from '../../lib/solana';
import { Connection } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export const useAuth = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (!publicKey || !wallet) {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
        return;
      }

      try {
        // Vérifier si l'utilisateur est l'administrateur
        if (publicKey.toString() === ADMIN_WALLET) {
          setState({
            user: {
              id: 'admin',
              publicKey: publicKey.toString(),
              role: 'admin'
            },
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return;
        }

        // Vérifier si l'utilisateur a une demande d'accès approuvée
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
        const anchorWallet = wallet as unknown as AnchorWallet;
        const requests = await getAccessRequests(anchorWallet, connection);
        const userRequest = requests.find(req => req.walletAddress === publicKey.toString());
        
        if (userRequest && userRequest.status === 'approved') {
          setState({
            user: {
              id: userRequest.id,
              publicKey: publicKey.toString(),
              role: userRequest.requestedRole as 'student' | 'trainer' | 'admin'
            },
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        }));
      }
    };

    checkAuth();
  }, [publicKey, connected, wallet]);

  const requestAccess = async (role: string, name: string, email: string, message: string) => {
    if (!publicKey || !wallet) {
      throw new Error('Wallet non connecté');
    }

    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
      const anchorWallet = wallet as unknown as AnchorWallet;
      await createAccessRequest(anchorWallet, connection, role, name, email, message);
      setState(prev => ({ ...prev, isLoading: true }));
      // Recharger l'état après la demande
      const requests = await getAccessRequests(anchorWallet, connection);
      const userRequest = requests.find(req => req.walletAddress === publicKey.toString());
      
      if (userRequest && userRequest.status === 'approved') {
        setState({
          user: {
            id: userRequest.id,
            publicKey: publicKey.toString(),
            role: userRequest.requestedRole as 'student' | 'trainer' | 'admin'
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande d\'accès:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }));
      return false;
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  return {
    ...state,
    requestAccess,
    logout
  };
}; 