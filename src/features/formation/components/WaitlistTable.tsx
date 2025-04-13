import React from 'react';
import { useWaitlist } from '../hooks/useWaitlist';
import { WaitlistStatus } from '../types';
import { Button } from '../../../ui/components/Button';
import { Card } from '../../../ui/components/Card';
import { Text } from '../../../ui/components/Text';

interface WaitlistTableProps {
  formationId: string;
  isTrainer: boolean;
}

export const WaitlistTable: React.FC<WaitlistTableProps> = ({ formationId, isTrainer }) => {
  const {
    waitlistEntries,
    isLoading,
    error,
    joinWaitlist,
    promoteFromWaitlist,
  } = useWaitlist(formationId);

  const getStatusColor = (status: WaitlistStatus) => {
    switch (status) {
      case WaitlistStatus.Waiting:
        return '#F59E0B'; // yellow-500
      case WaitlistStatus.PendingPromotion:
        return '#3B82F6'; // blue-500
      case WaitlistStatus.Promoted:
        return '#22C55E'; // green-500
      case WaitlistStatus.Declined:
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  if (isLoading) {
    return (
      <Card>
        <Text variant="body">Chargement de la liste d'attente...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Text variant="body" color="#EF4444">{error}</Text>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text variant="h3">Liste d'attente</Text>
          {!isTrainer && (
            <Button
              onClick={joinWaitlist}
              disabled={isLoading}
              variant="primary"
            >
              Rejoindre la liste d'attente
            </Button>
          )}
        </div>

        {waitlistEntries.length === 0 ? (
          <Text variant="body">La liste d'attente est vide</Text>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  {isTrainer && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waitlistEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body">{entry.position + 1}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body">{entry.student}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body" color={getStatusColor(entry.status)}>
                        {entry.status}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body">
                        {new Date(entry.timestamp * 1000).toLocaleDateString()}
                      </Text>
                    </td>
                    {isTrainer && entry.status === WaitlistStatus.Waiting && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => promoteFromWaitlist(entry.id)}
                          disabled={isLoading}
                          variant="secondary"
                        >
                          Promouvoir
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}; 