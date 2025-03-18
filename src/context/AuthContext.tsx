import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localAuth } from '@/lib/localAuth';

interface User {
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

// Crear contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  resetPassword: async () => ({ success: false })
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

  // Comprobar autenticación al cargar
  useEffect(() => {
    // Simulamos un pequeño retraso para dar sensación de autenticación
    const timer = setTimeout(() => {
      const user = localAuth.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    const result = await localAuth.login(email, password);
    if (result.success) {
      setCurrentUser({ email });
    }
    return result;
  };

  // Función para cerrar sesión
  const logout = () => {
    localAuth.logout();
    setCurrentUser(null);
  };

  // Función simulada para restablecer contraseña
  const resetPassword = async (email: string) => {
    // En una aplicación real, enviaríamos un correo
    // Para esta demo, simplemente simulamos éxito si el correo tiene formato válido
    if (!email || !email.includes('@') || !email.includes('.')) {
      return {
        success: false,
        message: 'Por favor, ingresa una dirección de correo válida'
      };
    }
    
    return {
      success: true,
      message: 'Si existe una cuenta con este correo, recibirás instrucciones para restablecer tu contraseña'
    };
  };

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