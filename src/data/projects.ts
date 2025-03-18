
export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  gallery?: string[];
  currentAmount: number;
  targetAmount: number;
  daysLeft: number;
  backers: number;
  category: string;
  featured: boolean;
  location?: string;
  organizer?: string;
  updates?: {
    date: string;
    title: string;
    content: string;
  }[];
  donationLevels?: {
    amount: number;
    title: string;
    description: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Agua Limpia para San Miguel",
    description: "Ayuda a llevar agua potable a 200 familias en una comunidad rural que actualmente no tiene acceso a este recurso básico.",
    fullDescription: `
      <p>La comunidad de San Miguel, ubicada a 4 horas de la ciudad más cercana, enfrenta una grave crisis de agua. Las 200 familias que habitan esta zona deben caminar hasta 2 kilómetros para obtener agua, la cual no siempre es potable.</p>
      
      <p>Este proyecto busca implementar un sistema de captación, purificación y distribución de agua que permita a cada hogar tener acceso directo a agua potable, mejorando significativamente su calidad de vida y reduciendo enfermedades relacionadas con el consumo de agua contaminada.</p>
      
      <p>El sistema incluirá:</p>
      <ul>
        <li>Construcción de un pozo comunitario</li>
        <li>Sistema de purificación de agua</li>
        <li>Red de distribución para llegar a cada hogar</li>
        <li>Capacitación para el mantenimiento del sistema</li>
      </ul>
      
      <p>Con tu apoyo, podemos transformar la vida de estas familias y garantizar un derecho humano básico: el acceso al agua potable.</p>
    `,
    image: "https://images.unsplash.com/photo-1581089781785-603411fa81e5?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541244451388-1df6e564d047?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560813562-fd09878b4224?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
    ],
    currentAmount: 45000,
    targetAmount: 150000,
    daysLeft: 23,
    backers: 142,
    category: "Infraestructura",
    featured: true,
    location: "San Miguel, Oaxaca",
    organizer: "Fundación Agua para Todos",
    updates: [
      {
        date: "10/05/2023",
        title: "Inicio del proyecto",
        content: "Hemos comenzado los estudios preliminares del terreno para identificar la mejor ubicación para el pozo."
      },
      {
        date: "25/06/2023",
        title: "Avance del 25%",
        content: "Se ha completado el estudio de suelo y hemos adquirido los primeros materiales para la construcción."
      }
    ],
    donationLevels: [
      {
        amount: 100,
        title: "Gotita de Agua",
        description: "Tu aporte ayuda a comprar materiales básicos para el proyecto."
      },
      {
        amount: 500,
        title: "Arroyo de Esperanza",
        description: "Contribuyes a la construcción de 5 metros de tubería para la red de distribución."
      },
      {
        amount: 1000,
        title: "Río de Vida",
        description: "Financias una parte del sistema de purificación, vital para la salud de la comunidad."
      },
      {
        amount: 5000,
        title: "Océano de Cambio",
        description: "Tu generosa donación cubre el costo de conectar a 10 familias al sistema de agua potable."
      }
    ]
  },
  {
    id: 2,
    title: "Reforestación Sierra de Guadalupe",
    description: "Proyecto para reforestar 5 hectáreas de bosque perdido por incendios forestales y crear un pulmón verde para la ciudad.",
    fullDescription: `
      <p>La Sierra de Guadalupe ha perdido más del 30% de su cobertura forestal en la última década debido a incendios, deforestación ilegal y expansión urbana. Este proyecto busca reforestar 5 hectáreas con especies nativas, creando un corredor ecológico vital para la biodiversidad local.</p>
      
      <p>Al restaurar este ecosistema, no solo recuperamos un importante pulmón verde para la ciudad, sino que también protegemos especies en peligro de extinción que dependen de este hábitat, mejoramos la captación de agua y combatimos la erosión del suelo.</p>
      
      <p>El plan incluye:</p>
      <ul>
        <li>Plantación de 5,000 árboles nativos</li>
        <li>Creación de un vivero comunitario</li>
        <li>Programa de monitoreo y cuidado por 3 años</li>
        <li>Talleres de educación ambiental para la comunidad</li>
      </ul>
      
      <p>¡Ayúdanos a devolver la vida a nuestros bosques!</p>
    `,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
    currentAmount: 85000,
    targetAmount: 120000,
    daysLeft: 15,
    backers: 230,
    category: "Medio Ambiente",
    featured: true,
    location: "Sierra de Guadalupe, Estado de México",
    organizer: "Colectivo Bosques Vivos"
  },
  {
    id: 3,
    title: "Biblioteca Comunitaria El Saber",
    description: "Creación de una biblioteca comunitaria con acceso a internet en una zona marginada para fomentar la educación y cultura.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop",
    currentAmount: 32000,
    targetAmount: 80000,
    daysLeft: 45,
    backers: 98,
    category: "Educación",
    featured: true,
    location: "Tlalnepantla, Estado de México",
    organizer: "Fundación Educando Futuros"
  },
  {
    id: 4,
    title: "Comedor Para Adultos Mayores",
    description: "Equipamiento de un comedor comunitario que proporcionará alimentación diaria a 100 adultos mayores en situación vulnerable.",
    image: "https://images.unsplash.com/photo-1536746953145-2638111eee8a?q=80&w=2070&auto=format&fit=crop",
    currentAmount: 28000,
    targetAmount: 50000,
    daysLeft: 18,
    backers: 75,
    category: "Alimentación",
    featured: false,
    location: "Ecatepec, Estado de México",
    organizer: "Fundación Mano Amiga"
  },
  {
    id: 5,
    title: "Centro de Rehabilitación Infantil",
    description: "Adquisición de equipos especializados para terapia física y rehabilitación de niños con discapacidades motrices.",
    image: "https://images.unsplash.com/photo-1561133211-76d9d29e3340?q=80&w=1964&auto=format&fit=crop",
    currentAmount: 120000,
    targetAmount: 200000,
    daysLeft: 38,
    backers: 112,
    category: "Salud",
    featured: false,
    location: "Puebla, Puebla",
    organizer: "Centro Médico Esperanza"
  },
  {
    id: 6,
    title: "Huertos Urbanos Comunitarios",
    description: "Implementación de 20 huertos urbanos en azoteas para producción de alimentos orgánicos y educación ambiental.",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=2070&auto=format&fit=crop",
    currentAmount: 18000,
    targetAmount: 40000,
    daysLeft: 29,
    backers: 63,
    category: "Medio Ambiente",
    featured: false,
    location: "Ciudad de México",
    organizer: "Colectivo Ciudad Verde"
  }
];
