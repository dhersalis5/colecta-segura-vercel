
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import HowItWorks from '@/components/HowItWorks';
import { setupScrollAnimation } from '@/utils/animation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  useEffect(() => {
    // Set up scroll animations when component mounts
    const observer = setupScrollAnimation();
    
    // Clean up observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <FeaturedProjects />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
