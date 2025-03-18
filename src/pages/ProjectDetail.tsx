
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { projects } from '@/data/projects';
import { setupScrollAnimation } from '@/utils/animation';
import ProjectGallery from '@/components/project-detail/ProjectGallery';
import ProjectOverview from '@/components/project-detail/ProjectOverview';
import ProjectTabs from '@/components/project-detail/ProjectTabs';
import DonationSection from '@/components/project-detail/DonationSection';
import ProjectBreadcrumb from '@/components/project-detail/ProjectBreadcrumb';
import ProjectNotFound from '@/components/project-detail/ProjectNotFound';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState(projects.find(p => p.id.toString() === id));
  const [donationAmount, setDonationAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!project) return;
    
    const observer = setupScrollAnimation();
    return () => observer.disconnect();
  }, [project]);

  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 py-4">
          <ProjectBreadcrumb projectTitle={project.title} />
        </div>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatedSection>
                <ProjectGallery project={project} />
              </AnimatedSection>

              <AnimatedSection delay={2}>
                <ProjectOverview 
                  project={project} 
                  donationAmount={donationAmount}
                  setDonationAmount={setDonationAmount}
                />
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-8 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProjectTabs project={project} />
              </div>

              <DonationSection 
                project={project} 
                donationAmount={donationAmount}
                setDonationAmount={setDonationAmount}
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
