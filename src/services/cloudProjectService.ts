import { Project } from '@/types/project';
import { supabase } from '@/lib/supabase';

// Nombre de la tabla en Supabase
const TABLE_NAME = 'projects';

// Obtener todos los proyectos
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    // Fallback a localStorage en caso de error
    return getProjectsFromLocalStorage();
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error(`Error al obtener proyecto con ID ${id}:`, error);
    return null;
  }
};

// Crear un nuevo proyecto
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'amountRaised' | 'donorsCount'>): Promise<Project> => {
  try {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      amountRaised: 0,
      donorsCount: 0
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newProject])
      .select()
      .single();
    
    if (error) throw error;
    
    // También guardar en localStorage como respaldo
    saveProjectToLocalStorage(newProject);
    
    return data || newProject;
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    // Si falla Supabase, intentar guardar solo en localStorage
    return saveProjectToLocalStorage(projectData as any);
  }
};

// Actualizar un proyecto existente
export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    const now = new Date().toISOString();
    const updatedData = {
      ...projectData,
      updatedAt: now
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // También actualizar en localStorage como respaldo
    updateProjectInLocalStorage(id, updatedData);
    
    return data;
  } catch (error) {
    console.error(`Error al actualizar proyecto con ID ${id}:`, error);
    // Si falla Supabase, intentar actualizar solo en localStorage
    return updateProjectInLocalStorage(id, projectData);
  }
};

// Eliminar un proyecto
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // También eliminar de localStorage
    deleteProjectFromLocalStorage(id);
  } catch (error) {
    console.error(`Error al eliminar proyecto con ID ${id}:`, error);
    // Si falla Supabase, intentar eliminar solo de localStorage
    deleteProjectFromLocalStorage(id);
  }
};

// Actualizar la cantidad recaudada de un proyecto
export const updateProjectAmount = async (id: string, amount: number, isDonor: boolean = true): Promise<Project> => {
  try {
    // Primero obtenemos el proyecto actual
    const { data: project, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    if (!project) throw new Error(`Proyecto con ID ${id} no encontrado`);
    
    const now = new Date().toISOString();
    const updates = {
      amountRaised: project.amountRaised + amount,
      donorsCount: isDonor ? project.donorsCount + 1 : project.donorsCount,
      updatedAt: now
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // También actualizar en localStorage
    const projectToUpdate = { ...project, ...updates };
    updateProjectInLocalStorage(id, projectToUpdate);
    
    return data;
  } catch (error) {
    console.error(`Error al actualizar monto del proyecto con ID ${id}:`, error);
    // Si falla Supabase, intentar actualizar solo en localStorage
    return updateProjectAmountInLocalStorage(id, amount, isDonor);
  }
};

// Funciones auxiliares para manejar localStorage como fallback
const STORAGE_KEY = 'projects';

const getProjectsFromLocalStorage = (): Project[] => {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    if (!storedProjects) return [];
    return JSON.parse(storedProjects);
  } catch (error) {
    console.error("Error al obtener proyectos desde localStorage:", error);
    return [];
  }
};

const saveProjectToLocalStorage = (project: Project): Project => {
  try {
    const projects = getProjectsFromLocalStorage();
    const updatedProjects = [...projects, project];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    return project;
  } catch (error) {
    console.error("Error al guardar proyecto en localStorage:", error);
    throw new Error("No se pudo crear el proyecto");
  }
};

const updateProjectInLocalStorage = (id: string, projectData: Partial<Project>): Project => {
  try {
    const projects = getProjectsFromLocalStorage();
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Proyecto con ID ${id} no encontrado en localStorage`);
    }
    
    const updatedProject: Project = {
      ...projects[projectIndex],
      ...projectData,
    };
    
    projects[projectIndex] = updatedProject;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
    return updatedProject;
  } catch (error) {
    console.error(`Error al actualizar proyecto en localStorage:`, error);
    throw new Error("No se pudo actualizar el proyecto");
  }
};

const deleteProjectFromLocalStorage = (id: string): void => {
  try {
    const projects = getProjectsFromLocalStorage();
    const filteredProjects = projects.filter(project => project.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  } catch (error) {
    console.error(`Error al eliminar proyecto de localStorage:`, error);
    throw new Error("No se pudo eliminar el proyecto");
  }
};

const updateProjectAmountInLocalStorage = (id: string, amount: number, isDonor: boolean = true): Promise<Project> => {
  try {
    const projects = getProjectsFromLocalStorage();
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Proyecto con ID ${id} no encontrado en localStorage`);
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
    
    return Promise.resolve(updatedProject);
  } catch (error) {
    console.error(`Error al actualizar monto del proyecto en localStorage:`, error);
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