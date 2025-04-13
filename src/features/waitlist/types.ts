import { PublicKey } from '@solana/web3.js';

export enum WaitlistStatus {
  Waiting = 'Waiting',
  PendingPromotion = 'PendingPromotion',
  Promoted = 'Promoted',
  Declined = 'Declined',
  Expired = 'Expired',
  Reorganized = 'Reorganized',
}

export interface WaitlistEntry {
  formation: PublicKey;
  student: PublicKey;
  position: number;
  status: WaitlistStatus;
  timestamp: number;
}

export interface WaitlistState {
  position: number | null;
  status: WaitlistStatus | null;
  loading: boolean;
  error: string | null;
}

export interface WaitlistActions {
  joinWaitlist: (formationPubkey: string) => Promise<string | undefined>;
  acceptPromotion: (formationPubkey: string) => Promise<string | undefined>;
  declinePromotion: (formationPubkey: string) => Promise<string | undefined>;
  getWaitlistPosition: (formationPubkey: string) => Promise<WaitlistEntry | null>;
} 