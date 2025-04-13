import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAuth } from '../hooks';
import { AccessRequestForm } from './AccessRequestForm';
import { AuthStatus } from './AuthStatus';
import { ContentContainer } from '../../../components/ContentContainer';
import { Card } from '../../../components/Card';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const LoginPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { connected } = useWallet();
  
  if (isLoading) {
    return (
      <ContentContainer>
        <Card>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </Card>
      </ContentContainer>
    );
  }
  
  return (
    <ContentContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-black bg-opacity-70 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <div className="w-[70px] h-[70px] relative mr-4">
              <Image 
                src="/AlyraSign.png" 
                alt="AlyraSign Logo" 
                width={200}
                height={70}
                sizes="(max-width: 768px) 150px, 200px"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-500">
              {process.env.NEXT_PUBLIC_APP_NAME || 'AlyraSign'}
            </h1>
          </div>
          
          <p className="text-center text-gray-300 mb-8">
            {process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Application de gestion des présences pour les étudiants'}
          </p>
          
          <div className="mb-8">
            <AuthStatus />
          </div>
          
          {!connected ? (
            <div className="flex justify-center mb-6">
              <WalletMultiButtonDynamic className="btn btn-primary btn-lg rounded-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700" />
            </div>
          ) : !isAuthenticated ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center">Demande d'accès</h2>
              <p className="text-gray-600 mb-6 text-center">
                Pour accéder à la plateforme, vous devez soumettre une demande d'accès.
              </p>
              <AccessRequestForm />
            </div>
          ) : (
            <Card>
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Bienvenue {user?.role}</h2>
                <p className="text-gray-600 mb-6">
                  Vous êtes connecté et avez accès à la plateforme.
                </p>
                <a 
                  href={user?.role === 'admin' ? '/admin' : '/etudiants'} 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Accéder à votre espace
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ContentContainer>
  );
}; 