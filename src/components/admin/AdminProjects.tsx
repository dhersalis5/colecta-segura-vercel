import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Project, Transaction } from '@/types/project';
import { projectsService, transactionsService } from '@/lib/firestore';
import ProjectFormModal from './ProjectFormModal';
import TransactionsModal from './TransactionsModal';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Cargar proyectos
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await projectsService.getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    const newProject: Partial<Project> = {
      title: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1560813562-fd09878b4224',
      currentAmount: 0,
      targetAmount: 10000,
      daysLeft: 30,
      backers: 0,
      category: 'General',
      featured: false,
      status: 'active'
    };
    
    setCurrentProject(newProject as Project);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject({...project});
    setShowProjectModal(true);
  };

  const handleViewTransactions = async (project: Project) => {
    try {
      const transactions = await transactionsService.getProjectTransactions(project.id);
      setCurrentTransactions(transactions);
      setCurrentProject(project);
      setShowTransactionsModal(true);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las transacciones",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await projectsService.deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
        toast({
          title: "Proyecto eliminado",
          description: "El proyecto ha sido eliminado correctamente",
          variant: "default",
        });
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el proyecto",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveProject = async (updatedProject: Project) => {
    try {
      if (updatedProject.id) {
        // Actualizar proyecto existente
        await projectsService.updateProject(updatedProject.id, updatedProject);
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        toast({
          title: "Proyecto actualizado",
          description: "Los cambios han sido guardados correctamente",
          variant: "default",
        });
      } else {
        // Crear nuevo proyecto
        const newProject = await projectsService.createProject(updatedProject);
        setProjects([newProject, ...projects]);
        toast({
          title: "Proyecto creado",
          description: "El nuevo proyecto ha sido creado correctamente",
          variant: "default",
        });
      }
      
      setShowProjectModal(false);
      setCurrentProject(null);
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el proyecto",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTransactionStatus = async (transactionId: string, status: Transaction['status']) => {
    try {
      await transactionsService.updateTransactionStatus(transactionId, status);
      
      // Actualizar la lista de transacciones
      setCurrentTransactions(currentTransactions.map(t => 
        t.id === transactionId ? {...t, status, updatedAt: new Date()} : t
      ));

      // Actualizar el monto del proyecto si la transacción fue aprobada
      if (status === 'approved' && currentProject) {
        const transaction = currentTransactions.find(t => t.id === transactionId);
        if (transaction) {
          const updatedProject = {
            ...currentProject,
            currentAmount: currentProject.currentAmount + transaction.amount,
            backers: currentProject.backers + 1
          };
          await projectsService.updateProject(currentProject.id, updatedProject);
          setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
        }
      }

      toast({
        title: "Transacción actualizada",
        description: `La transacción ha sido ${status === 'approved' ? 'aprobada' : 'rechazada'} correctamente`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la transacción",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Administrar Proyectos</h2>
        
        <Button onClick={handleAddProject}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Título
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Recaudado
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Meta
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Destacado
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="p-3 whitespace-nowrap">
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap max-w-[200px] truncate">
                  {project.title}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {project.category}
                </td>
                <td className="p-3 whitespace-nowrap">
                  ${project.currentAmount.toLocaleString()}
                </td>
                <td className="p-3 whitespace-nowrap">
                  ${project.targetAmount.toLocaleString()}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status === 'active' ? 'Activo' :
                     project.status === 'completed' ? 'Completado' :
                     'Cancelado'}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  {project.featured ? 'Sí' : 'No'}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTransactions(project)}
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="sr-only">Transacciones</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal para editar/crear proyecto */}
      {showProjectModal && currentProject && (
        <ProjectFormModal
          project={currentProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectModal(false);
            setCurrentProject(null);
          }}
        />
      )}

      {/* Modal para ver/aprobar transacciones */}
      {showTransactionsModal && currentProject && (
        <TransactionsModal
          project={currentProject}
          transactions={currentTransactions}
          onUpdateStatus={handleUpdateTransactionStatus}
          onClose={() => {
            setShowTransactionsModal(false);
            setCurrentProject(null);
            setCurrentTransactions([]);
          }}
        />
      )}
    </div>
  );
};

export default AdminProjects;
