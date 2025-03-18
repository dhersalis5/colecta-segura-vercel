import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("proyectos");
  
  const navigate = useNavigate();

  // Configuración de métodos de pago disponibles
  const [paymentMethods, setPaymentMethods] = useState({
    mercadopago: true,
    banktransfer: true,
    cash: true
  });

  // Configuración para donaciones anónimas
  const [allowAnonymousDonations, setAllowAnonymousDonations] = useState(true);

  useEffect(() => {
    loadProjects();
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
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const saveSettings = () => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    localStorage.setItem('allowAnonymousDonations', JSON.stringify(allowAnonymousDonations));
    alert('Configuración guardada correctamente');
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        {/* TAB: Proyectos */}
        <TabsContent value="proyectos">
          {isCreating || isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>{isCreating ? 'Crear nuevo proyecto' : 'Editar proyecto'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectEditor 
                  project={selectedProject} 
                  onSave={handleSave} 
                  onCancel={handleCancel} 
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleCreateNew}>Nuevo Proyecto</Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      {project.coverImage && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={project.coverImage} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="truncate">{project.title}</CardTitle>
                        <CardDescription>
                          Meta: ${project.goalAmount.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(project)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(project.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No hay proyectos</CardTitle>
                    <CardDescription>
                      Crea tu primer proyecto para comenzar a recibir donaciones.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleCreateNew}>Crear proyecto</Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* TAB: Estadísticas */}
        <TabsContent value="estadisticas">
          <DonationStats />
        </TabsContent>

        {/* TAB: Configuración */}
        <TabsContent value="configuracion">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la plataforma</CardTitle>
              <CardDescription>
                Personaliza las opciones de tu plataforma de donaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Métodos de pago */}
              <div>
                <h3 className="text-lg font-medium mb-4">Métodos de pago</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mercadopago"
                      checked={paymentMethods.mercadopago}
                      onChange={(e) => setPaymentMethods({...paymentMethods, mercadopago: e.target.checked})}
                      className="rounded text-primary"
                    />
                    <label htmlFor="mercadopago">MercadoPago</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="banktransfer"
                      checked={paymentMethods.banktransfer}
                      onChange={(e) => setPaymentMethods({...paymentMethods, banktransfer: e.target.checked})}
                      className="rounded text-primary"
                    />
                    <label htmlFor="banktransfer">Transferencia Bancaria</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cash"
                      checked={paymentMethods.cash}
                      onChange={(e) => setPaymentMethods({...paymentMethods, cash: e.target.checked})}
                      className="rounded text-primary"
                    />
                    <label htmlFor="cash">Efectivo</label>
                  </div>
                </div>
              </div>

              {/* Donaciones anónimas */}
              <div>
                <h3 className="text-lg font-medium mb-4">Opciones de donación</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={allowAnonymousDonations}
                    onChange={(e) => setAllowAnonymousDonations(e.target.checked)}
                    className="rounded text-primary"
                  />
                  <label htmlFor="anonymous">Permitir donaciones anónimas</label>
                </div>
              </div>

              {/* Email para notificaciones */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm">Email para notificaciones</label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="admin@colectasegura.org.ar" 
                  />
                </div>
              </div>

              {/* Soporte */}
              <div>
                <h3 className="text-lg font-medium mb-4">Información de soporte</h3>
                <div className="space-y-2">
                  <label htmlFor="support" className="block text-sm">Email de soporte</label>
                  <Input 
                    type="email" 
                    id="support" 
                    placeholder="soporte@colectasegura.org.ar" 
                  />
                </div>
              </div>

              <Button onClick={saveSettings}>Guardar configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 