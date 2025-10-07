import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { roomPricing } from '../roomData.js';
import { fetchRoomCategories } from '../services/reservationApi';

const roomsData = [
  {
    id: 1,
    name: 'Prime Deluxe Room',
    description: 'Spacious and elegantly designed rooms with modern amenities for a comfortable stay. Perfect for couples and small families seeking luxury and comfort.',
    features: [
      { icon: 'fa-expand-arrows-alt', text: '320 sq ft' },
      { icon: 'fa-bed', text: '1 King Bed' },
      { icon: 'fa-bath', text: '1 Bathroom' },
      { icon: 'fa-users', text: 'Up to 4 Guests' },
    ],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    price: `₹${roomPricing.primeDeluxe}`,
  },
  {
    id: 2,
    name: 'Economy Room',
    description: 'Cozy and affordable rooms perfect for budget-conscious travelers. Clean, comfortable, and equipped with all basic amenities for a pleasant stay.',
    features: [
      { icon: 'fa-expand-arrows-alt', text: '200 sq ft' },
      { icon: 'fa-bed', text: '2 Single Beds' },
      { icon: 'fa-bath', text: '1 Bathroom' },
      { icon: 'fa-users', text: 'Up to 3 Guests' },
    ],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    price: `₹${roomPricing.economy}`,
  },
  {
    id: 3,
    name: '5-Bedded Deluxe',
    description: 'Perfect for families and groups, with ample space and comfort. Large room with multiple beds and a spacious living area for quality time together.',
    features: [
      { icon: 'fa-expand-arrows-alt', text: '500 sq ft' },
      { icon: 'fa-bed', text: '5 Single Beds' },
      { icon: 'fa-bath', text: '2 Bathrooms' },
      { icon: 'fa-users', text: 'Up to 8 Guests' },
    ],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    price: `₹${roomPricing.fiveBedded}`,
  },
  {
    id: 4,
    name: 'Dormitory',
    description: 'Budget-friendly shared accommodation for backpackers and solo travelers. Meet fellow travelers while enjoying a comfortable and secure stay. Pricing is per person in shared dormitory.',
    features: [
      { icon: 'fa-expand-arrows-alt', text: '400 sq ft' },
      { icon: 'fa-bed', text: '8 Bunk Beds' },
      { icon: 'fa-bath', text: '2 Shared Baths' },
      { icon: 'fa-users', text: 'Up to 8 Guests' },
    ],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    price: `₹${roomPricing.dormitory}`,
  },
];

const Rooms = () => {
  const [activeRoom, setActiveRoom] = useState(0);
  const [apiRoomCategories, setApiRoomCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoomCategories = async () => {
      try {
        const response = await fetchRoomCategories();
        if (response.success) {
          setApiRoomCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to load room categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoomCategories();
  }, []);

  // Update room prices with API data if available
  const getUpdatedRoomsData = () => {
    if (!apiRoomCategories) return roomsData;

    return roomsData.map(room => {
      const apiRoom = apiRoomCategories.find(apiRoom => {
        if (room.id === 1) return apiRoom.type === 'primeDeluxe';
        if (room.id === 2) return apiRoom.type === 'economy';
        if (room.id === 3) return apiRoom.type === 'fiveBedded';
        if (room.id === 4) return apiRoom.type === 'dormitory';
        return false;
      });

      if (apiRoom) {
        return {
          ...room,
          price: `₹${apiRoom.default_price}`,
          maxCapacity: apiRoom.max_capacity
        };
      }
      return room;
    });
  };

  const displayRoomsData = getUpdatedRoomsData();

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
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto mb-6">
              Choose from our variety of accommodations designed for every type of traveler
            </p>
            

          </div>
        </ScrollReveal>

        {/* Room Tabs */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-10">
            {displayRoomsData.map((room, index) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(index)}
                className={`px-4 md:px-6 lg:px-8 py-2 md:py-2.5 font-semibold text-sm md:text-sm lg:text-base transition-all ${
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
                {displayRoomsData[activeRoom].name}
              </h3>
              
              {/* Description */}
              <p className="text-sm md:text-base text-white/90 mb-6 md:mb-8 leading-relaxed">
                {displayRoomsData[activeRoom].description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {displayRoomsData[activeRoom].features.map((feature, index) => (
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
                    {loading ? '₹...' : displayRoomsData[activeRoom].price}
                    <span className="text-base md:text-lg text-white/70 font-normal">
                      {displayRoomsData[activeRoom].name === 'Dormitory' ? '/night per head' : '/night'}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/room/${['primeDeluxe','economy','fiveBedded','dormitory'][activeRoom]}`}
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary font-semibold uppercase text-xs md:text-sm tracking-wide transition-all"
                >
                  Room Details
                  <i className="fas fa-arrow-right text-xs"></i>
                </Link>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="order-1 lg:order-2">
              <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={displayRoomsData[activeRoom].image}
                  alt={displayRoomsData[activeRoom].name}
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
