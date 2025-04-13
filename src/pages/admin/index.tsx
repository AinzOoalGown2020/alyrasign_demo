import React from 'react';
import { useAuth } from '../../features/auth/hooks';
import { AdminDashboard } from '../../features/admin/components/AdminDashboard';
import { ContentContainer } from '../../components/ContentContainer';
import Card from '../../components/Card';

const AdminPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
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
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <ContentContainer>
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">
              Vous devez être connecté en tant qu'administrateur pour accéder à cette page.
            </p>
            <a 
              href="/" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retour à l'accueil
            </a>
          </div>
        </Card>
      </ContentContainer>
    );
  }
  
  return <AdminDashboard />;
};

export default AdminPage; 