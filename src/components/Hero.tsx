
import React, { useEffect, useRef } from 'react';
import { handleParallax, resetParallax } from '@/utils/animation';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      const heroElement = heroRef.current;
      const parallaxItems = heroElement.querySelectorAll('[data-scroll-parallax]');
      
      parallaxItems.forEach(item => {
        const el = item as HTMLElement;
        const speed = Number(el.getAttribute('data-scroll-parallax') || 0);
        const yPos = -(scrollPosition * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleParallax}
      onMouseLeave={resetParallax}
    >
      {/* Background Layers */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" 
        style={{ zIndex: -3 }}
      ></div>
      
      <div
        className="absolute w-full h-full"
        data-scroll-parallax="0.2"
        style={{ zIndex: -2 }}
      >
        <div className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-primary/5" data-parallax="0.8"></div>
        <div className="absolute bottom-[20%] left-[10%] w-40 h-40 rounded-full bg-secondary/10" data-parallax="0.6"></div>
        <div className="absolute top-[40%] left-[20%] w-20 h-20 rounded-full bg-accent/20" data-parallax="1.2"></div>
        <div className="absolute bottom-[35%] right-[25%] w-32 h-32 rounded-full bg-primary/10" data-parallax="1"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground animate-fade-in" data-parallax="0.2">
            Plataforma de microdonaciones seguras
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight animate-fade-in"
            style={{ animationDelay: '0.2s' }}
            data-parallax="0.1"
          >
            Impulsa <span className="text-primary">cambios reales</span> con pequeñas acciones
          </h1>
          
          <p 
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.4s' }}
            data-parallax="0.3"
          >
            Conectamos personas con causas que importan a través de microdonaciones 
            transparentes y de alto impacto.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: '0.6s' }}
            data-parallax="0.4"
          >
            <Link to="/projects" className="button-primary">
              Explorar Proyectos
            </Link>
            <Link to="/how-it-works" className="glass-button px-5 py-2.5 rounded-full">
              Cómo Funciona
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div 
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform" 
        style={{ zIndex: 0 }}
        data-scroll-parallax="0.1"
      >
        <svg 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-[100px] md:h-[150px]"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
