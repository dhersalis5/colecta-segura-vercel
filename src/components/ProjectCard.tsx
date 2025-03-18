
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  id: number | string;
  title: string;
  description: string;
  image: string;
  currentAmount: number;
  targetAmount: number;
  daysLeft: number;
  backers: number;
  category: string;
  featured?: boolean;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  image,
  currentAmount,
  targetAmount,
  daysLeft,
  backers,
  category,
  featured = false,
  className,
}) => {
  return (
    <div 
      className={cn(
        "group overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-300",
        featured ? "shadow-md hover:shadow-xl" : "shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <Link to={`/projects/${id}`}>
          <h3 className="text-lg font-semibold mb-2 transition-colors duration-300 group-hover:text-primary truncate">
            {title}
          </h3>
        </Link>
        
        <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <ProgressBar 
          current={currentAmount}
          target={targetAmount}
          size="md"
          showPercentage={false}
        />

        <div className="flex items-center justify-between mt-4 text-xs text-foreground/60">
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>{backers} contribuciones</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{daysLeft} días restantes</span>
          </div>

          <div className="flex items-center">
            <Heart className="h-3.5 w-3.5 mr-1 text-primary" />
            <span>Favorito</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
