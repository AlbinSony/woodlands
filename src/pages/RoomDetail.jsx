import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollReveal from "../components/ScrollReveal";

// Dummy data for demonstration
const roomDetails = {
  primeDeluxe: {
    id: "primeDeluxe",
    name: "Prime Deluxe Room",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80"
    ],
    description:
      "Spacious and elegantly designed rooms with modern amenities for a comfortable stay. Perfect for couples and small families seeking luxury and comfort. Enjoy beautiful views and premium facilities.",
    amenities: [
      "Air Conditioning",
      "Free Wi-Fi",
      "Room Service",
      "Mini Fridge",
      "Balcony",
      "Flat-screen TV"
    ],
    price: "₹3,500/night",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking. Pets not allowed. Cancellation policy applies.",
  },
  economy: {
    id: "economy",
    name: "Economy Room",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&q=80"
    ],
    description:
      "Cozy and affordable rooms perfect for budget-conscious travelers. Clean, comfortable, and equipped with all basic amenities for a pleasant stay.",
    amenities: [
      "Ceiling Fan",
      "Free Wi-Fi",
      "Room Service",
      "Shared Balcony"
    ],
    price: "₹1,500/night",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking. Pets not allowed. Cancellation policy applies.",
  },
  fiveBedded: {
    id: "fiveBedded",
    name: "5-Bedded Deluxe",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80"
    ],
    description:
      "Perfect for families and groups, with ample space and comfort. Large room with multiple beds and a spacious living area for quality time together.",
    amenities: [
      "Air Conditioning",
      "Free Wi-Fi",
      "Room Service",
      "Living Area",
      "Balcony"
    ],
    price: "₹6,000/night",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking. Pets not allowed. Cancellation policy applies.",
  },
  dormitory: {
    id: "dormitory",
    name: "Dormitory",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80"
    ],
    description:
      "Budget-friendly shared accommodation for backpackers and solo travelers. Meet fellow travelers while enjoying a comfortable and secure stay.",
    amenities: [
      "Shared Bathroom",
      "Free Wi-Fi",
      "Lockers",
      "Common Area"
    ],
    price: "₹500/night",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking. Pets not allowed. Cancellation policy applies.",
  },
};

// Dummy calendar and booking logic
const RoomDetail = ({ roomType = "primeDeluxe" }) => {
  const room = roomDetails[roomType] || roomDetails.primeDeluxe;
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomType]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Room Heading */}
          <ScrollReveal>
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-garamond mb-4">
                {room.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold text-primary font-garamond">
                  {room.price}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Images Gallery */}
          <ScrollReveal>
            <div className="mb-8 md:mb-12">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl mb-4">
                <img 
                  src={room.images[selectedImage]} 
                  alt={room.name + " image " + (selectedImage + 1)} 
                  className="w-full h-64 md:h-96 lg:h-[500px] object-cover" 
                />
              </div>
              {/* Thumbnail Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {room.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all hover:scale-105 ${
                      selectedImage === idx ? 'ring-4 ring-primary' : ''
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={room.name + " thumbnail " + (idx + 1)} 
                      className="w-full h-24 md:h-32 object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Book Now Button - Scrolls to booking section */}
          <ScrollReveal delay={100}>
            <div className="mb-12 md:mb-16 text-center">
              <button 
                onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white px-10 py-4 rounded-full font-bold uppercase text-sm tracking-wider shadow-lg hover:bg-primaryDark hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <i className="fas fa-calendar-check"></i>
                Book Now
              </button>
            </div>
          </ScrollReveal>

          {/* Room Info */}
          <ScrollReveal delay={200}>
            <div className="mb-12 md:mb-16">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
                {room.description}
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-garamond mb-6">
                  Room Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {room.amenities.map((am, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-primary"></i>
                      </div>
                      <span className="text-gray-900 font-medium">{am}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Calendar & Booking */}
          <ScrollReveal delay={300}>
            <div id="booking-section" className="mb-12 md:mb-16 bg-white border-2 border-primary/20 rounded-2xl p-6 md:p-8 shadow-xl scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-garamond mb-6">
                Book Your Stay
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    defaultValue="2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                  />
                </div>
              </div>
              <button className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-full font-bold uppercase text-sm tracking-wider shadow-lg hover:bg-primaryDark hover:shadow-xl transition-all">
                <i className="fas fa-calendar-check mr-2"></i>
                Book Now
              </button>
            </div>
          </ScrollReveal>

          {/* Terms & Conditions */}
          <ScrollReveal delay={400}>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-garamond mb-4">
                Terms & Conditions
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border-l-4 border-primary">
                <p className="text-gray-700 leading-relaxed">
                  {room.terms}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default RoomDetail;
