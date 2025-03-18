
import React, { useState } from 'react';
import { Project } from '@/data/projects';

interface ProjectGalleryProps {
  project: Project;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  const [activeImage, setActiveImage] = useState(project.image);

  return (
    <div className="mb-4">
      <div className="rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
        <img
          src={activeImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {project.gallery && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveImage(project.image)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              activeImage === project.image ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img src={project.image} alt="" className="w-full h-full object-cover" />
          </button>
          
          {project.gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                activeImage === img ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
