
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BarChart, Settings, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onLogout
}) => {
  const menuItems = [
    { id: 'projects', label: 'Proyectos', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { id: 'analytics', label: 'Analíticos', icon: <BarChart className="h-5 w-5 mr-2" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
        
        <hr className="my-3" />
        
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
