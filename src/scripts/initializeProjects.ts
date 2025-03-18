import { supabase } from '../lib/supabase';
import { Project } from '../types/project';

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

// Adaptar los datos a Supabase
const adaptProjectToSupabase = (project: Project) => {
  // Convertir camelCase a snake_case para la base de datos
  return {
    id: project.id,
    title: project.title,
    short_description: project.shortDescription,
    full_description: project.fullDescription,
    goal_amount: project.goalAmount,
    amount_raised: project.amountRaised,
    cover_image: project.coverImage,
    additional_images: project.additionalImages || null,
    is_active: project.isActive,
    location: project.location,
    organizer_name: project.organizerName,
    contact_email: project.contactEmail,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    donors_count: project.donorsCount,
    payment_methods: project.paymentMethods || null,
    bank_info: project.bankInfo || null
  };
};

// Función para inicializar la base de datos
export const initializeProjects = async () => {
  try {
    console.log('Iniciando la carga de proyectos de demostración en Supabase...');
    
    // Primero verificamos si ya existen proyectos
    const { data: existingProjects, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error al verificar proyectos existentes:', checkError);
      return false;
    }
    
    // Si ya hay proyectos, no hacemos nada
    if (existingProjects && existingProjects.length > 0) {
      console.log('Ya existen proyectos en la base de datos. No se cargarán los proyectos de demostración.');
      return true;
    }
    
    // Preparar los proyectos para Supabase
    const supabaseProjects = DEMO_PROJECTS.map(adaptProjectToSupabase);
    
    // Insertar los proyectos en la base de datos
    const { error: insertError } = await supabase
      .from('projects')
      .insert(supabaseProjects);
    
    if (insertError) {
      console.error('Error al insertar proyectos de demostración:', insertError);
      return false;
    }
    
    console.log('¡Proyectos de demostración cargados correctamente en Supabase!');
    return true;
  } catch (error) {
    console.error('Error durante la inicialización de proyectos:', error);
    return false;
  }
};

// Ejecutar la inicialización
if (import.meta.env.PROD) {
  // En producción, ejecutar automáticamente
  console.log('Ambiente de producción detectado. Verificando proyectos...');
  initializeProjects();
}

export default initializeProjects; 