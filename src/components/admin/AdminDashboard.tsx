import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectEditor } from './ProjectEditor';
import DonationStats from './DonationStats';
import { Project } from '@/types/project';
import * as projectService from '@/services/projectService';
import { LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard: React.FC = () => {
  // Estados del dashboard
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("proyectos");
  
  // Configuración de métodos de pago disponibles
  const [paymentMethods, setPaymentMethods] = useState({
    mercadopago: true,
    banktransfer: true, 
    cash: true
  });

  // Configuración para donaciones anónimas
  const [allowAnonymousDonations, setAllowAnonymousDonations] = useState(true);

  // Usando el hook de autenticación
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
    
    // Cargar configuración guardada
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    const savedAllowAnonymous = localStorage.getItem('allowAnonymousDonations');
    
    if (savedPaymentMethods) {
      setPaymentMethods(JSON.parse(savedPaymentMethods));
    }
    
    if (savedAllowAnonymous) {
      setAllowAnonymousDonations(JSON.parse(savedAllowAnonymous));
    }
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      setError('Error al cargar proyectos. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedProject(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = async (project: Project) => {
    try {
      setIsLoading(true);
      if (isCreating) {
        await projectService.createProject(project);
      } else if (isEditing && selectedProject) {
        await projectService.updateProject(selectedProject.id, project);
      }
      
      setIsCreating(false);
      setIsEditing(false);
      await loadProjects();
    } catch (err) {
      setError('Error al guardar el proyecto. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await projectService.deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError('Error al eliminar el proyecto. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedProject(null);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate('/admin/login');
  };

  const saveSettings = () => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    localStorage.setItem('allowAnonymousDonations', JSON.stringify(allowAnonymousDonations));
    toast({
      title: "Configuración guardada",
      description: "La configuración se ha guardado correctamente"
    });
  };

  // Si se está editando o creando un proyecto, muestra el editor de proyectos
  if (isEditing || isCreating) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold mb-6">
            {isCreating ? 'Crear nuevo proyecto' : 'Editar proyecto'}
          </h1>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
        <ProjectEditor 
          project={isEditing ? selectedProject : null}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // Pantalla principal del dashboard
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground mr-2">
            Hola, {currentUser?.email}
          </p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="proyectos" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
          <TabsTrigger value="donaciones">Donaciones</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proyectos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gestión de Proyectos</h2>
            <Button onClick={handleCreateNew}>Crear nuevo proyecto</Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No hay proyectos disponibles. Crea tu primer proyecto.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.coverImage && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={project.coverImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Meta:</span>
                      <span className="font-medium">${project.goalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estado:</span>
                      <span className="font-medium">{project.isActive ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6 flex gap-2">
                    <Button variant="outline" className="w-full" onClick={() => handleEdit(project)}>
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleDelete(project.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="donaciones">
          <DonationStats />
        </TabsContent>
        
        <TabsContent value="configuracion">
          <h2 className="text-2xl font-semibold mb-6">Configuración de la plataforma</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Métodos de pago</CardTitle>
              <CardDescription>
                Habilita o deshabilita los métodos de pago disponibles para donaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mercadopago"
                  checked={paymentMethods.mercadopago}
                  onChange={(e) => setPaymentMethods({...paymentMethods, mercadopago: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="mercadopago">MercadoPago</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="banktransfer"
                  checked={paymentMethods.banktransfer}
                  onChange={(e) => setPaymentMethods({...paymentMethods, banktransfer: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="banktransfer">Transferencia bancaria</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cash"
                  checked={paymentMethods.cash}
                  onChange={(e) => setPaymentMethods({...paymentMethods, cash: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="cash">Efectivo</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Configuración de donaciones</CardTitle>
              <CardDescription>
                Personaliza las opciones disponibles para donantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={allowAnonymousDonations}
                  onChange={(e) => setAllowAnonymousDonations(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="anonymous">Permitir donaciones anónimas</Label>
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={saveSettings}>Guardar configuración</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 