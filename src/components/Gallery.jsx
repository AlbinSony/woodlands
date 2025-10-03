import React from 'react';
import ScrollReveal from './ScrollReveal';

const galleryImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
];

const Gallery = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fab fa-instagram text-2xl text-primary"></i>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-garamond">
                Follow Us
              </h2>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              Instagram - @woodlands_thekkady
            </p>
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryImages.map((image, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div className="relative group overflow-hidden rounded-xl aspect-square shadow-lg hover:shadow-2xl transition-all duration-300">
                <img
                  src={image}
                  alt={`Woodlands Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <i className="fab fa-instagram text-white text-4xl"></i>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Follow Button */}
        <ScrollReveal delay={300}>
          <div className="text-center mt-12">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium uppercase tracking-wide transition-all transform hover:scale-105 shadow-xl"
            >
              <i className="fab fa-instagram text-xl"></i>
              Follow on Instagram
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Gallery;
