
import React from 'react';
import { Project } from '@/data/projects';
import ProgressBar from '@/components/ProgressBar';
import { MapPin, Flag, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MercadoPagoButton from '@/components/MercadoPagoButton';

interface ProjectOverviewProps {
  project: Project;
  donationAmount: number | null;
  setDonationAmount: (amount: number) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  donationAmount, 
  setDonationAmount 
}) => {
  const percentage = Math.min(Math.round((project.currentAmount / project.targetAmount) * 100), 100);

  return (
    <div>
      <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
        {project.category}
      </span>
      
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      
      <p className="text-foreground/70 mb-6">{project.description}</p>
      
      <div className="mb-6">
        <ProgressBar
          current={project.currentAmount}
          target={project.targetAmount}
          size="lg"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-primary mb-1">
            {percentage}%
          </p>
          <p className="text-xs text-foreground/60">Completado</p>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-primary mb-1">
            {project.backers}
          </p>
          <p className="text-xs text-foreground/60">Donantes</p>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-primary mb-1">
            {project.daysLeft}
          </p>
          <p className="text-xs text-foreground/60">Días Restantes</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex items-center text-sm text-foreground/70">
          <MapPin className="h-4 w-4 mr-1 text-primary" />
          <span>{project.location || "Ubicación no especificada"}</span>
        </div>
        
        <div className="flex items-center text-sm text-foreground/70">
          <Flag className="h-4 w-4 mr-1 text-primary" />
          <span>Por: {project.organizer || "Organizador desconocido"}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Link to="#donation-section" className="flex-1 button-primary text-center py-2">
          Donar Ahora
        </Link>
        
        <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
          <Heart className="h-5 w-5 text-foreground/70" />
        </button>
        
        <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
          <Share2 className="h-5 w-5 text-foreground/70" />
        </button>
      </div>
    </div>
  );
};

export default ProjectOverview;
