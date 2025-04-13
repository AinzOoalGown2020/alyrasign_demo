import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

type Network = 'mainnet-beta' | 'devnet';

interface NetworkContextType {
  network: Network;
  setNetwork: (network: Network) => void;
  connection: Connection;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [network, setNetwork] = useState<Network>('devnet');
  const [connection, setConnection] = useState<Connection>(
    new Connection(clusterApiUrl('devnet'))
  );

  useEffect(() => {
    setConnection(new Connection(clusterApiUrl(network)));
  }, [network]);

  return (
    <NetworkContext.Provider value={{ network, setNetwork, connection }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}; 