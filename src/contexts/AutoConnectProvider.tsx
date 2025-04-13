import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';

export interface AutoConnectContextState {
    autoConnect: boolean;
    setAutoConnect(autoConnect: boolean): void;
}

const AutoConnectContext = createContext<AutoConnectContextState>({} as AutoConnectContextState);

export const useAutoConnect = () => useContext(AutoConnectContext);

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { select, wallet, connect, connected, connecting } = useWallet();
    const [autoConnect, setAutoConnect] = useState<boolean>(() => {
        const saved = localStorage.getItem('autoConnect');
        return saved ? saved === 'true' : true;
    });

    useEffect(() => {
        // Vérifier si un wallet est déjà connecté
        if (connected) {
            console.log('Wallet déjà connecté');
            return;
        }

        // Vérifier si un wallet est en cours de connexion
        if (connecting) {
            console.log('Connexion en cours...');
            return;
        }

        // Récupérer le dernier wallet utilisé depuis le localStorage
        const lastWallet = localStorage.getItem('walletName');
        
        if (lastWallet) {
            console.log('Tentative de connexion automatique avec:', lastWallet);
            try {
                // Sélectionner le wallet
                select(lastWallet as WalletName);
                
                // Se connecter après un court délai pour s'assurer que le wallet est prêt
                setTimeout(() => {
                    if (!connected && !connecting) {
                        connect().catch(err => {
                            console.log('Erreur lors de la connexion automatique:', err.message);
                        });
                    }
                }, 500);
            } catch (error) {
                console.error('Erreur lors de la sélection du wallet:', error);
            }
        }
    }, [connected, connecting, select, connect]);

    const handleSetAutoConnect = (value: boolean) => {
        setAutoConnect(value);
        localStorage.setItem('autoConnect', value.toString());
    };

    useEffect(() => {
        if (autoConnect && !connected && !connecting) {
            console.log('Tentative de connexion automatique...');
            connect().catch((error) => {
                console.error('Erreur lors de la connexion automatique:', error);
            });
        }
    }, [autoConnect, connected, connecting, connect]);

    return (
        <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect: handleSetAutoConnect }}>
            {children}
        </AutoConnectContext.Provider>
    );
};
