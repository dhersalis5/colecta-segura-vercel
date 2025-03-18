
import React from 'react';
import { Search, Heart, CreditCard, CheckCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Explora Proyectos',
      description: 'Navega por diferentes causas verificadas y encuentra aquellas que te inspiren.',
      delay: 1,
    },
    {
      icon: Heart,
      title: 'Elige Tu Causa',
      description: 'Selecciona el proyecto que más te motive y decide cuánto quieres contribuir.',
      delay: 2,
    },
    {
      icon: CreditCard,
      title: 'Dona Seguro',
      description: 'Realiza tu aportación de manera fácil y segura a través de MercadoPago.',
      delay: 3,
    },
    {
      icon: CheckCircle,
      title: 'Genera Impacto',
      description: 'Recibe actualizaciones sobre cómo tu apoyo está generando cambios positivos.',
      delay: 1,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
              Proceso Simple
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo <span className="text-primary">Funciona</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              En cuatro simples pasos puedes ser parte de algo grande y generar un impacto significativo.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <AnimatedSection 
              key={index} 
              className="glass-card p-6 rounded-xl text-center"
              delay={step.delay as 1 | 2 | 3}
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-foreground/70 text-sm">
                {step.description}
              </p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Link to="/how-it-works" className="button-primary inline-flex items-center">
            Saber Más
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowItWorks;
