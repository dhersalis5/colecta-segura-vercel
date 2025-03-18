import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Mientras se verifica el estado de autenticación, muestra un estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirige al login
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si hay un usuario autenticado, muestra el contenido protegido
  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard; 