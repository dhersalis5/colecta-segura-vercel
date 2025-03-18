import { Project } from '@/types/project';

// Simulamos una base de datos con localStorage
const STORAGE_KEY = 'projects';

// Obtener todos los proyectos
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    if (!storedProjects) return [];
    return JSON.parse(storedProjects);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return [];
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const projects = await getAllProjects();
    return projects.find(project => project.id === id) || null;
  } catch (error) {
    console.error(`Error al obtener proyecto con ID ${id}:`, error);
    return null;
  }
};

// Crear un nuevo proyecto
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'amountRaised' | 'donorsCount'>): Promise<Project> => {
  try {
    const projects = await getAllProjects();
    
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amountRaised: 0,
      donorsCount: 0
    };
    
    const updatedProjects = [...projects, newProject];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    
    return newProject;
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    throw new Error("No se pudo crear el proyecto");
  }
};

// Actualizar un proyecto existente
export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    const projects = await getAllProjects();
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Proyecto con ID ${id} no encontrado`);
    }
    
    const updatedProject: Project = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    projects[projectIndex] = updatedProject;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
    return updatedProject;
  } catch (error) {
    console.error(`Error al actualizar proyecto con ID ${id}:`, error);
    throw new Error("No se pudo actualizar el proyecto");
  }
};

// Eliminar un proyecto
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const projects = await getAllProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  } catch (error) {
    console.error(`Error al eliminar proyecto con ID ${id}:`, error);
    throw new Error("No se pudo eliminar el proyecto");
  }
};

// Actualizar la cantidad recaudada de un proyecto
export const updateProjectAmount = async (id: string, amount: number, isDonor: boolean = true): Promise<Project> => {
  try {
    const projects = await getAllProjects();
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Proyecto con ID ${id} no encontrado`);
    }
    
    const project = projects[projectIndex];
    const updatedProject: Project = {
      ...project,
      amountRaised: project.amountRaised + amount,
      donorsCount: isDonor ? project.donorsCount + 1 : project.donorsCount,
      updatedAt: new Date().toISOString()
    };
    
    projects[projectIndex] = updatedProject;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
    return updatedProject;
  } catch (error) {
    console.error(`Error al actualizar monto del proyecto con ID ${id}:`, error);
    throw new Error("No se pudo actualizar el monto del proyecto");
  }
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectAmount
}; 