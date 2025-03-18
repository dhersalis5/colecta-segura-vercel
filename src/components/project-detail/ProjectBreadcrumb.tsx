
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ProjectBreadcrumbProps {
  projectTitle: string;
}

const ProjectBreadcrumb: React.FC<ProjectBreadcrumbProps> = ({ projectTitle }) => {
  return (
    <div className="flex items-center text-sm text-foreground/60">
      <Link to="/" className="hover:text-primary transition-colors duration-300">Inicio</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link to="/projects" className="hover:text-primary transition-colors duration-300">Proyectos</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span className="text-foreground/80 font-medium truncate">{projectTitle}</span>
    </div>
  );
};

export default ProjectBreadcrumb;
