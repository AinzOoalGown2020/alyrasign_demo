import React, { useEffect, useState } from 'react';
import { useWaitlist } from '../hooks/useWaitlist';
import { useWaitlistNotifications } from '../hooks/useWaitlistNotifications';
import { WaitlistEntry, WaitlistStatus } from '../types';
import { Button } from '../../../ui/components/Button';
import { Card } from '../../../ui/components/Card';
import { Text } from '../../../ui/components/Text';

interface WaitlistManagerProps {
  formationPubkey: string;
  maxCapacity: number;
  currentEnrolled: number;
  waitlistSize: number;
}

export const WaitlistManager: React.FC<WaitlistManagerProps> = ({
  formationPubkey,
  maxCapacity,
  currentEnrolled,
  waitlistSize,
}) => {
  const {
    joinWaitlist,
    acceptPromotion,
    declinePromotion,
    dropFromWaitlist,
    getWaitlistPosition,
    loading,
    error,
    reorganizeWaitlist,
  } = useWaitlist();

  useWaitlistNotifications(formationPubkey);

  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPosition = async () => {
      setIsChecking(true);
      try {
        const entry = await getWaitlistPosition(formationPubkey);
        setWaitlistEntry(entry);
      } catch (err) {
        console.error('Erreur lors de la vérification de la position:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkPosition();
  }, [formationPubkey, getWaitlistPosition]);

  const handleJoinWaitlist = async () => {
    try {
      await joinWaitlist(formationPubkey);
      const entry = await getWaitlistPosition(formationPubkey);
      setWaitlistEntry(entry);
    } catch (err) {
      console.error('Erreur lors de l\'inscription en liste d\'attente:', err);
    }
  };

  const handleAcceptPromotion = async () => {
    try {
      await acceptPromotion(formationPubkey);
      const entry = await getWaitlistPosition(formationPubkey);
      setWaitlistEntry(entry);
    } catch (err) {
      console.error('Erreur lors de l\'acceptation de la promotion:', err);
    }
  };

  const handleDeclinePromotion = async () => {
    try {
      await declinePromotion(formationPubkey);
      const entry = await getWaitlistPosition(formationPubkey);
      setWaitlistEntry(entry);
    } catch (err) {
      console.error('Erreur lors du refus de la promotion:', err);
    }
  };

  const handleDropFromWaitlist = async () => {
    try {
      await dropFromWaitlist(formationPubkey);
      await reorganizeWaitlist(formationPubkey);
      const entry = await getWaitlistPosition(formationPubkey);
      setWaitlistEntry(entry);
    } catch (err) {
      console.error('Erreur lors du désistement de la liste d\'attente:', err);
    }
  };

  if (isChecking) {
    return (
      <Card>
        <Text>Vérification de votre position...</Text>
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

  if (waitlistEntry) {
    return (
      <Card>
        <Text variant="h3">Votre position sur la liste d'attente</Text>
        <Text>Position: {waitlistEntry.position + 1}</Text>
        <Text>Statut: {waitlistEntry.status}</Text>
        
        {waitlistEntry.status === WaitlistStatus.PendingPromotion && (
          <div className="space-y-4">
            <Text>Une place s'est libérée ! Vous pouvez maintenant rejoindre la formation.</Text>
            <div className="flex space-x-4">
              <Button
                onClick={handleAcceptPromotion}
                disabled={loading}
                variant="primary"
              >
                Accepter la promotion
              </Button>
              <Button
                onClick={handleDeclinePromotion}
                disabled={loading}
                variant="secondary"
              >
                Refuser la promotion
              </Button>
            </div>
          </div>
        )}

        {waitlistEntry.status === WaitlistStatus.Waiting && (
          <div className="space-y-4 mt-4">
            <Button
              onClick={handleDropFromWaitlist}
              disabled={loading}
              variant="secondary"
            >
              Se désister de la liste d'attente
            </Button>
          </div>
        )}
      </Card>
    );
  }

  const canJoinWaitlist = currentEnrolled >= maxCapacity && currentEnrolled < (maxCapacity + waitlistSize);

  return (
    <Card>
      <Text variant="h3">Liste d'attente</Text>
      {canJoinWaitlist ? (
        <div className="space-y-4">
          <Text>La formation est complète, mais vous pouvez rejoindre la liste d'attente.</Text>
          <Button
            onClick={handleJoinWaitlist}
            disabled={loading}
            variant="primary"
          >
            Rejoindre la liste d'attente
          </Button>
        </div>
      ) : (
        <Text>
          {currentEnrolled >= (maxCapacity + waitlistSize)
            ? "La liste d'attente est complète"
            : "La formation n'est pas encore complète"}
        </Text>
      )}
    </Card>
  );
}; 