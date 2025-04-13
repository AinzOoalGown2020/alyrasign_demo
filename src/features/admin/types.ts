import { AccessRequest } from '../auth/types';
import { Formation, Session, Attendance } from '../formation/types';

export interface AdminState {
  accessRequests: AccessRequest[];
  formations: Formation[];
  sessions: Session[];
  attendances: Attendance[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminStats {
  totalUsers: number;
  totalFormations: number;
  totalSessions: number;
  totalAttendances: number;
  pendingRequests: number;
} 