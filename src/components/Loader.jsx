import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-garamond mb-2 animate-pulse">
            WOODLANDS
          </h1>
          <p className="text-white/80 text-sm md:text-base tracking-widest">
            SINCE 1958
          </p>
        </div>
        
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
