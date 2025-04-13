import React from 'react';
import { useAdmin } from '../hooks';
import Card from '../../../components/Card';
import { ContentContainer } from '../../../components/ContentContainer';
import { AccessRequestList } from './AccessRequestList';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getAccessRequests } from '../../../lib/solana';
import useNotificationStore from '../../../stores/useNotificationStore';

export const AdminDashboard: React.FC = () => {
  const { isLoading, error, getStats, loadData } = useAdmin();
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const stats = getStats();
  
  const handleSync = async () => {
    if (!wallet) return;
    
    try {
      const requests = await getAccessRequests(wallet as any, connection);
      useNotificationStore.setState({
        notifications: [{
          type: 'success',
          message: 'Synchronisation réussie',
          description: `${requests.length} demandes récupérées de la blockchain.`,
          txid: undefined
        }]
      });
      loadData();
    } catch (error) {
      useNotificationStore.setState({
        notifications: [{
          type: 'error',
          message: 'Erreur de synchronisation',
          description: 'Impossible de récupérer les demandes de la blockchain.',
          txid: undefined
        }]
      });
    }
  };
  
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
  
  if (error) {
    return (
      <ContentContainer>
        <Card>
          <div className="text-center py-8 text-red-500">
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p>{error}</p>
          </div>
        </Card>
      </ContentContainer>
    );
  }
  
  return (
    <ContentContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tableau de bord d'administration</h1>
          <button
            onClick={handleSync}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Synchroniser avec la Blockchain
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-500">Utilisateurs</h3>
              <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-500">Formations</h3>
              <p className="text-3xl font-bold mt-1">{stats.totalFormations}</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-500">Sessions</h3>
              <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-500">Présences</h3>
              <p className="text-3xl font-bold mt-1">{stats.totalAttendances}</p>
            </div>
          </Card>
        </div>
        
        <div className="mb-6">
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Demandes d'accès en attente</h2>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {stats.pendingRequests} en attente
                </span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="h-auto">
          <AccessRequestList />
        </div>
      </div>
    </ContentContainer>
  );
}; 