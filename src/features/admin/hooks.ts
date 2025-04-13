import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { AdminState, AdminStats } from './types';
import { 
  getAccessRequests, 
  approveAccessRequest, 
  rejectAccessRequest,
  RequestData,
  AttendanceAccount,
  getProvider,
  AlyraSignIDL
} from '../../lib/solana';
import { AccessRequest } from '../auth/types';
import { Connection, PublicKey } from '@solana/web3.js';
import { useProgram } from '../../hooks/useProgram';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Program } from '@project-serum/anchor';
import { AlyraSignAccountData } from '../../lib/idl/alyrasign';
import { Formation, Session, Attendance } from '../formation/types';

export const useAdmin = () => {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const { program } = useProgram();
  const [state, setState] = useState<AdminState>({
    accessRequests: [],
    formations: [],
    sessions: [],
    attendances: [],
    isLoading: true,
    error: null
  });

  const loadData = async () => {
    if (!wallet || !publicKey) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const provider = getProvider(wallet, connection);
      const solanaRequests = await getAccessRequests(wallet as any, connection);
      
      const accessRequests: AccessRequest[] = solanaRequests.map((req: RequestData) => ({
        id: req.id,
        requester: req.walletAddress,
        role: req.requestedRole,
        message: req.message,
        status: req.status.toLowerCase() as "pending" | "approved" | "rejected",
        createdAt: Date.parse(req.timestamp),
        updatedAt: Date.parse(req.timestamp)
      }));
      
      setState(prev => ({
        ...prev,
        accessRequests,
        isLoading: false
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setState(prev => ({
        ...prev,
        error: 'Erreur lors du chargement des données',
        isLoading: false
      }));
    }
  };

  useEffect(() => {
    loadData();
  }, [wallet, publicKey]);

  const handleApproveRequest = async (requestId: string) => {
    if (!wallet || !publicKey) return;
    
    try {
      await approveAccessRequest(requestId, wallet, connection, 'student');
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande:', error);
      setState(prev => ({
        ...prev,
        error: 'Erreur lors de l\'approbation de la demande'
      }));
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!wallet || !publicKey) return;
    
    try {
      await rejectAccessRequest(requestId, wallet, connection);
      await loadData();
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
      setState(prev => ({
        ...prev,
        error: 'Erreur lors du rejet de la demande'
      }));
    }
  };

  const getStats = (): AdminStats => {
    return {
      totalUsers: state.accessRequests.length,
      totalFormations: state.formations.length,
      totalSessions: state.sessions.length,
      totalAttendances: state.attendances.length,
      pendingRequests: state.accessRequests.filter(req => req.status === 'pending').length
    };
  };

  return {
    ...state,
    handleApproveRequest,
    handleRejectRequest,
    getStats,
    loadData
  };
}; 