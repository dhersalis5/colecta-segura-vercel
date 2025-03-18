
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useToast } from "@/components/ui/use-toast";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const { toast } = useToast();

  // En un escenario real, esto se conectaría con un backend de autenticación
  const handleLogin = (password: string) => {
    // Simulación de autenticación básica (SOLO PARA DEMO, no para producción)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración",
        variant: "default",
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración",
      variant: "default",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 py-8">
            <AdminLogin onLogin={handleLogin} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            
            <div className="lg:col-span-3">
              {activeTab === 'projects' && <AdminProjects />}
              {activeTab === 'analytics' && (
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                  <p className="text-gray-500">Estadísticas y análisis de donaciones (en desarrollo)</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Configuración</h2>
                  <p className="text-gray-500">Configuración general del sitio (en desarrollo)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
