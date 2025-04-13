import React from 'react';
import { useAuth } from '../hooks';
import { useWallet } from '@solana/wallet-adapter-react';

export const AuthStatus: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { connected, publicKey } = useWallet();

  if (isLoading) {
    return (
      <div className="text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="text-center text-gray-500">
        Connectez votre wallet pour continuer
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="text-center text-green-500">
        Connecté en tant que {user.role}
        <br />
        Wallet : {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
      </div>
    );
  }

  return (
    <div className="text-center text-yellow-500">
      Wallet connecté : {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
      <br />
      <span className="text-sm">
        Vous n'avez pas encore d'accès. Veuillez soumettre une demande d'accès.
      </span>
    </div>
  );
}; 