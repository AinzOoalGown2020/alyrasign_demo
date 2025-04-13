import React from 'react';
import { useAuth } from '../../features/auth/hooks';
import { AccessRequestForm } from '../../features/auth/components/AccessRequestForm';
import { ContentContainer } from '../../features/ui/components/ContentContainer';
import Card from '../../components/Card';
import { useProgram } from '../../hooks/useProgram';
import { Alyrasign } from '../../types/alyrasign';
import { Program } from '@coral-xyz/anchor';

const AccessPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { program } = useProgram() as { program: Program<Alyrasign> | null };

  if (isLoading) {
    return (
      <ContentContainer withBackground>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </Card>
        </div>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer withBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">Demande d'accès</h1>
        
        {isAuthenticated ? (
          <Card>
            <div className="p-6 text-center">
              <p className="text-lg text-gray-300">Vous êtes déjà authentifié.</p>
            </div>
          </Card>
        ) : !program ? (
          <Card>
            <div className="p-6 text-center">
              <p className="text-lg text-gray-300">Veuillez connecter votre wallet pour accéder au formulaire.</p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="p-6">
              <AccessRequestForm program={program} />
            </div>
          </Card>
        )}
      </div>
    </ContentContainer>
  );
};

export default AccessPage; 