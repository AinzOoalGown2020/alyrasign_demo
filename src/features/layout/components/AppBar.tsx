import React, { useState, useEffect } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAutoConnect } from '../../../contexts/AutoConnectProvider';
import { NetworkSwitcher } from './NetworkSwitcher';
import { NavElement } from './NavElement';

// Import dynamique du bouton wallet pour éviter les erreurs SSR
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

// Adresse du développeur avec accès complet
const DEV_ADDRESS = "79ziyYSUHVNENrJVinuotWZQ2TX7n44vSeo1cgxFPzSy";

// Définir des types pour les rôles
export type UserRole = 'formateur' | 'etudiant' | null;

export interface AppBarProps {
  /** Classes CSS supplémentaires */
  className?: string;
  /** Afficher le logo */
  showLogo?: boolean;
  /** Afficher le sélecteur de réseau */
  showNetworkSwitcher?: boolean;
  /** Afficher le bouton de connexion wallet */
  showWalletButton?: boolean;
}

/**
 * Composant AppBar pour la navigation principale
 */
export const AppBar: React.FC<AppBarProps> = ({
  className = '',
  showLogo = true,
  showNetworkSwitcher = true,
  showWalletButton = true
}) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const wallet = useWallet();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Effet pour suivre l'état de connexion du wallet
  useEffect(() => {
    setWalletConnected(wallet.connected);
  }, [wallet.connected]);
  
  // Vérification du rôle utilisateur
  useEffect(() => {
    const checkUserRole = () => {
      if (wallet.publicKey?.toString() === DEV_ADDRESS) {
        setUserRole('formateur');
      } else if (wallet.connected) {
        // Vérifier le rôle dans le localStorage
        const lastConnectedRole = localStorage.getItem('alyraSign_lastConnectedRole');
        const lastConnectedWallet = localStorage.getItem('alyraSign_lastConnectedWallet');
        
        if (lastConnectedWallet === wallet.publicKey?.toString() && lastConnectedRole) {
          setUserRole(lastConnectedRole as UserRole);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    
    checkUserRole();
  }, [wallet.connected, wallet.publicKey]);
  
  // Fonction pour forcer la déconnexion du wallet
  const handleDisconnect = async () => {
    try {
      await wallet.disconnect();
      setWalletConnected(false);
      console.log("Wallet déconnecté avec succès");
    } catch (error) {
      console.error("Erreur lors de la déconnexion du wallet:", error);
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* NavBar / Header */}
      <div className="navbar flex h-20 flex-row md:mb-2 shadow-lg bg-black text-neutral-content border-b border-zinc-600 bg-opacity-66 w-full">
        <div className="navbar-start align-items-center">
          {showLogo && (
            <div className="hidden sm:inline w-22 h-22 md:p-2 ml-10 flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-[70px] h-[70px] relative">
                  <Image 
                    src="/AlyraSign.png" 
                    alt="AlyraSign Logo" 
                    width={150}
                    height={50}
                    sizes="(max-width: 768px) 100px, 150px"
                    className="object-contain"
                    priority
                  />
                </div>
                <Link href="/" className="text-secondary hover:text-white text-2xl font-bold">
                  AlyraSign
                </Link>
              </div>
            </div>
          )}
          {showWalletButton && (
            <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex md:hidden text-lg " />
          )}
        </div>

        {/* Nav Links */}
        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center justify-items gap-6">
            <NavElement
              label="Accueil"
              href="/"
              navigationStarts={() => setIsNavOpen(false)}
            />
            
            {!wallet.connected && (
              <NavElement
                label="Demande d'accès"
                href="/access"
                navigationStarts={() => setIsNavOpen(false)}
              />
            )}
            
            {wallet.connected && userRole === 'formateur' && (
              <>
                <NavElement
                  label="Gestion des Formations"
                  href="/admin/formations"
                  navigationStarts={() => setIsNavOpen(false)}
                  className="whitespace-nowrap"
                />
                <NavElement
                  label="Gestion des Étudiants"
                  href="/admin/etudiants"
                  navigationStarts={() => setIsNavOpen(false)}
                  className="whitespace-nowrap"
                />
                <NavElement
                  label="Administration"
                  href="/admin"
                  navigationStarts={() => setIsNavOpen(false)}
                />
                <NavElement
                  label="Blockchain"
                  href="/admin/blockchain"
                  navigationStarts={() => setIsNavOpen(false)}
                />
              </>
            )}
            
            {wallet.connected && userRole === 'etudiant' && (
              <NavElement
                label="Portail Étudiant"
                href="/etudiants"
                navigationStarts={() => setIsNavOpen(false)}
                className="whitespace-nowrap"
              />
            )}
            
            {showWalletButton && (
              <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6" />
            )}
          </div>
          
          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              className="flex items-center px-3 py-2 border rounded text-purple-600 border-purple-600 hover:text-white hover:border-white mr-6"
              onClick={() => setIsNavOpen(!isNavOpen)}>
              <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                {isNavOpen 
                  ? <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/>
                  : <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                }
              </svg>
            </button>
          </div>
          
          {/* Menu mobile déroulant */}
          {isNavOpen && (
            <div className="absolute top-20 right-0 bg-black w-full z-10 md:hidden">
              <div className="flex flex-col p-4 space-y-3">
                <NavElement
                  label="Accueil"
                  href="/"
                  navigationStarts={() => setIsNavOpen(false)}
                />
                
                {!wallet.connected && (
                  <NavElement
                    label="Demande d'accès"
                    href="/access"
                    navigationStarts={() => setIsNavOpen(false)}
                  />
                )}
                
                {wallet.connected && userRole === 'formateur' && (
                  <>
                    <NavElement
                      label="Gestion des Formations"
                      href="/admin/formations"
                      navigationStarts={() => setIsNavOpen(false)}
                    />
                    <NavElement
                      label="Gestion des Étudiants"
                      href="/admin/etudiants"
                      navigationStarts={() => setIsNavOpen(false)}
                    />
                    <NavElement
                      label="Administration"
                      href="/admin"
                      navigationStarts={() => setIsNavOpen(false)}
                    />
                    <NavElement
                      label="Blockchain"
                      href="/admin/blockchain"
                      navigationStarts={() => setIsNavOpen(false)}
                    />
                  </>
                )}
                
                {wallet.connected && userRole === 'etudiant' && (
                  <NavElement
                    label="Portail Étudiant"
                    href="/etudiants"
                    navigationStarts={() => setIsNavOpen(false)}
                  />
                )}
              </div>
            </div>
          )}
          
          {showNetworkSwitcher && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-square btn-ghost text-right mr-4">
                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52">
                <li>
                  <div className="form-control bg-opacity-100">
                    <label className="cursor-pointer label">
                      <a>Autoconnect</a>
                      <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle" />
                    </label>
                    <NetworkSwitcher />
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 