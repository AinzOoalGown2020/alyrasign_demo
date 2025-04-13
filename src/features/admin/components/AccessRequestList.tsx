import React from 'react';
import { useAdmin } from '../hooks';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import useNotificationStore from '../../../stores/useNotificationStore';
import { NotificationType } from '../../../types/notification';

interface Notification {
  type: NotificationType;
  message: string;
  description?: string;
  txid?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const AccessRequestList: React.FC = () => {
  const { accessRequests, isLoading, error, handleApproveRequest, handleRejectRequest } = useAdmin();
  const { addNotification } = useNotificationStore();
  
  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <div className="text-center py-6 text-red-500">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      </Card>
    );
  }
  
  if (accessRequests.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <h2 className="text-xl font-bold mb-2">Aucune demande d'accès</h2>
          <p className="text-gray-600">
            Aucune demande d'accès en attente pour le moment.
          </p>
        </div>
      </Card>
    );
  }
  
  const handleApprove = async (requestId: string) => {
    await handleApproveRequest(requestId);
    addNotification({
      type: 'success',
      message: 'Demande d\'accès approuvée avec succès'
    });
  };
  
  const handleReject = async (requestId: string) => {
    await handleRejectRequest(requestId);
    addNotification({
      type: 'success',
      message: 'Demande d\'accès rejetée avec succès'
    });
  };
  
  return (
    <div className="space-y-3">
      {accessRequests.map((request) => (
        <Card key={request.id}>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold">
                  Demande de {request.role === 'student' ? 'Étudiant' : 'Formateur'}
                </h3>
                <p className="text-sm text-gray-500">
                  Adresse: {request.requester}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status === 'pending' ? 'En attente' :
                 request.status === 'approved' ? 'Approuvée' :
                 'Rejetée'}
              </span>
            </div>
            
            <p className="text-gray-700 mb-3">{request.message}</p>
            
            <div className="text-xs text-gray-500 mb-3">
              <div>Créée le: {new Date(request.createdAt).toLocaleString()}</div>
              <div>Mise à jour le: {new Date(request.updatedAt).toLocaleString()}</div>
            </div>
            
            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approuver
                </Button>
                <Button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Rejeter
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}; 