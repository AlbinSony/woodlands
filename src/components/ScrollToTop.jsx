import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primaryDark text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 animate-fade-in"
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up text-lg"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
