export interface User {
  id: string;
  publicKey: string;
  role: 'student' | 'trainer' | 'admin';
  name?: string;
  email?: string;
}

export interface AccessRequest {
  id: string;
  requester: string;
  role: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  updatedAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 