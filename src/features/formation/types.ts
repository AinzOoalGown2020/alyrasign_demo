export enum WaitlistStatus {
  Waiting = 'Waiting',
  PendingPromotion = 'PendingPromotion',
  Promoted = 'Promoted',
  Declined = 'Declined',
}

export interface WaitlistEntry {
  id: string;
  student: string;
  formation: string;
  position: number;
  status: WaitlistStatus;
  timestamp: number;
  createdAt: number;
  updatedAt: number;
}

export interface Formation {
  id: string;
  trainer: string;
  title: string;
  description: string;
  formationType: string;
  maxStudents: number;
  waitlistSize: number;
  currentStudents: number;
  currentWaitlist: number;
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  id: string;
  formationId: string;
  title: string;
  description: string;
  trainer: string;
  date: Date;
  duration: number; // en minutes
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  sessionId: string;
  student: string;
  isPresent: boolean;
  checkInTime: Date;
  checkOutTime?: Date;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  formationId: string;
  studentId: string;
  completedSessions: number;
  totalSessions: number;
  lastSessionDate?: Date;
  status: ProgressStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProgressStatus {
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Dropped = 'Dropped',
}

export interface FormationState {
  formations: Formation[];
  sessions: Session[];
  attendances: Attendance[];
  progress: Progress[];
  isLoading: boolean;
  error: string | null;
} 