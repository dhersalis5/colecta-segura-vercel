export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  goalAmount: number;
  amountRaised: number;
  coverImage: string;
  additionalImages?: string[];
  isActive: boolean;
  location: string;
  organizerName: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  donorsCount: number;
  paymentMethods?: {
    mercadoPago: boolean;
    bankTransfer: boolean;
    cash: boolean;
  };
  bankInfo?: {
    accountName: string;
    bankName: string;
    cbu: string;
    alias: string;
  };
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