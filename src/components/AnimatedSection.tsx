
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 1,
  direction = 'up',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const getAnimationClass = () => {
    switch (direction) {
      case 'up':
        return 'reveal';
      case 'down':
        return 'reveal transform translate-y-[-20px]';
      case 'left':
        return 'reveal transform translate-x-[20px]';
      case 'right':
        return 'reveal transform translate-x-[-20px]';
      default:
        return 'reveal';
    }
  };

  return (
    <div
      ref={sectionRef}
      className={cn(
        getAnimationClass(),
        `reveal-delay-${delay}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
