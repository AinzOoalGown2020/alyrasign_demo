import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface SolanaContextType {
  balance: number;
  refreshBalance: () => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};

interface SolanaProviderProps {
  children: ReactNode;
  connection: Connection;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children, connection }) => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  const refreshBalance = async () => {
    if (!publicKey) return;
    
    try {
      const balance = await connection.getBalance(publicKey, 'confirmed');
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (e) {
      console.error('Error getting balance:', e);
    }
  };

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
      
      // Set up an interval to refresh the balance
      const intervalId = setInterval(refreshBalance, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [publicKey, connection]);

  return (
    <SolanaContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </SolanaContext.Provider>
  );
}; 