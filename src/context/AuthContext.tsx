import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Crear contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {}
});

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<void> => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login exitoso:', userCredential.user.email);
      });
  };

  // Función para cerrar sesión
  const logout = (): Promise<void> => {
    return signOut(auth)
      .then(() => {
        console.log('Logout exitoso');
      });
  };

  // Función para restablecer contraseña
  const resetPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Email de restablecimiento enviado');
      });
  };

  // Efecto para escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 