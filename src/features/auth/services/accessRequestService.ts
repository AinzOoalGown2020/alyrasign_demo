import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet as AnchorWallet } from '@coral-xyz/anchor';
import { IDL, PROGRAM_ID } from '../../../lib/idl/alyrasign';
import { Wallet } from '@solana/wallet-adapter-react';
import { Alyrasign } from '../../../types/alyrasign';
import { findAccessRequestPDA } from '../../../lib/solana';

export interface AccessRequestData {
  role: 'student' | 'trainer';
  name: string;
  email: string;
  message?: string;
}

export class AccessRequestService {
  private program: Program<Alyrasign>;

  constructor(program: Program<Alyrasign>) {
    this.program = program;
  }

  async checkExistingRequest(userAddress: PublicKey): Promise<boolean> {
    try {
      const [pda] = await findAccessRequestPDA(userAddress);
      const account = await this.program.account.accessRequest.fetch(pda);
      return account !== null;
    } catch (error) {
      console.error('Erreur lors de la vérification de la demande:', error);
      return false;
    }
  }

  async submitRequest(userAddress: PublicKey, data: AccessRequestData): Promise<void> {
    try {
      const [pda] = await findAccessRequestPDA(userAddress);
      
      await this.program.methods
        .requestAccess(data.role, data.name, data.email, data.message || '')
        .accounts({
          accessRequest: pda,
          user: userAddress,
          systemProgram: SystemProgram.programId
        })
        .rpc();
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      throw error;
    }
  }
} 