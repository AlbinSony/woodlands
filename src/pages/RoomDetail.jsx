import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollReveal from "../components/ScrollReveal";
import { roomPricing } from "../roomData.js";
import { checkRoomAvailability, fetchRoomCategories } from '../services/reservationApi';

// Room details data using centralized pricing
const roomDetails = {
  primeDeluxe: {
    id: "primeDeluxe",
    name: "Prime Deluxe Room",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
    ],
    description:
      "Experience luxury and comfort in our Prime Deluxe Room. Spacious and elegantly designed with modern amenities, this room is perfect for couples and small families seeking a premium stay. Enjoy beautiful views, comfortable bedding, and top-notch facilities that make your stay memorable.",
    amenities: [
      "Air Conditioning",
      "Free High-Speed Wi-Fi",
      "24/7 Room Service",
      "Mini Refrigerator",
      "Private Balcony with View",
      "LED Smart TV with Cable",
      "Complimentary Breakfast",
      "Daily Housekeeping",
      "Wardrobe & Storage",
      "Premium Bedding & Linens",
      "Intercom Facility",
      "Hot & Cold Water"
    ],
    capacity: "Accommodates up to 4 guests",
    size: "Spacious 80m² room with modern furnishing",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking inside rooms. Prior approval required for pets. 24-hour cancellation policy applies. Extra charges for additional services.",
  },
  economy: {
    id: "economy",
    name: "Economy Room",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"
    ],
    description:
      "Our Economy Room offers comfortable and affordable accommodation for budget-conscious travelers. Clean, well-maintained, and equipped with essential amenities for a pleasant stay. Perfect for solo travelers, couples, or small families looking for value for money.",
    amenities: [
      "Ceiling Fan or AC (on request)",
      "Free Wi-Fi",
      "Room Service (limited hours)",
      "Shared/Private Balcony",
      "Basic TV with Local Channels",
      "Daily Housekeeping",
      "Wardrobe & Storage Space",
      "Clean Bed Linens",
      "Hot & Cold Water",
      "Intercom Facility"
    ],
    capacity: "Accommodates up to 3 guests",
    size: "Cozy 40m² room with essential facilities",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking inside rooms. Pets not allowed. 24-hour cancellation policy applies. Extra charges for additional services.",
  },
  fiveBedded: {
    id: "fiveBedded",
    name: "5-Bedded Deluxe Room",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
    ],
    description:
      "Ideal for large families and groups, our 5-Bedded Deluxe Room provides ample space and comfort for everyone. Featuring multiple beds, a spacious living area, and premium amenities, this room ensures a comfortable stay for groups while maintaining privacy and convenience.",
    amenities: [
      "Air Conditioning",
      "Free High-Speed Wi-Fi",
      "24/7 Room Service",
      "Spacious Living Area",
      "Multiple Balconies",
      "LED Smart TV with Cable",
      "Mini Refrigerator",
      "Complimentary Breakfast",
      "Daily Housekeeping",
      "Multiple Wardrobes",
      "Separate Seating Area",
      "Hot & Cold Water",
      "Intercom Facility",
      "Extra Storage Space"
    ],
    capacity: "Accommodates up to 8 guests comfortably",
    size: "Spacious 120m² room with 5 comfortable beds",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking inside rooms. Prior approval required for pets. 24-hour cancellation policy applies. Group bookings require advance payment.",
  },
  dormitory: {
    id: "dormitory",
    name: "Dormitory (Per Head)",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
    ],
    description:
      "Budget-friendly shared accommodation perfect for backpackers, solo travelers, and groups looking for affordable lodging. Our dormitory provides a safe, clean, and social environment where you can meet fellow travelers while enjoying basic comfort and security.",
    amenities: [
      "Shared Air Conditioning",
      "Free Wi-Fi",
      "Shared Bathroom Facilities",
      "Personal Storage Lockers",
      "Common Recreation Area",
      "Shared Kitchen Access",
      "Daily Cleaning",
      "Security Lockers",
      "Hot & Cold Water",
      "Common TV Area",
      "Reading Lights",
      "Power Outlets near beds"
    ],
    capacity: "8 beds in shared dormitory",
    size: "60m² shared space with individual bed allocation",
    terms:
      "Check-in: 2:00 PM | Check-out: 11:00 AM. No smoking in dormitory. Alcohol not permitted in shared areas. Quiet hours: 10 PM - 7 AM. Personal belongings security is guest's responsibility.",
  },
};

// Booking calculation function
const calcTotal = (checkIn, checkOut, guests, mattresses, roomId, selectedRoom = null, roomCount = 1) => {
  if (!checkIn || !checkOut) return 0;
  
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return 0;
  
  // Use API price if available, otherwise use local pricing
  const basePrice = selectedRoom?.price || roomPricing[roomId];
  let total = 0;
  
  if (roomId === "dormitory" || roomId === "dormitoryLg" || roomId === "dormitorySm") {
    // Dormitory: price per head per night
    total = nights * basePrice * guests;
  } else {
    // Regular rooms: base price per room * number of rooms + extra mattress cost
    total = nights * basePrice * roomCount + nights * mattresses * (roomPricing.extraMattress || 250);
  }
  
  return total;
};

// Room detail component with booking calculation
const RoomDetail = ({ roomType = "primeDeluxe" }) => {
  const room = roomDetails[roomType] || roomDetails.primeDeluxe;
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Booking state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [mattresses, setMattresses] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // API integration states
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomCount, setSelectedRoomCount] = useState(1);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [apiCategories, setApiCategories] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomType]);

  // Load room categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchRoomCategories();
        if (response.success) {
          setApiCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Check availability when dates change
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return;
    
    setAvailabilityLoading(true);
    try {
      const response = await checkRoomAvailability(checkIn, checkOut, room.id);
      
      if (response.success) {
        // If API returns empty array but success=true, it means rooms are available
        // Create fallback room objects when no specific data is returned
        if (response.data.length === 0) {
          // Create fallback available rooms based on room type
          const fallbackRooms = Array.from({length: 5}, (_, i) => ({
            id: `${room.id}_${i + 1}`,
            price: roomPricing[room.id] || 1000,
            props: {
              name: room.name,
              max_capacity: room.id === 'dormitory' ? 8 : (room.id === 'fiveBedded' ? 5 : 2),
              add_ons: []
            }
          }));
          setAvailableRooms(fallbackRooms);
          setSelectedRoom(fallbackRooms[0]);
        } else {
          // Use actual API data when available
          setAvailableRooms(response.data);
          if (response.data.length > 0) {
            setSelectedRoom(response.data[0]); // Auto-select first available room
          }
        }
        setAvailabilityChecked(true);
      } else {
        // Only when success=false, treat as no rooms available
        setAvailableRooms([]);
        setAvailabilityChecked(true);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      // On error, also treat as no rooms available
      setAvailableRooms([]);
      setAvailabilityChecked(true);
    } finally {
      setAvailabilityLoading(false);
    }
  };
  
  // Calculate total price when booking details change
  useEffect(() => {
    const total = calcTotal(checkIn, checkOut, guests, mattresses, room.id, selectedRoom, selectedRoomCount);
    setTotalPrice(total);
  }, [checkIn, checkOut, guests, mattresses, room.id, selectedRoom, selectedRoomCount]);

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-2xl md:text-3xl font-bold text-primary font-garamond block">
                    ₹{roomPricing[room.id]}{room.id === 'dormitory' ? '/night per head' : '/night'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-1">Capacity</span>
                  <span className="text-lg font-semibold text-gray-900">{room.capacity}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-1">Room Size</span>
                  <span className="text-lg font-semibold text-gray-900">{room.size}</span>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                
                {/* Extra Mattress Information */}
                {room.id !== 'dormitory' && (
                  <div className="bg-white border-2 border-primary/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <i className="fas fa-plus text-primary"></i>
                      </div>
                      <div>
                        <span className="text-gray-900 font-semibold">Extra Mattress Available</span>
                        <p className="text-sm text-gray-600">Additional sleeping arrangements at ₹{roomPricing.extraMattress}/night per mattress</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Calendar & Booking */}
          <ScrollReveal delay={300}>
            <div id="booking-section" className="mb-12 md:mb-16 bg-white border-2 border-primary/20 rounded-2xl p-6 md:p-8 shadow-xl scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-garamond mb-6">
                Book Your Stay
              </h2>
              
              <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          setAvailabilityChecked(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => {
                          setCheckOut(e.target.value);
                          setAvailabilityChecked(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {room.id === 'dormitory' ? 'Number of Persons' : 'Guests'}
                      </label>
                      <input 
                        type="number" 
                        min="0" 
                        max={room.id === 'dormitory' ? "8" : "10"} 
                        value={guests}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === '0') {
                            setGuests(0);
                          } else {
                            setGuests(parseInt(value) || 0);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                      />
                    </div>
                  </div>

                  {/* Check Availability Button */}
                  <div className="mb-6">
                    <button 
                      onClick={checkAvailability}
                      disabled={!checkIn || !checkOut || availabilityLoading}
                      className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wider shadow-lg hover:bg-primaryDark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      {availabilityLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Checking Availability...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search mr-2"></i>
                          Check Availability
                        </>
                      )}
                    </button>
                  </div>

                  {/* Available Rooms Display */}
                  {availabilityChecked && (
                    <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                      {availableRooms.length === 0 ? (
                        <div className="text-center py-8">
                          <i className="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
                          <p className="text-gray-600">No rooms available for selected dates</p>
                          <p className="text-sm text-gray-500">Please try different dates</p>
                        </div>
                      ) : (
                        <div className="bg-white border-2 border-primary/20 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-bed text-primary text-lg"></i>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {availableRooms[0]?.props?.name || room.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {availableRooms.length} room(s) available | Max {availableRooms[0]?.props?.max_capacity || 2} guests per room
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">₹{availableRooms[0]?.price || roomPricing[room.id]}</div>
                              <div className="text-sm text-gray-600">per night per room</div>
                            </div>
                          </div>
                          
                          {/* Room Selection */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Rooms</label>
                              <select 
                                value={selectedRoomCount}
                                onChange={(e) => {
                                  const roomCount = parseInt(e.target.value);
                                  setSelectedRoomCount(roomCount);
                                  if (roomCount > 0 && availableRooms[0]) {
                                    setSelectedRoom({...availableRooms[0], roomCount});
                                  }
                                }}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                              >
                                {Array.from({length: Math.min(availableRooms.length, 5)}, (_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1} Room{i > 0 ? 's' : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Available Add-ons */}
                            {availableRooms[0]?.props?.add_ons && availableRooms[0].props.add_ons.length > 0 && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Add-ons</label>
                                <div className="space-y-2">
                                  {availableRooms[0].props.add_ons.map((addon, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                      <span className="text-sm font-medium">{addon.name}</span>
                                      <span className="text-sm text-primary font-semibold">+₹{addon.price}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Extra mattress option for non-dormitory rooms */}
                  {room.id !== 'dormitory' && (
                    <div className="mb-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-bed text-primary text-lg"></i>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">Add Extra Mattress</h4>
                            <p className="text-sm text-gray-600">Additional comfortable sleeping arrangements</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">₹{roomPricing.extraMattress}</span>
                          <p className="text-sm text-gray-600">per night each</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Extra Mattresses</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="3" 
                            value={mattresses}
                            onChange={(e) => setMattresses(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="w-full">
                            <p className="text-xs text-gray-600 mb-2">Features:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• High-quality comfortable mattress</li>
                              <li>• Fresh bed sheets & pillows included</li>
                              <li>• Daily linen change available</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Total Price Display */}
                  {checkIn && checkOut && totalPrice > 0 && (
                    <div className="mb-6 p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">Total Cost</h4>
                          <p className="text-sm text-gray-600">
                            {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} night(s)
                            {['dormitory', 'dormitoryLg', 'dormitorySm'].includes(room.id) ? ` × ${guests} person(s)` : ` × ${selectedRoomCount} room(s)`}
                            {mattresses > 0 && !['dormitory', 'dormitoryLg', 'dormitorySm'].includes(room.id) ? ` + ${mattresses} extra mattress(es)` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₹{calcTotal(checkIn, checkOut, guests, mattresses, room.id, selectedRoom, selectedRoomCount).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Amount</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-full font-bold uppercase text-sm tracking-wider shadow-lg hover:bg-primaryDark hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={availabilityChecked && availableRooms.length === 0}
                  >
                    <i className="fas fa-calendar-check mr-2"></i>
                    {availabilityChecked && availableRooms.length === 0 ? 'No Rooms Available' : 'Book Now'}
                  </button>
                </div>
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
