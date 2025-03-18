
import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import AnimatedSection from './AnimatedSection';
import { ChevronRight } from 'lucide-react';
import { projects } from '@/data/projects';

const FeaturedProjects: React.FC = () => {
  // Get up to 3 featured projects
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
              Proyectos Destacados
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Causas que necesitan tu <span className="text-primary">apoyo</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Descubre proyectos verificados y transparentes donde cada peso cuenta.
              Tu contribución, por pequeña que sea, genera un gran impacto.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <AnimatedSection key={project.id} delay={(index % 3 + 1) as 1 | 2 | 3}>
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                currentAmount={project.currentAmount}
                targetAmount={project.targetAmount}
                daysLeft={project.daysLeft}
                backers={project.backers}
                category={project.category}
                featured={true}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="text-center">
            <Link
              to="/projects"
              className="inline-flex items-center text-primary font-medium hover:underline transition-all duration-300"
            >
              Ver todos los proyectos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedProjects;
