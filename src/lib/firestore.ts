import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { Project, Transaction } from '@/types/project';
import { auth } from './firebase';

const db = getFirestore();

export const projectsService = {
  // Obtener todos los proyectos
  getProjects: async (): Promise<Project[]> => {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate()
    })) as Project[];
  },

  // Crear un nuevo proyecto
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const projectData = {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'projects'), projectData);
    return {
      id: docRef.id,
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  // Actualizar un proyecto
  updateProject: async (id: string, project: Partial<Project>): Promise<void> => {
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      ...project,
      updatedAt: serverTimestamp()
    });
  },

  // Eliminar un proyecto
  deleteProject: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'projects', id));
  }
};

export const transactionsService = {
  // Obtener transacciones de un proyecto
  getProjectTransactions: async (projectId: string): Promise<Transaction[]> => {
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef, 
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate()
    })) as Transaction[];
  },

  // Crear una nueva transacción
  createTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const transactionData = {
      ...transaction,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    return {
      id: docRef.id,
      ...transaction,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  // Actualizar estado de una transacción
  updateTransactionStatus: async (id: string, status: Transaction['status']): Promise<void> => {
    const transactionRef = doc(db, 'transactions', id);
    await updateDoc(transactionRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }
}; 