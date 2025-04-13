import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { AutoConnectProvider } from './AutoConnectProvider';
import { notify } from "../utils/notifications";
import { NetworkConfigurationProvider, useNetworkConfiguration } from './NetworkConfigurationProvider';
import dynamic from "next/dynamic";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { networkConfiguration } = useNetworkConfiguration();
    const network = networkConfiguration as WalletAdapterNetwork;
    const endpoint = useMemo(() => clusterApiUrl(networkConfiguration as WalletAdapterNetwork), [networkConfiguration]);

    console.log("Réseau configuré:", network);
    console.log("Endpoint:", endpoint);

    // Utiliser uniquement les adaptateurs standards
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter({ network }),
            new SolflareWalletAdapter({ network })
        ],
        [network]
    );

    const onError = useCallback(
        (error: WalletError) => {
            notify({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
            console.error("Erreur de wallet:", error);
        },
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider 
                wallets={wallets} 
                onError={onError} 
                autoConnect={true}
                localStorageKey="walletName"
            >
                <ReactUIWalletModalProviderDynamic>
                    {children}
                </ReactUIWalletModalProviderDynamic>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const WalletContextProviderDynamic = dynamic(
    async () => WalletContextProvider,
    { ssr: false }
);

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <NetworkConfigurationProvider>
            <WalletContextProviderDynamic>
                {children}
            </WalletContextProviderDynamic>
        </NetworkConfigurationProvider>
    );
};
