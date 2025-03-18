
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Image as ImageIcon,
  Calendar
} from 'lucide-react';
import { projects as initialProjects, Project } from '@/data/projects';
import ProjectFormModal from './ProjectFormModal';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleAddProject = () => {
    // Crear un proyecto vacío con valores por defecto
    const newProject: Project = {
      id: Date.now(), // Generar un ID único
      title: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1560813562-fd09878b4224',
      currentAmount: 0,
      targetAmount: 10000,
      daysLeft: 30,
      backers: 0,
      category: 'General',
      featured: false
    };
    
    setCurrentProject(newProject);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject({...project});
    setShowModal(true);
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      setProjects(projects.filter(project => project.id !== id));
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado correctamente",
        variant: "default",
      });
    }
  };

  const handleSaveProject = (updatedProject: Project) => {
    if (projects.some(p => p.id === updatedProject.id)) {
      // Actualizar proyecto existente
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      toast({
        title: "Proyecto actualizado",
        description: "Los cambios han sido guardados correctamente",
        variant: "default",
      });
    } else {
      // Agregar nuevo proyecto
      setProjects([...projects, updatedProject]);
      toast({
        title: "Proyecto creado",
        description: "El nuevo proyecto ha sido creado correctamente",
        variant: "default",
      });
    }
    
    setShowModal(false);
    setCurrentProject(null);
  };

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
                Días Restantes
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
                  {project.daysLeft}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {project.featured ? 'Sí' : 'No'}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="flex space-x-2">
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
                      onClick={() => handleDeleteProject(project.id as number)}
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
      {showModal && currentProject && (
        <ProjectFormModal
          project={currentProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowModal(false);
            setCurrentProject(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProjects;
