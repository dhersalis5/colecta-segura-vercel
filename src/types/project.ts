export interface Transaction {
  id: string;
  projectId: string;
  amount: number;
  type: 'cash' | 'transfer';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  donorName?: string;
  donorEmail?: string;
  transferReference?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  currentAmount: number;
  targetAmount: number;
  daysLeft: number;
  backers: number;
  category: string;
  featured: boolean;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  transactions?: Transaction[];
}

export interface Donation {
  id: string;
  projectId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  paymentMethod: 'mercadoPago' | 'bankTransfer' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  message?: string;
  createdAt: Date | string;
} 