import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Fixed Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          alt="Woodlands Resort"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading with Animations */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 font-outfit leading-tight uppercase tracking-tight">
            <span className="inline-block animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Your Perfect Stay in
            </span>
            <br />
            <span className="inline-block animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              The Heart of
            </span>{' '}
            <span className="inline-block animate-fade-in-up text-primary opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              Thekkady
            </span>
          </h1>
          
          {/* Description with Animation */}
          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            Experience warm hospitality and timeless tradition since 1958
          </p>

          {/* CTA Button with Animation */}
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
            <a
              href="#about"
              className="inline-flex items-center gap-2 md:gap-3 bg-primary hover:bg-primaryDark text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base uppercase tracking-wide transition-all transform hover:scale-105 shadow-2xl"
            >
              Explore Now
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/80">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <i className="fas fa-chevron-down text-xl"></i>
        </div>
      </div>
    </section>
  );
};

export default Hero;
