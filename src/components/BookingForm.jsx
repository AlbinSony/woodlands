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
    guests: '1',
    roomType: 'primeDeluxe',
    message: '',
  });

  const [roomCategories, setRoomCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load room categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchRoomCategories();
        if (response.success) {
          setRoomCategories(response.data);
          // Set first available category as default
          if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, roomType: response.data[0].type }));
          }
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
      case 'dormitoryLg': return 'Dormitory Large';
      case 'dormitorySm': return 'Dormitory Small';
      default: 
        // Convert camelCase or other formats to readable names
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (integrate with backend or email service)
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you shortly to confirm your booking.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: '1',
      roomType: roomCategories.length > 0 ? roomCategories[0].type : 'primeDeluxe',
      message: '',
    });
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

                {/* Room Type & Guests */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      required
                      disabled={loadingCategories}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {loadingCategories ? (
                        <option value="">Loading room types...</option>
                      ) : (
                        roomCategories.map((category) => (
                          <option key={category.type} value={category.type}>
                            {getRoomDisplayName(category.type)} - ₹{category.default_price}/night
                            {category.type === 'dormitory' ? ' (per head)' : ''}
                            {' '}(Max: {category.max_capacity} guests)
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                      Guests *
                    </label>
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
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
