import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const roomsData = [
  {
    id: 1,
    name: 'Prime Deluxe Room',
    description: 'Spacious and elegantly designed rooms with modern amenities for a comfortable stay. Perfect for couples and small families seeking luxury and comfort.',
    features: [
      { icon: 'fa-bed', text: '80m2' },
      { icon: 'fa-user-group', text: '4 beds' },
      { icon: 'fa-bath', text: '2 baths' },
      { icon: 'fa-users', text: '6 guests' },
    ],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    price: '₹3,500',
  },
  {
    id: 2,
    name: 'Economy Room',
    description: 'Cozy and affordable rooms perfect for budget-conscious travelers. Clean, comfortable, and equipped with all basic amenities for a pleasant stay.',
    features: [
      { icon: 'fa-bed', text: '40m2' },
      { icon: 'fa-user-group', text: '2 beds' },
      { icon: 'fa-bath', text: '1 bath' },
      { icon: 'fa-users', text: '3 guests' },
    ],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    price: '₹1,500',
  },
  {
    id: 3,
    name: '5-Bedded Deluxe',
    description: 'Perfect for families and groups, with ample space and comfort. Large room with multiple beds and a spacious living area for quality time together.',
    features: [
      { icon: 'fa-bed', text: '120m2' },
      { icon: 'fa-user-group', text: '5 beds' },
      { icon: 'fa-bath', text: '2 baths' },
      { icon: 'fa-users', text: '8 guests' },
    ],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    price: '₹6,000',
  },
  {
    id: 4,
    name: 'Dormitory',
    description: 'Budget-friendly shared accommodation for backpackers and solo travelers. Meet fellow travelers while enjoying a comfortable and secure stay.',
    features: [
      { icon: 'fa-bed', text: '60m2' },
      { icon: 'fa-user-group', text: '8 beds' },
      { icon: 'fa-bath', text: '2 baths' },
      { icon: 'fa-users', text: '8 guests' },
    ],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    price: '₹500',
  },
];

const Rooms = () => {
  const [activeRoom, setActiveRoom] = useState(0);

  return (
    <section id="rooms" className="py-12 md:py-16 lg:py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-8 md:mb-12">
            <h6 className="text-white font-semibold text-xs md:text-sm uppercase tracking-widest mb-3">
              Explore
            </h6>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 font-garamond">
              A Place That Fits You
            </h2>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Choose from our variety of accommodations designed for every type of traveler
            </p>
          </div>
        </ScrollReveal>

        {/* Room Tabs */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-10">
            {roomsData.map((room, index) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(index)}
                className={`px-4 md:px-6 lg:px-8 py-2 md:py-2.5 font-semibold text-xs md:text-sm lg:text-base transition-all ${
                  activeRoom === index
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white/90'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Active Room Display - Side by Side Layout */}
        <ScrollReveal delay={200}>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Content */}
            <div className="order-2 lg:order-1">
              {/* Title */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 font-garamond">
                {roomsData[activeRoom].name}
              </h3>
              
              {/* Description */}
              <p className="text-sm md:text-base text-white/90 mb-6 md:mb-8 leading-relaxed">
                {roomsData[activeRoom].description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {roomsData[activeRoom].features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${feature.icon} text-white text-sm md:text-base`}></i>
                    </div>
                    <span className="text-white/90 font-medium text-sm md:text-base">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4 md:pt-6 border-t border-white/20">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white font-garamond">
                    {roomsData[activeRoom].price}
                    <span className="text-base md:text-lg text-white/70 font-normal">/night</span>
                  </div>
                </div>
                <a
                  href="#book"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary font-semibold uppercase text-xs md:text-sm tracking-wide transition-all"
                >
                  Room Details
                  <i className="fas fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="order-1 lg:order-2">
              <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={roomsData[activeRoom].image}
                  alt={roomsData[activeRoom].name}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Rooms;
