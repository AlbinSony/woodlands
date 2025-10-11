import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { fetchRoomCategories } from '../services/reservationApi';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    message: '',
  });

  const [roomCategories, setRoomCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Load room categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchRoomCategories();
        if (response.success) {
          setRoomCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to load room categories:', error);
        // Fallback to static data if API fails
        setRoomCategories([
          { type: 'primeDeluxe', max_capacity: 4, default_price: 1000 },
          { type: 'economy', max_capacity: 3, default_price: 650 },
          { type: 'fiveBedded', max_capacity: 8, default_price: 1800 },
          { type: 'dormitory', max_capacity: 8, default_price: 250 }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Room type display names
  const getRoomDisplayName = (type) => {
    switch (type) {
      case 'primeDeluxe': return 'Prime Deluxe Room';
      case 'economy': return 'Economy Room';
      case 'fiveBedded': return '5-Bedded Deluxe';
      case 'dormitory': return 'Dormitory';
      default: 
        // Convert camelCase or other formats to readable names
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
    }
  };

  // Add a room to the selection
  const handleAddRoom = (roomType) => {
    const category = roomCategories.find(cat => cat.type === roomType);
    if (!category) return;

    const newRoom = {
      id: Date.now(), // Unique ID for this room selection
      type: roomType,
      count: 1,
      guests: 1,
      maxCapacity: category.max_capacity,
      price: category.default_price
    };

    setSelectedRooms([...selectedRooms, newRoom]);
  };

  // Remove a room from the selection
  const handleRemoveRoom = (roomId) => {
    setSelectedRooms(selectedRooms.filter(room => room.id !== roomId));
  };

  // Update room count
  const handleUpdateRoomCount = (roomId, count) => {
    setSelectedRooms(selectedRooms.map(room => 
      room.id === roomId ? { ...room, count: Math.max(1, count) } : room
    ));
  };

  // Update guest count
  const handleUpdateGuestCount = (roomId, guests) => {
    setSelectedRooms(selectedRooms.map(room => 
      room.id === roomId ? { ...room, guests: Math.max(1, Math.min(guests, room.maxCapacity)) } : room
    ));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return 0;

    return selectedRooms.reduce((total, room) => {
      if (room.type === 'dormitory') {
        // Dormitory: price per head per night
        return total + (nights * room.price * room.guests);
      } else {
        // Regular rooms: base price per room * number of rooms
        return total + (nights * room.price * room.count);
      }
    }, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate at least one room is selected
    if (selectedRooms.length === 0) {
      alert('Please select at least one room type');
      return;
    }

    // Handle form submission (integrate with backend or email service)
    console.log('Form submitted:', {
      ...formData,
      selectedRooms,
      totalPrice: calculateTotalPrice()
    });
    
    alert('Thank you! We will contact you shortly to confirm your booking.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      message: '',
    });
    setSelectedRooms([]);
  };

  return (
    <section id="book" className="py-16 md:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h6 className="text-white font-semibold text-sm md:text-base uppercase tracking-widest mb-4">
              Reservation
            </h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-garamond">
              Book Your Stay
            </h2>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              Fill in the details below and we'll get back to you shortly to confirm your reservation
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Booking Form */}
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Check-in & Check-out */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Room Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Room Types *
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 gap-3">
                      {loadingCategories ? (
                        <div className="text-center py-4 text-gray-500">
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Loading room types...
                        </div>
                      ) : (
                        roomCategories.map((category) => (
                          <button
                            key={category.type}
                            type="button"
                            onClick={() => handleAddRoom(category.type)}
                            className="flex items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {getRoomDisplayName(category.type)}
                              </div>
                              <div className="text-sm text-gray-600">
                                ₹{category.default_price}/{category.type === 'dormitory' ? 'night per head' : 'night'}
                                {' • '}Max: {category.max_capacity} guests
                              </div>
                            </div>
                            <div className="ml-3">
                              <i className="fas fa-plus-circle text-primary text-xl"></i>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Selected Rooms Display */}
                  {selectedRooms.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Selected Rooms:</span>
                        <span className="text-sm text-gray-500">{selectedRooms.length} type(s)</span>
                      </div>
                      {selectedRooms.map((room) => (
                        <div key={room.id} className="bg-white border-2 border-primary/20 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {getRoomDisplayName(room.type)}
                              </h4>
                              <p className="text-sm text-gray-600">
                                ₹{room.price}/{room.type === 'dormitory' ? 'night per head' : 'night'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(room.id)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <i className="fas fa-times-circle text-xl"></i>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {room.type !== 'dormitory' && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Number of Rooms
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={room.count}
                                  onChange={(e) => handleUpdateRoomCount(room.id, parseInt(e.target.value) || 1)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                                />
                              </div>
                            )}
                            <div className={room.type !== 'dormitory' ? '' : 'col-span-2'}>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                {room.type === 'dormitory' ? 'Number of Persons' : 'Guests per Room'}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max={room.maxCapacity}
                                value={room.guests}
                                onChange={(e) => handleUpdateGuestCount(room.id, parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                              />
                              <p className="text-xs text-gray-500 mt-1">Max: {room.maxCapacity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                {/* Extra Mattress Information */}
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fas fa-info-circle text-blue-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Extra Mattress Available</h4>
                      <p className="text-sm text-gray-600">
                        At the time of check-in, you can avail extra mattress by paying additional charges for extra sleeping arrangements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Price Display */}
                {selectedRooms.length > 0 && formData.checkIn && formData.checkOut && (
                  <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">Estimated Total</h4>
                        <p className="text-sm text-gray-600">
                          {Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))} night(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">₹{calculateTotalPrice().toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total Amount</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primaryDark text-white px-8 py-4 rounded-full font-medium uppercase tracking-wide transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <i className="fas fa-calendar-check"></i>
                  Book Now
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Contact Information */}
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-white text-gray-900 rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 font-garamond text-primary">
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:+919447021958"
                    className="flex items-center gap-4 hover:bg-primary/5 p-3 rounded-lg transition"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-phone text-xl text-primary"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Call Us</div>
                      <div className="font-semibold text-lg text-gray-900">+91 94470 21958</div>
                    </div>
                  </a>
                  <a
                    href="mailto:info@woodlands.com"
                    className="flex items-center gap-4 hover:bg-primary/5 p-3 rounded-lg transition"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope text-xl text-primary"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email Us</div>
                      <div className="font-semibold text-gray-900">info@woodlands.com</div>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 p-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-xl text-primary"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Visit Us</div>
                      <div className="font-semibold text-gray-900">
                        Kumily, Thekkady<br />
                        Kerala, India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Highlights */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold mb-6 font-garamond text-primary">
                  Why Choose Woodlands?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span className="text-gray-700">200m from Kumily Town Center</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span className="text-gray-700">300m from Periyar Lake Bus Point</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span className="text-gray-700">4km from Periyar Tiger Reserve</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span className="text-gray-700">Opposite Cultural Centers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span className="text-gray-700">Heritage Since 1958</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
