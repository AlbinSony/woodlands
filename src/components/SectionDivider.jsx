import React from 'react';

const SectionDivider = ({ variant = 'wave', fromColor = 'red', toColor = 'white' }) => {
  // Determine background and fill colors based on transition
  const isRedToWhite = fromColor === 'red' && toColor === 'white';
  const bgClass = isRedToWhite ? 'bg-primary' : 'bg-white';
  const fillClass = isRedToWhite ? 'fill-white' : 'fill-primary';
  const dotBgBase = isRedToWhite ? 'bg-white' : 'bg-primary';
  const lineBgBase = isRedToWhite ? 'bg-white' : 'bg-primary';
  
  if (variant === 'wave') {
    return (
      <div className={`relative h-16 md:h-24 ${bgClass} overflow-hidden`}>
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className={fillClass}
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className={fillClass}
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className={fillClass}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`relative h-16 md:h-20 ${bgClass} flex items-center justify-center overflow-hidden`}>
        <div className="flex gap-2 md:gap-3">
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotBgBase}/30`}></div>
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotBgBase}/50`}></div>
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotBgBase}/70`}></div>
          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${dotBgBase}`}></div>
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotBgBase}/70`}></div>
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotBgBase}/50`}></div>
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dotBgBase}/30`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'line') {
    const lineGradient = isRedToWhite 
      ? 'bg-gradient-to-r from-transparent via-white to-white/50'
      : 'bg-gradient-to-r from-transparent via-primary to-primary/50';
    const lineGradientReverse = isRedToWhite
      ? 'bg-gradient-to-l from-transparent via-white to-white/50'
      : 'bg-gradient-to-l from-transparent via-primary to-primary/50';
    const circleBg = isRedToWhite ? 'bg-white/20' : 'bg-primary/20';
    const circleInner = isRedToWhite ? 'bg-white' : 'bg-primary';
    
    return (
      <div className={`relative h-12 md:h-16 ${bgClass} flex items-center justify-center`}>
        <div className="w-full max-w-7xl px-4 md:px-8 flex items-center gap-4">
          <div className={`flex-1 h-px ${lineGradient}`}></div>
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${circleBg} flex items-center justify-center`}>
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${circleInner}`}></div>
          </div>
          <div className={`flex-1 h-px ${lineGradientReverse}`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'zigzag') {
    return (
      <div className={`relative h-12 md:h-16 ${bgClass} overflow-hidden`}>
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="0,0 0,60 50,30 100,60 150,30 200,60 250,30 300,60 350,30 400,60 450,30 500,60 550,30 600,60 650,30 700,60 750,30 800,60 850,30 900,60 950,30 1000,60 1050,30 1100,60 1150,30 1200,60 1200,0"
            className={fillClass}
          />
        </svg>
      </div>
    );
  }

  // Default - simple gradient
  return (
    <div className={`h-16 md:h-20 ${isRedToWhite ? 'bg-gradient-to-b from-primary to-white' : 'bg-gradient-to-b from-white to-primary'}`}></div>
  );
};

export default SectionDivider;
