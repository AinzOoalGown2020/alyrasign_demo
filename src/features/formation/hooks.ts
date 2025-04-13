import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Formation, Session, Attendance, FormationState } from './types';
import { 
  createFormation, 
  getFormations, 
  createSession, 
  getSessions,
  createAttendance,
  getAttendances
} from '../../lib/solana';

export const useFormations = () => {
  const { publicKey } = useWallet();
  const [state, setState] = useState<FormationState>({
    formations: [],
    sessions: [],
    attendances: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      if (!publicKey) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Charger les formations
        const formationsData = await getFormations();
        const formations = formationsData.map(f => ({
          ...f,
          startDate: new Date(f.startDate),
          endDate: new Date(f.endDate),
          createdAt: new Date(f.createdAt),
          updatedAt: new Date(f.updatedAt)
        }));
        
        // Charger les sessions
        const sessionsData = await getSessions();
        const sessions = sessionsData.map(s => ({
          ...s,
          date: new Date(s.date),
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt)
        }));
        
        // Charger les présences
        const attendancesData = await getAttendances();
        const attendances = attendancesData.map(a => ({
          ...a,
          checkInTime: new Date(a.checkInTime),
          checkOutTime: a.checkOutTime ? new Date(a.checkOutTime) : undefined,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt)
        }));
        
        setState({
          formations,
          sessions,
          attendances,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        }));
      }
    };

    loadData();
  }, [publicKey]);

  const addFormation = async (title: string, description: string, startDate: Date, endDate: Date) => {
    if (!publicKey) {
      throw new Error('Wallet non connecté');
    }

    try {
      await createFormation(title, description, publicKey);
      
      // Recharger les formations
      const formationsData = await getFormations();
      const formations = formationsData.map(f => ({
        ...f,
        startDate: new Date(f.startDate),
        endDate: new Date(f.endDate),
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.updatedAt)
      }));
      
      setState(prev => ({ 
        ...prev, 
        formations,
        error: null
      }));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }));
      return false;
    }
  };

  const addSession = async (
    formationId: string, 
    title: string, 
    description: string, 
    date: Date, 
    duration: number, 
    location: string
  ) => {
    if (!publicKey) {
      throw new Error('Wallet non connecté');
    }

    try {
      await createSession(formationId, title, description, date, duration, location, publicKey);
      
      // Recharger les sessions
      const sessionsData = await getSessions();
      const sessions = sessionsData.map(s => ({
        ...s,
        date: new Date(s.date),
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt)
      }));
      
      setState(prev => ({ 
        ...prev, 
        sessions,
        error: null
      }));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }));
      return false;
    }
  };

  const markAttendance = async (
    sessionId: string, 
    student: string, 
    isPresent: boolean, 
    note: string = ''
  ) => {
    if (!publicKey) {
      throw new Error('Wallet non connecté');
    }

    try {
      await createAttendance(sessionId, student, isPresent, note, publicKey);
      
      // Recharger les présences
      const attendancesData = await getAttendances();
      const attendances = attendancesData.map(a => ({
        ...a,
        checkInTime: new Date(a.checkInTime),
        checkOutTime: a.checkOutTime ? new Date(a.checkOutTime) : undefined,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt)
      }));
      
      setState(prev => ({ 
        ...prev, 
        attendances,
        error: null
      }));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }));
      return false;
    }
  };

  return {
    ...state,
    addFormation,
    addSession,
    markAttendance
  };
}; 