
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { setupScrollAnimation } from '@/utils/animation';
import { 
  Heart, Users, ArrowUpRight, CheckCircle, 
  BarChart3, Lock, Search, Smile 
} from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    const observer = setupScrollAnimation();
    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: 'María Rodríguez',
      role: 'Fundadora & CEO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop',
      bio: 'Con más de 10 años de experiencia en el sector social, María ha dedicado su carrera a conectar causas importantes con personas que quieren generar cambio.',
    },
    {
      name: 'Carlos Mendoza',
      role: 'Director de Tecnología',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2149&auto=format&fit=crop',
      bio: 'Ingeniero informático especializado en plataformas seguras de procesamiento de pagos, con pasión por la tecnología al servicio del impacto social.',
    },
    {
      name: 'Diana Ortiz',
      role: 'Directora de Impacto Social',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      bio: 'Socióloga dedicada a identificar y medir el impacto de proyectos sociales, asegurando que cada aporte genere el máximo valor posible.',
    },
    {
      name: 'Javier López',
      role: 'Director de Operaciones',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
      bio: 'Experto en logística y operaciones con amplia experiencia en el tercer sector, asegurando la eficiencia en cada proceso de la plataforma.',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compromiso',
      description: 'Nos dedicamos completamente a cada proyecto y a los donantes que confían en nosotros.'
    },
    {
      icon: CheckCircle,
      title: 'Transparencia',
      description: 'Compartimos información clara sobre cada donación y su impacto, sin excepciones.'
    },
    {
      icon: Lock,
      title: 'Seguridad',
      description: 'Protegemos cada transacción y dato personal con los más altos estándares de seguridad.'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Creemos en el poder colectivo para generar cambios significativos y duraderos.'
    },
    {
      icon: BarChart3,
      title: 'Impacto',
      description: 'Medimos y maximizamos el efecto positivo de cada donación en las comunidades.'
    },
    {
      icon: Smile,
      title: 'Empatía',
      description: 'Entendemos las necesidades tanto de donantes como de beneficiarios.'
    },
  ];

  const stats = [
    { value: '250+', label: 'Proyectos financiados' },
    { value: '15,000+', label: 'Donantes activos' },
    { value: '$2.5M+', label: 'Fondos recaudados' },
    { value: '35+', label: 'Comunidades beneficiadas' },
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-3xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Nuestra Historia
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Conoce <span className="text-primary">ColectaSegura</span>
                </h1>
                <p className="text-foreground/70 mb-6">
                  Somos una plataforma dedicada a conectar personas con causas que importan,
                  facilitando donaciones seguras y transparentes para proyectos de alto impacto.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection>
                <div className="glass-card p-8 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
                  <p className="text-foreground/70 mb-4">
                    Facilitar la conexión entre personas comprometidas y proyectos de impacto social,
                    a través de una plataforma transparente y segura que maximice el efecto de cada donación.
                  </p>
                  <p className="text-foreground/70">
                    Buscamos democratizar la filantropía, demostrando que pequeñas acciones
                    colectivas pueden generar cambios significativos en nuestra sociedad.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={2}>
                <div className="glass-card p-8 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
                  <p className="text-foreground/70 mb-4">
                    Aspiramos a crear un mundo donde cualquier persona pueda contribuir
                    fácilmente a causas que le apasionen, con total confianza en que su aporte
                    generará un impacto real y medible.
                  </p>
                  <p className="text-foreground/70">
                    Visualizamos una sociedad donde la colaboración y la microfilantropia
                    sean elementos cotidianos que impulsen el desarrollo comunitario.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                    Nuestros Inicios
                  </span>
                  <h2 className="text-3xl font-bold mb-4">
                    Una Historia de <span className="text-primary">Propósito</span>
                  </h2>
                  <p className="text-foreground/70 mb-4">
                    ColectaSegura nació en 2018 cuando nuestra fundadora, María Rodríguez, 
                    después de años trabajando en el sector social, identificó dos problemas críticos:
                    la dificultad de organizaciones pequeñas para acceder a fondos y la desconfianza
                    de potenciales donantes por falta de transparencia.
                  </p>
                  <p className="text-foreground/70 mb-4">
                    Inspirada por el poder de la tecnología para conectar personas, María reunió a un 
                    equipo de profesionales comprometidos con el cambio social para crear una plataforma
                    que facilitara donaciones seguras, transparentes y de alto impacto.
                  </p>
                  <p className="text-foreground/70">
                    Desde nuestro lanzamiento, hemos facilitado más de 2.5 millones de pesos en
                    donaciones, financiado más de 250 proyectos y construido una comunidad de más
                    de 15,000 donantes activos que confían en nosotros para canalizar su apoyo.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={2}>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                    alt="Equipo ColectaSegura" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Nuestro Impacto
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  Números que <span className="text-primary">Inspiran</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Cada cifra representa historias de cambio y transformación positiva
                  en comunidades que lo necesitan.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <AnimatedSection 
                  key={index} 
                  delay={(index % 3 + 1) as 1 | 2 | 3}
                  className="glass-card p-6 rounded-xl text-center"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-foreground/70 text-sm">{stat.label}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Principios Rectores
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  Nuestros <span className="text-primary">Valores</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Estos son los principios que guían cada decisión y acción en ColectaSegura.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <AnimatedSection 
                  key={index} 
                  delay={(index % 3 + 1) as 1 | 2 | 3}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-foreground/70 text-sm">
                    {value.description}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Las Personas Detrás
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  Nuestro <span className="text-primary">Equipo</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Un grupo diverso y apasionado de profesionales comprometidos con el cambio social.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedSection 
                  key={index} 
                  delay={(index % 3 + 1) as 1 | 2 | 3}
                >
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-primary text-sm mb-3">{member.role}</p>
                      <p className="text-foreground/70 text-sm">{member.bio}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Únete a Nuestro Movimiento</h2>
                <p className="mb-8 text-white/80">
                  Sé parte de una comunidad que está transformando la forma en que las personas apoyan causas importantes.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/projects" className="inline-flex items-center px-6 py-3 bg-white text-primary font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Ver Proyectos
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                  <a href="/contact" className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300">
                    Contactar al Equipo
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
