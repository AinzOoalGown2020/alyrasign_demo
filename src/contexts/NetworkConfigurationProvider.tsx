import { createContext, FC, ReactNode, useContext, useState, useEffect } from 'react';

export interface NetworkConfigurationState {
    networkConfiguration: string;
    setNetworkConfiguration(networkConfiguration: string): void;
}

export const NetworkConfigurationContext = createContext<NetworkConfigurationState>({} as NetworkConfigurationState);

export function useNetworkConfiguration(): NetworkConfigurationState {
    return useContext(NetworkConfigurationContext);
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [networkConfiguration, setNetworkConfiguration] = useState<string>("devnet");

    useEffect(() => {
        const savedNetwork = localStorage.getItem("network");
        if (savedNetwork) {
            setNetworkConfiguration(savedNetwork);
        }
    }, []);

    const handleSetNetworkConfiguration = (network: string) => {
        setNetworkConfiguration(network);
        localStorage.setItem("network", network);
    };

    return (
        <NetworkConfigurationContext.Provider 
            value={{ 
                networkConfiguration, 
                setNetworkConfiguration: handleSetNetworkConfiguration 
            }}
        >
            {children}
        </NetworkConfigurationContext.Provider>
    );
};