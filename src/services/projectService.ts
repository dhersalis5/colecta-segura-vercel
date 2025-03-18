import { Project } from '@/types/project';

// Simulamos una base de datos con localStorage
const STORAGE_KEY = 'projects';

// Proyectos de demostración predefinidos
const DEMO_PROJECTS: Project[] = [
  {
    id: 'project_demo_1',
    title: 'Ayuda para el Comedor Los Piletones',
    shortDescription: 'Juntar fondos para mejorar la infraestructura del comedor comunitario en Villa Soldati.',
    fullDescription: 'El comedor Los Piletones atiende diariamente a más de 200 niños y adultos mayores en situación de vulnerabilidad. Necesitamos renovar la cocina y el espacio de comedor para brindar un mejor servicio. Con tu ayuda podremos comprar nuevos electrodomésticos, mesas, sillas y realizar reparaciones urgentes en la instalación eléctrica y de gas.',
    goalAmount: 500000,
    amountRaised: 320000,
    coverImage: 'https://images.unsplash.com/photo-1509059852496-f3822ae057bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    location: 'Buenos Aires, Argentina',
    organizerName: 'Fundación Solidaria Manos Unidas',
    contactEmail: 'info@manosunidas.org.ar',
    createdAt: '2023-12-15T10:30:00Z',
    updatedAt: '2024-03-01T08:45:00Z',
    donorsCount: 48,
    bankInfo: {
      accountName: 'Fundación Solidaria Manos Unidas',
      bankName: 'Banco Nación',
      cbu: '0110012340000987654321',
      alias: 'MANOS.UNIDAS.FUND'
    }
  },
  {
    id: 'project_demo_2',
    title: 'Biblioteca Popular para La Matanza',
    shortDescription: 'Crear una biblioteca comunitaria con libros y recursos educativos para niños y jóvenes.',
    fullDescription: 'Queremos establecer un espacio de lectura y aprendizaje en uno de los barrios más vulnerables de La Matanza. El proyecto incluye la compra de libros, mobiliario, computadoras y la capacitación de voluntarios para gestionar el espacio. La biblioteca ofrecerá apoyo escolar, talleres de lectura y actividades culturales para toda la comunidad.',
    goalAmount: 350000,
    amountRaised: 115000,
    coverImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    location: 'La Matanza, Buenos Aires',
    organizerName: 'Asociación Civil Educación para Todos',
    contactEmail: 'contacto@educacionparatodos.org.ar',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-03-05T16:30:00Z',
    donorsCount: 32,
    bankInfo: {
      accountName: 'Asociación Civil Educación para Todos',
      bankName: 'Banco Provincia',
      cbu: '0140011301234567890123',
      alias: 'EDUCACION.TODOS.AC'
    }
  },
  {
    id: 'project_demo_3',
    title: 'Equipamiento para Hospital Pediátrico',
    shortDescription: 'Recaudar fondos para equipos médicos especializados para el Hospital de Niños de Córdoba.',
    fullDescription: 'El Hospital de Niños de Córdoba necesita renovar urgentemente equipamiento médico en la unidad de cuidados intensivos. Con esta campaña buscamos adquirir monitores multiparamétricos, respiradores y bombas de infusión para mejorar la atención de los niños en estado crítico. Cada donación, por pequeña que sea, nos acerca más a este objetivo que salvará vidas.',
    goalAmount: 1200000,
    amountRaised: 780000,
    coverImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    location: 'Córdoba, Argentina',
    organizerName: 'Fundación Ayuda Hospitalaria',
    contactEmail: 'fundacion@ayudahospitalaria.org.ar',
    createdAt: '2023-11-20T09:15:00Z',
    updatedAt: '2024-03-10T11:20:00Z',
    donorsCount: 126,
    bankInfo: {
      accountName: 'Fundación Ayuda Hospitalaria',
      bankName: 'Banco Santander',
      cbu: '0720053188000036729583',
      alias: 'AYUDA.HOSPITAL.FUND'
    }
  }
];

// Obtener todos los proyectos
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    
    // Si no hay proyectos guardados, devolver los de demostración
    if (!storedProjects || JSON.parse(storedProjects).length === 0) {
      // Guardar los proyectos de demostración en localStorage para futuras consultas
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PROJECTS));
      return DEMO_PROJECTS;
    }
    
    return JSON.parse(storedProjects);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    
    // En caso de error, devolver los proyectos de demostración
    return DEMO_PROJECTS;
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