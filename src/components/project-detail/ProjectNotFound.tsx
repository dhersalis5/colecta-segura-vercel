
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const ProjectNotFound: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-40 text-center">
        <h2 className="text-2xl font-bold mb-4">Proyecto no encontrado</h2>
        <p className="mb-8">El proyecto que buscas no existe o ha sido removido.</p>
        <Link to="/projects" className="button-primary">
          Ver todos los proyectos
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectNotFound;
