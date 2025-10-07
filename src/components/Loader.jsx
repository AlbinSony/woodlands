import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the loader has already been shown in this session
    const hasShownLoader = sessionStorage.getItem('hasShownLoader');

    if (!hasShownLoader) {
      // Show loader only on initial load
      setLoading(true);
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setLoading(false);
        // Mark that loader has been shown in this session
        sessionStorage.setItem('hasShownLoader', 'true');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-pulse">
          <img 
            src="/woodlandslogo.png" 
            alt="Woodlands Logo" 
            className="h-32 md:h-40 lg:h-48 w-auto object-contain"
          />
        </div>
        
        {/* Brand Text */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary font-garamond mb-3">
            WOODLANDS
          </h1>
          <p className="text-primary/90 text-base md:text-lg tracking-widest font-medium">
            SINCE 1958
          </p>
        </div>
        
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
