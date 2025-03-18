
// Parallax effect for mouse movement
export const handleParallax = (e: React.MouseEvent<HTMLElement>, depth = 30) => {
  const { currentTarget } = e;
  const rect = currentTarget.getBoundingClientRect();
  
  // Calculate mouse position relative to the element
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Calculate percentage position
  const xPercent = x / rect.width;
  const yPercent = y / rect.height;
  
  // Calculate movement offset based on percentage position (centered at 0.5, 0.5)
  const xOffset = (xPercent - 0.5) * depth;
  const yOffset = (yPercent - 0.5) * depth;
  
  // Apply transform to elements with data-parallax attribute
  const parallaxElements = currentTarget.querySelectorAll('[data-parallax]');
  
  parallaxElements.forEach((element) => {
    const el = element as HTMLElement;
    const depth = Number(el.getAttribute('data-parallax') || 1);
    el.style.transform = `translate(${xOffset * depth}px, ${yOffset * depth}px)`;
  });
};

// Reset parallax on mouse leave
export const resetParallax = (e: React.MouseEvent<HTMLElement>) => {
  const parallaxElements = e.currentTarget.querySelectorAll('[data-parallax]');
  
  parallaxElements.forEach((element) => {
    const el = element as HTMLElement;
    el.style.transform = 'translate(0px, 0px)';
  });
};

// Scroll animation using Intersection Observer
export const setupScrollAnimation = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  // Observe all elements with the reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  return observer;
};
