import React from 'react';
import { useFormations } from '../hooks';
import { Card } from '../../../components/Card';
import { ContentContainer } from '../../../components/ContentContainer';
import { Button } from '../../../components/Button';
import { useNotificationStore } from '../../../stores/useNotificationStore';

export const FormationList: React.FC = () => {
  const { formations, isLoading, error } = useFormations();
  const { addNotification } = useNotificationStore();
  
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
  
  if (formations.length === 0) {
    return (
      <ContentContainer>
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Aucune formation</h2>
            <p className="text-gray-600 mb-4">
              Aucune formation n'est disponible pour le moment.
            </p>
          </div>
        </Card>
      </ContentContainer>
    );
  }
  
  return (
    <ContentContainer>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Formations disponibles</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formations.map((formation) => (
          <Card key={formation.id} className="h-full">
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-2">{formation.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{formation.description}</p>
              
              <div className="text-sm text-gray-500 mb-4">
                <div className="flex justify-between mb-1">
                  <span>Début:</span>
                  <span>{new Date(formation.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fin:</span>
                  <span>{new Date(formation.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button 
                  className="w-full"
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      message: `Formation sélectionnée: ${formation.title}`
                    });
                  }}
                >
                  Voir les détails
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ContentContainer>
  );
}; 