import React from 'react';
import ScrollReveal from './ScrollReveal';

const amenitiesData = [
  {
    icon: 'fa-utensils',
    title: 'Kitchen & Dining',
    description: 'Spacious kitchen and dining facilities for your convenience',
  },
  {
    icon: 'fa-car',
    title: 'Secure Parking',
    description: 'Safe and secure parking space for your vehicles',
  },
  {
    icon: 'fa-fire',
    title: 'Campfire Evenings',
    description: 'Enjoy cozy campfire gatherings under the stars',
  },
  {
    icon: 'fa-spa',
    title: 'Ayurvedic Treatments',
    description: 'Authentic traditional Ayurvedic wellness treatments',
  },
  {
    icon: 'fa-truck-monster',
    title: 'Jeep Safari Tours',
    description: 'Exciting guided safari tours through the wilderness',
  },
  {
    icon: 'fa-paw',
    title: 'Tiger Reserve Access',
    description: 'Easy access to Periyar Tiger Reserve (4 km away)',
  },
];

const Amenities = () => {
  return (
    <section id="amenities" className="py-16 md:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h6 className="text-white font-semibold text-sm md:text-base uppercase tracking-widest mb-4">
              Amenities
            </h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-garamond">
              Premium Facilities & Services
            </h2>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              Discover the perfect blend of comfort and adventure at Woodlands
            </p>
          </div>
        </ScrollReveal>

        {/* Amenities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {amenitiesData.map((amenity, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5 md:mb-6 group-hover:bg-primary transition-colors">
                  <i className={`fas ${amenity.icon} text-2xl md:text-3xl text-primary group-hover:text-white transition-colors`}></i>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-garamond">
                  {amenity.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional Info Card */}
        <ScrollReveal delay={600}>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-garamond">
                Cultural Experiences Nearby
              </h3>
              <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                Located right opposite the <strong>Kalari Payattu and Navarasa Kathakali Centre</strong>, 
                immerse yourself in Kerala's vibrant cultural heritage
              </p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-gray-600">
                <span className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  <strong>200m</strong> from Kumily Town
                </span>
                <span className="flex items-center gap-2">
                  <i className="fas fa-bus text-primary"></i>
                  <strong>300m</strong> from Periyar Lake Bus Point
                </span>
                <span className="flex items-center gap-2">
                  <i className="fas fa-tree text-primary"></i>
                  <strong>4km</strong> from Tiger Reserve
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Amenities;
