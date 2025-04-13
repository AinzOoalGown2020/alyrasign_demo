import React, { useEffect, useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { Progress, ProgressStatus } from '../types';
import { Card } from '../../../ui/components/Card';
import { Text } from '../../../ui/components/Text';
import { Button } from '../../../ui/components/Button';

interface ProgressTrackerProps {
  formationPubkey: string;
  totalSessions: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  formationPubkey,
  totalSessions,
}) => {
  const { getProgress, updateProgress, loading, error } = useProgress();
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      const progressData = await getProgress(formationPubkey);
      setProgress(progressData);
    };

    loadProgress();
  }, [formationPubkey, getProgress]);

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.completedSessions / progress.totalSessions) * 100);
  };

  const getStatusColor = (status: ProgressStatus) => {
    switch (status) {
      case ProgressStatus.NotStarted:
        return '#6B7280'; // gray-500
      case ProgressStatus.InProgress:
        return '#3B82F6'; // blue-500
      case ProgressStatus.Completed:
        return '#22C55E'; // green-500
      case ProgressStatus.Dropped:
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  if (loading) {
    return (
      <Card>
        <Text>Chargement de la progression...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Text color="error">{error}</Text>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card>
        <Text>Aucune progression enregistrée</Text>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text variant="h3">Progression de la formation</Text>
          <Text color={getStatusColor(progress.status)}>
            {progress.status}
          </Text>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Text>Sessions complétées</Text>
            <Text>{progress.completedSessions} / {progress.totalSessions}</Text>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {progress.lastSessionDate && (
          <Text variant="body" color="gray">
            Dernière session : {new Date(progress.lastSessionDate).toLocaleDateString()}
          </Text>
        )}

        {progress.status === ProgressStatus.InProgress && (
          <Button
            onClick={() => updateProgress(formationPubkey, 'current-session-id')}
            disabled={loading}
            variant="primary"
          >
            Mettre à jour la progression
          </Button>
        )}
      </div>
    </Card>
  );
}; 