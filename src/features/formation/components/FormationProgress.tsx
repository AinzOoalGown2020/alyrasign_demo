import React from 'react';
import { Card } from '../../ui/components/Card';
import { Text } from '../../ui/components/Text';
import { Button } from '../../ui/components/Button';

interface Session {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  attended?: boolean;
}

interface FormationProgressProps {
  formationId: string;
  title: string;
  sessions: Session[];
  onSessionClick?: (sessionId: string) => void;
}

export const FormationProgress: React.FC<FormationProgressProps> = ({
  formationId,
  title,
  sessions,
  onSessionClick
}) => {
  // Calculer la progression globale
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.attended).length;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Trier les sessions par date
  const sortedSessions = [...sessions].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculer les statistiques
  const upcomingSessions = sessions.filter(s => s.date > new Date()).length;
  const missedSessions = sessions.filter(s => s.date < new Date() && !s.attended).length;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <Text variant="h3">{title}</Text>
        <div className="flex items-center justify-between mb-4">
          <Text variant="body" color="#4B5563">Progression globale</Text>
          <Text variant="body" color="#6366F1">{Math.round(progressPercentage)}%</Text>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text variant="h4">{totalSessions}</Text>
          <Text variant="caption" color="#4B5563">Sessions totales</Text>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text variant="h4">{upcomingSessions}</Text>
          <Text variant="caption" color="#4B5563">Sessions à venir</Text>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text variant="h4">{missedSessions}</Text>
          <Text variant="caption" color="#4B5563">Sessions manquées</Text>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onSessionClick?.(session.id)}
          >
            <div>
              <Text variant="h4">{session.title}</Text>
              <div className="flex items-center space-x-4">
                <Text variant="caption" color="#4B5563">
                  {session.date.toLocaleDateString()}
                </Text>
                <Text variant="caption" color="#4B5563">
                  {session.startTime} - {session.endTime}
                </Text>
              </div>
            </div>
            <div>
              {session.date < new Date() ? (
                session.attended ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Présent
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Absent
                  </span>
                )
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  À venir
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 