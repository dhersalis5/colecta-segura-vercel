
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import AnimatedSection from '@/components/AnimatedSection';
import { Search, Filter } from 'lucide-react';
import { projects } from '@/data/projects';
import { setupScrollAnimation } from '@/utils/animation';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const categories = ['Todas', ...new Set(projects.map(project => project.category))];

  useEffect(() => {
    const observer = setupScrollAnimation();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let result = projects;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'Todas') {
      result = result.filter(project => project.category === selectedCategory);
    }
    
    setFilteredProjects(result);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="pt-24 pb-20">
        <section className="relative py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Descubre Causas
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Explora Todos los <span className="text-primary">Proyectos</span>
                </h1>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Encuentra proyectos que resuenen con tus valores y contribuye a generar un cambio positivo.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={2}>
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/60 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                  />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={3}>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-white hover:bg-gray-100 text-foreground/70'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
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
                    />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <AnimatedSection>
                  <Filter className="h-12 w-12 mx-auto mb-4 text-foreground/40" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron proyectos</h3>
                  <p className="text-foreground/60">
                    No hay proyectos que coincidan con tus criterios de búsqueda.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 text-primary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </AnimatedSection>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
