
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { setupScrollAnimation } from '@/utils/animation';
import { 
  Search, Heart, CreditCard, CheckCircle, 
  Shield, Eye, BarChart3, Zap, HelpCircle 
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  useEffect(() => {
    const observer = setupScrollAnimation();
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: Search,
      title: 'Explora Proyectos',
      description: 'Navega a través de diversas causas verificadas y encuentra aquellas con las que te identificas.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    },
    {
      icon: Heart,
      title: 'Elige Tu Causa',
      description: 'Selecciona el proyecto que más resuene contigo y decide cuánto quieres aportar.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop',
    },
    {
      icon: CreditCard,
      title: 'Realiza Tu Donación',
      description: 'Utiliza nuestro sistema seguro respaldado por MercadoPago para completar tu aportación.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop',
    },
    {
      icon: CheckCircle,
      title: 'Recibe Actualizaciones',
      description: 'Mantente informado sobre el avance y el impacto de los proyectos que has apoyado.',
      image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  const faqs = [
    {
      question: '¿Cómo puedo saber si un proyecto es legítimo?',
      answer: 'Todos los proyectos en ColectaSegura pasan por un riguroso proceso de verificación antes de ser publicados. Verificamos la identidad de los organizadores, la documentación legal de las organizaciones y la viabilidad del proyecto. Además, monitoreamos el uso de los fondos para garantizar que se destinan al propósito indicado.'
    },
    {
      question: '¿Cuánto de mi donación se destina realmente al proyecto?',
      answer: 'El 92% de tu donación va directamente al proyecto seleccionado. El 8% restante se utiliza para mantener la plataforma, cubrir los costos de procesamiento de pagos y financiar nuestras operaciones de verificación y seguimiento.'
    },
    {
      question: '¿Puedo donar de forma anónima?',
      answer: 'Sí, durante el proceso de donación puedes seleccionar la opción de "Donación Anónima" y tu nombre no se mostrará públicamente en la lista de donantes.'
    },
    {
      question: '¿Qué sucede si un proyecto no alcanza su meta?',
      answer: 'Los fondos recaudados se entregan al proyecto incluso si no alcanza su meta total, siempre y cuando haya logrado al menos el 60% de su objetivo. Si el proyecto recauda menos del 60%, se contacta a los donantes para decidir si desean que su donación sea redirigida a otro proyecto similar o si prefieren un reembolso.'
    },
    {
      question: '¿Puedo obtener un recibo deducible de impuestos?',
      answer: 'Sí, para proyectos gestionados por organizaciones sin fines de lucro oficialmente registradas, emitimos recibos deducibles de impuestos que puedes descargar desde tu perfil una vez completada la donación.'
    },
    {
      question: '¿Cómo se garantiza la seguridad de mis datos de pago?',
      answer: 'Utilizamos MercadoPago como nuestro procesador de pagos, lo que garantiza que tus datos financieros están protegidos con los más altos estándares de seguridad. No almacenamos información de tarjetas de crédito en nuestros servidores.'
    }
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
                  Proceso Simple
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Cómo Funciona <span className="text-primary">ColectaSegura</span>
                </h1>
                <p className="text-foreground/70 mb-6">
                  Descubre cómo nuestra plataforma conecta donantes con proyectos
                  de impacto social, asegurando transparencia y eficiencia en cada paso del proceso.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {steps.map((step, index) => (
              <AnimatedSection key={index} className="mb-16 last:mb-0">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Paso {index + 1}: {step.title}</h2>
                    </div>
                    <p className="text-foreground/70 mb-6 text-lg">
                      {step.description}
                    </p>
                    <div className="pl-16">
                      <div className="glass-card p-4 rounded-lg">
                        <h3 className="font-medium mb-2">¿Por qué es importante?</h3>
                        <p className="text-sm text-foreground/70">
                          {index === 0 && "Explorar te permite conocer distintas causas y conectarte con aquellas que más te motivan, maximizando el impacto de tu donación."}
                          {index === 1 && "Tu elección consciente dirige recursos a causas que realmente necesitan apoyo, creando una cultura de donación responsable."}
                          {index === 2 && "Un sistema de pago confiable garantiza que tu aportación llegue a su destino, protegiendo tanto a donantes como a beneficiarios."}
                          {index === 3 && "Las actualizaciones regulares te mantienen conectado con el proyecto y te permiten ver el impacto tangible de tu contribución."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-md">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Ventajas
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  Por Qué Elegir <span className="text-primary">ColectaSegura</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Nuestra plataforma ha sido diseñada pensando tanto en donantes como en organizaciones,
                  ofreciendo una experiencia segura, transparente y eficiente.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedSection delay={1} className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seguridad Garantizada</h3>
                <p className="text-foreground/70 text-sm">
                  Protegemos cada transacción con la más avanzada tecnología de encriptación y verificamos la identidad de todos los organizadores.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={2} className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Total Transparencia</h3>
                <p className="text-foreground/70 text-sm">
                  Seguimiento detallado del uso de fondos y actualizaciones regulares que te muestran exactamente cómo se utiliza tu donación.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={3} className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Impacto Medible</h3>
                <p className="text-foreground/70 text-sm">
                  Cada proyecto cuenta con métricas claras de impacto, permitiéndote ver y cuantificar la diferencia que generan tus aportes.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={1} className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proceso Simplificado</h3>
                <p className="text-foreground/70 text-sm">
                  Interfaz intuitiva y proceso de donación optimizado que te permite contribuir en menos de dos minutos, desde cualquier dispositivo.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Preguntas Frecuentes
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  Resolvemos Tus <span className="text-primary">Dudas</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Encuentra respuestas a las preguntas más comunes sobre cómo funciona
                  nuestra plataforma, donaciones y seguridad.
                </p>
              </div>
            </AnimatedSection>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <AnimatedSection 
                  key={index} 
                  delay={(index % 3 + 1) as 1 | 2 | 3}
                  className="mb-4 last:mb-0"
                >
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 text-primary">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-foreground/70 text-sm">{faq.answer}</p>
                      </div>
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
                <h2 className="text-3xl font-bold mb-4">¿Listo para hacer la diferencia?</h2>
                <p className="mb-8 text-white/80">
                  Únete a miles de personas que ya están generando impacto positivo a través de microdonaciones seguras.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/projects" className="px-6 py-3 bg-white text-primary font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Explorar Proyectos
                  </a>
                  <a href="/contact" className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300">
                    Contáctanos
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

export default HowItWorks;
