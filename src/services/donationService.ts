import { Donation } from '@/types/project';
import { updateProjectAmount } from './projectService';

// Clave para guardar las donaciones en localStorage
const STORAGE_KEY = 'colecta-segura-donations';

// Inicializar el almacenamiento
const initializeStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Interfaz para datos de donación al crear una nueva
export interface CreateDonationData {
  projectId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  paymentMethod: 'mercadoPago' | 'bankTransfer' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  message?: string;
}

// Obtener todas las donaciones
export const getAllDonations = (): Promise<Donation[]> => {
  return new Promise((resolve) => {
    initializeStorage();
    if (typeof window !== 'undefined') {
      const donations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      resolve(donations);
    } else {
      resolve([]);
    }
  });
};

// Obtener donaciones por proyecto
export const getDonationsByProject = (projectId: string): Promise<Donation[]> => {
  return new Promise((resolve) => {
    getAllDonations().then(donations => {
      const projectDonations = donations.filter(d => d.projectId === projectId);
      resolve(projectDonations);
    });
  });
};

// Crear una nueva donación
export const createDonation = async (data: CreateDonationData): Promise<Donation> => {
  return new Promise(async (resolve, reject) => {
    try {
      const now = new Date().toISOString();
      const newDonation: Donation = {
        id: `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        ...data
      };
      
      const donations = await getAllDonations();
      const updatedDonations = [...donations, newDonation];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDonations));
      }
      
      // Si la donación es completada o está pendiente (para transferencia bancaria o efectivo),
      // actualizamos el monto del proyecto
      if (data.status === 'completed' || data.status === 'pending') {
        await updateProjectAmount(data.projectId, data.amount, data.isAnonymous);
      }
      
      resolve(newDonation);
    } catch (error) {
      reject(error);
    }
  });
};

// Actualizar el estado de una donación
export const updateDonationStatus = async (
  donationId: string, 
  status: 'pending' | 'completed' | 'failed'
): Promise<Donation | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const donations = await getAllDonations();
      const donationIndex = donations.findIndex(d => d.id === donationId);
      
      if (donationIndex === -1) {
        resolve(null);
        return;
      }
      
      const donation = donations[donationIndex];
      const oldStatus = donation.status;
      
      // Actualizar el estado
      const updatedDonation = {
        ...donation,
        status
      };
      
      const updatedDonations = [...donations];
      updatedDonations[donationIndex] = updatedDonation;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDonations));
      }
      
      // Si la donación cambia de estado pendiente/fallido a completado,
      // actualizamos el monto recaudado del proyecto
      if (oldStatus !== 'completed' && status === 'completed') {
        await updateProjectAmount(donation.projectId, donation.amount, donation.isAnonymous);
      }
      
      resolve(updatedDonation);
    } catch (error) {
      reject(error);
    }
  });
};

// Obtener las últimas donaciones (para el panel de administración)
export const getLatestDonations = (limit: number = 10): Promise<Donation[]> => {
  return new Promise((resolve) => {
    getAllDonations().then(donations => {
      // Ordenar por fecha de creación (más recientes primero)
      const sortedDonations = [...donations].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Limitar la cantidad de resultados
      const limitedDonations = sortedDonations.slice(0, limit);
      resolve(limitedDonations);
    });
  });
};

export default {
  getAllDonations,
  getDonationsByProject,
  createDonation,
  updateDonationStatus,
  getLatestDonations
}; 