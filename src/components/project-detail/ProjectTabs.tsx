
import React, { useState } from 'react';
import { Project } from '@/data/projects';
import AnimatedSection from '@/components/AnimatedSection';

interface ProjectTabsProps {
  project: Project;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('descripción');

  return (
    <AnimatedSection>
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {["descripción", "actualizaciones", "donantes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap capitalize transition-colors duration-300 ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="prose max-w-none">
        {activeTab === "descripción" && (
          <div dangerouslySetInnerHTML={{ __html: project.fullDescription || project.description }} />
        )}
        
        {activeTab === "actualizaciones" && (
          <div>
            {project.updates && project.updates.length > 0 ? (
              <div className="space-y-6">
                {project.updates.map((update, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{update.title}</h3>
                      <span className="text-xs text-foreground/60">{update.date}</span>
                    </div>
                    <p className="text-foreground/70">{update.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/60 py-4">
                Aún no hay actualizaciones para este proyecto.
              </p>
            )}
          </div>
        )}
        
        {activeTab === "donantes" && (
          <div>
            <p className="text-foreground/60 py-4">
              Este proyecto cuenta con el apoyo de {project.backers} donantes.
            </p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default ProjectTabs;
