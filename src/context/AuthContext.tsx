import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firebaseAuth } from '@/lib/firebaseAuth';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

// Crear contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  resetPassword: async () => ({ success: false })
});

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Comprobar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await firebaseAuth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    const result = await firebaseAuth.login(email, password);
    if (result.success) {
      const currentUser = await firebaseAuth.getCurrentUser();
      setUser(currentUser);
    }
    return result;
  };

  // Función para cerrar sesión
  const logout = async () => {
    await firebaseAuth.logout();
    setUser(null);
  };

  // Función para restablecer contraseña
  const resetPassword = async (email: string) => {
    return await firebaseAuth.resetPassword(email);
  };

  const value = {
    user,
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