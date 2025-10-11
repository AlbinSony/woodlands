import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollReveal from "../components/ScrollReveal";
import { roomPricing } from "../roomData.js";
import { checkRoomAvailability, fetchRoomCategories, holdRooms, cancelHold, createPaymentOrder, confirmBooking } from '../services/reservationApi';
import jsPDF from 'jspdf';

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
      "Check-in: Any time | Check-out: 12:00 PM (Noon). No smoking inside rooms. Prior approval required for pets. 24-hour cancellation policy applies. Extra charges for additional services.",
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
      "Check-in: Any time | Check-out: 12:00 PM (Noon). No smoking inside rooms. Pets not allowed. 24-hour cancellation policy applies. Extra charges for additional services.",
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
      "Check-in: Any time | Check-out: 12:00 PM (Noon). No smoking inside rooms. Prior approval required for pets. 24-hour cancellation policy applies. Group bookings require advance payment.",
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
      "Check-in: Any time | Check-out: 12:00 PM (Noon). No smoking in dormitory. Alcohol not permitted in shared areas. Quiet hours: 10 PM - 7 AM. Personal belongings security is guest's responsibility.",
  },
};

// Booking calculation function
const calcTotal = (checkIn, checkOut, guests, roomId, selectedRoom = null, roomCount = 1) => {
  if (!checkIn || !checkOut) return 0;
  
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return 0;
  
  // Use API price if available, otherwise use local pricing
  const basePrice = selectedRoom?.price || roomPricing[roomId];
  let total = 0;
  
  // Check if it's a dormitory type room (per person pricing)
  if (roomId === "dormitory") {
    // Dormitory: price per head per night
    total = nights * basePrice * guests;
  } else {
    // Regular rooms: base price per room * number of rooms
    total = nights * basePrice * roomCount;
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
  const [totalPrice, setTotalPrice] = useState(0);
  
  // API integration states
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomCount, setSelectedRoomCount] = useState(1);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [apiCategories, setApiCategories] = useState(null);
  
  // Hold management states (silent - no UI display)
  const [holdData, setHoldData] = useState(null);
  const [holdLoading, setHoldLoading] = useState(false);
  const [holdExpiry, setHoldExpiry] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Payment result states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [bookingIds, setBookingIds] = useState([]);
  const [paymentError, setPaymentError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Generate and download booking voucher PDF
  const downloadBookingVoucher = () => {
    const doc = new jsPDF();
    
    // Add Woodlands logo (text-based since we don't have image URL)
    doc.setFontSize(24);
    doc.setTextColor(30, 86, 49); // Primary color
    doc.text('WOODLANDS RESORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Kumily, Thekkady, Kerala, India', 105, 28, { align: 'center' });
    doc.text('Phone: +91 94479 90411 | Email: info@woodlands.com', 105, 34, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(30, 86, 49);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(30, 86, 49);
    doc.text('BOOKING VOUCHER', 105, 52, { align: 'center' });
    
    // Booking Reference
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Booking Reference:', 20, 65);
    doc.setFont(undefined, 'bold');
    const bookingRef = bookingIds.map(id => `#${id}`).join(', ');
    doc.text(bookingRef, 70, 65);
    
    // Booking Date
    doc.setFont(undefined, 'normal');
    doc.text('Booking Date:', 20, 73);
    doc.setFont(undefined, 'bold');
    doc.text(new Date().toLocaleDateString(), 70, 73);
    
    // Guest Details Section
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 86, 49);
    doc.text('Guest Information', 20, 88);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${guestInfo.name}`, 20, 98);
    doc.text(`Email: ${guestInfo.email}`, 20, 106);
    doc.text(`Phone: ${guestInfo.phone}`, 20, 114);
    
    // Booking Details Section
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 86, 49);
    doc.text('Booking Details', 20, 130);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Room Type: ${room.name}`, 20, 140);
    doc.text(`Check-in Date: ${new Date(checkIn).toLocaleDateString('en-GB')}`, 20, 148);
    doc.text(`Check-out Date: ${new Date(checkOut).toLocaleDateString('en-GB')}`, 20, 156);
    
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    doc.text(`Number of Nights: ${nights}`, 20, 164);
    doc.text(`Number of Rooms: ${selectedRoomCount}`, 20, 172);
    doc.text(`Number of Guests: ${guests}`, 20, 180);
    
    // Payment Details Section
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 86, 49);
    doc.text('Payment Details', 20, 196);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const pricePerNight = selectedRoom?.price || roomPricing[room.id];
    if (room.id === 'dormitory') {
      doc.text(`Price per Night (per person): ₹${pricePerNight}`, 20, 206);
      doc.text(`Calculation: ${nights} nights × ${guests} persons × ₹${pricePerNight}`, 20, 214);
    } else {
      doc.text(`Price per Night (per room): ₹${pricePerNight}`, 20, 206);
      doc.text(`Calculation: ${nights} nights × ${selectedRoomCount} rooms × ₹${pricePerNight}`, 20, 214);
    }
    
    // Total Amount Box
    doc.setFillColor(30, 86, 49);
    doc.rect(20, 222, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(13);
    doc.text('Total Amount Paid:', 25, 230);
    doc.text(`₹${totalPrice.toLocaleString()}`, 160, 230);
    
    // Terms & Conditions
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 86, 49);
    doc.text('Important Information', 20, 246);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('• Check-in Time: Any time | Check-out Time: 12:00 PM (Noon)', 20, 254);
    doc.text('• Valid photo ID is required at check-in', 20, 260);
    doc.text('• Please present this voucher at the time of check-in', 20, 266);
    doc.text('• For any queries, contact us at +91 94479 90411', 20, 272);
    
    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, 280, 190, 280);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Woodlands Resort. We look forward to hosting you!', 105, 286, { align: 'center' });
    
    // Save the PDF
    const fileName = `Woodlands_Booking_${bookingIds[0]}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomType]);

  // Cleanup: Cancel hold when component unmounts (silent)
  useEffect(() => {
    return () => {
      if (holdData?.hold_group_id) {
        // Cancel hold on unmount silently
        cancelHold(holdData.hold_group_id)
          .then(() => console.log('🔓 Hold cancelled on unmount (silent)'))
          .catch(err => console.error('Failed to cancel hold on unmount:', err));
      }
    };
  }, [holdData]);

  // Hold expiry timer (silent - runs in background)
  useEffect(() => {
    if (holdExpiry) {
      const timer = setInterval(() => {
        const now = new Date();
        const expiry = new Date(holdExpiry);
        const diff = expiry - now;
        
        if (diff <= 0) {
          // Hold expired silently
          console.warn('⏰ Hold expired (silent)');
          setHoldData(null);
          setHoldExpiry(null);
          setTimeRemaining(null);
          clearInterval(timer);
        } else {
          // Calculate remaining time (for console logging only)
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [holdExpiry]);

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
      // Don't pass type parameter - get all available rooms and filter client-side
      const response = await checkRoomAvailability(checkIn, checkOut);
      
      console.log('=== AVAILABILITY CHECK DEBUG ===');
      console.log('Looking for room type:', room.id);
      console.log('Full API Response:', response);
      console.log('Available categories from API:', response.data?.map(r => ({ category: r.category, availableCount: r.availableCount })));
      console.log('===============================');
      
      if (response.success && response.data && response.data.length > 0) {
        // Direct mapping for exact matches
        let matchedCategory = response.data.find(
          item => item.category === room.id || item.props?.type === room.id
        );
        
        console.log('Matched Category:', matchedCategory);
        
        if (matchedCategory && matchedCategory.availableCount > 0) {
          // Set available rooms data from API
          setAvailableRooms([matchedCategory]);
          setSelectedRoom(matchedCategory);
          setSelectedRoomCount(1); // Reset to 1 room
          setAvailabilityChecked(true);
          console.log('✓ Rooms available:', matchedCategory.availableCount);
        } else {
          // No rooms available for this category
          console.warn('✗ No matching category found or availableCount is 0');
          if (room.id === 'fiveBedded') {
            console.error('⚠️ BACKEND BUG: The /availability endpoint does not return "fiveBedded" category!');
            console.error('⚠️ FIX: Update your backend /reservations/availability endpoint to include "fiveBedded" rooms');
          }
          setAvailableRooms([]);
          setSelectedRoom(null);
          setAvailabilityChecked(true);
        }
      } else {
        // No rooms available
        console.warn('✗ API returned no data or success=false');
        setAvailableRooms([]);
        setSelectedRoom(null);
        setAvailabilityChecked(true);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      // On error, treat as no rooms available
      setAvailableRooms([]);
      setSelectedRoom(null);
      setAvailabilityChecked(true);
    } finally {
      setAvailabilityLoading(false);
    }
  };
  
  // Calculate total price when booking details change
  useEffect(() => {
    const total = calcTotal(checkIn, checkOut, guests, room.id, selectedRoom, selectedRoomCount);
    setTotalPrice(total);
  }, [checkIn, checkOut, guests, room.id, selectedRoom, selectedRoomCount]);

  // Handle room hold (silent - runs in background)
  const handleHoldRooms = async () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      alert('Please check availability first');
      return;
    }
    
    setHoldLoading(true);
    
    try {
      const roomRequests = [{
        category: selectedRoom.category,
        count: selectedRoomCount
      }];
      
      console.log('🔒 Holding rooms silently:', { roomRequests, checkIn, checkOut });
      
      const response = await holdRooms(roomRequests, checkIn, checkOut);
      
      if (response.success && response.data) {
        setHoldData(response.data);
        setHoldExpiry(response.data.expires_at);
        console.log('✓ Rooms held successfully (silent):', response.data);
        console.log('Hold will expire at:', new Date(response.data.expires_at).toLocaleString());
        
        // Open booking confirmation modal
        setShowBookingModal(true);
      } else {
        alert('Unable to reserve rooms. Please try again.');
      }
    } catch (error) {
      console.error('Failed to hold rooms:', error);
      alert('Unable to reserve rooms. Please try again.');
    } finally {
      setHoldLoading(false);
    }
  };

  // Handle cancel hold (silent - runs in background)
  const handleCancelHold = async () => {
    if (!holdData?.hold_group_id) return;
    
    try {
      const response = await cancelHold(holdData.hold_group_id);
      
      if (response.success) {
        setHoldData(null);
        setHoldExpiry(null);
        setTimeRemaining(null);
        console.log('🔓 Hold cancelled successfully (silent)');
      }
    } catch (error) {
      console.error('Failed to cancel hold:', error);
    }
  };

  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    // Validate guest information
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      alert('Please fill in all guest details');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(guestInfo.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setPaymentLoading(true);

    try {
      console.log('Creating payment order...');
      
      const response = await createPaymentOrder(
        holdData.hold_group_id,
        guestInfo.name,
        guestInfo.email,
        guestInfo.phone
      );

      if (response.success && response.data) {
        console.log('✓ Payment order created:', response.data);
        
        // Initialize Razorpay
        openRazorpayCheckout(response.data);
      } else {
        alert('Failed to create payment order. Please try again.');
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error('Failed to create payment order:', error);
      alert('Failed to create payment order. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Open Razorpay Checkout
  const openRazorpayCheckout = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Use environment variable
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      name: 'Woodlands Resort',
      description: `${room.name} - ${selectedRoomCount} Room(s)`,
      order_id: orderData.id,
      prefill: {
        name: guestInfo.name,
        email: guestInfo.email,
        contact: guestInfo.phone,
      },
      notes: orderData.notes,
      theme: {
        color: '#1e5631', // Primary color
      },
      handler: async function (response) {
        // Payment successful
        console.log('✓ Payment successful:', response);
        await handlePaymentSuccess(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          // Payment modal closed without payment
          console.log('Payment cancelled by user');
          setPaymentLoading(false);
          handlePaymentFailure('Payment cancelled by user');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', function (response) {
      // Payment failed
      console.error('✗ Payment failed:', response.error);
      handlePaymentFailure(response.error.description || 'Payment failed');
    });

    razorpay.open();
  };

  // Handle payment success
  const handlePaymentSuccess = async (razorpayPaymentId) => {
    setShowBookingModal(false);
    setProcessingPayment(true);
    
    try {
      console.log('Confirming booking...');
      
      const response = await confirmBooking(
        holdData.hold_group_id,
        razorpayPaymentId
      );

      if (response.success && response.bookingIds) {
        console.log('✓ Booking confirmed:', response.bookingIds);
        
        // Store booking IDs and show success modal
        setBookingIds(response.bookingIds);
        setProcessingPayment(false);
        setShowSuccessModal(true);
        setPaymentLoading(false);
        
        // Clear hold data as booking is confirmed
        setHoldData(null);
        setHoldExpiry(null);
      } else {
        throw new Error('Failed to confirm booking');
      }
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      setProcessingPayment(false);
      handlePaymentFailure('Payment successful but booking confirmation failed. Please contact support.');
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (errorMessage) => {
    setPaymentError(errorMessage);
    setShowBookingModal(false);
    setProcessingPayment(false);
    setShowFailureModal(true);
    setPaymentLoading(false);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomType]);

  // Cleanup: Cancel hold when component unmounts (silent)
  useEffect(() => {
    return () => {
      if (holdData?.hold_group_id) {
        // Cancel hold on unmount silently
        cancelHold(holdData.hold_group_id)
          .then(() => console.log('🔓 Hold cancelled on unmount (silent)'))
          .catch(err => console.error('Failed to cancel hold on unmount:', err));
      }
    };
  }, [holdData]);

  // Hold expiry timer (silent - runs in background)
  useEffect(() => {
    if (holdExpiry) {
      const timer = setInterval(() => {
        const now = new Date();
        const expiry = new Date(holdExpiry);
        const diff = expiry - now;
        
        if (diff <= 0) {
          // Hold expired silently
          console.warn('⏰ Hold expired (silent)');
          setHoldData(null);
          setHoldExpiry(null);
          setTimeRemaining(null);
          clearInterval(timer);
        } else {
          // Calculate remaining time (for console logging only)
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [holdExpiry]);

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
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 mb-6">
                  {room.amenities.map((am, idx) => (
                    <li 
                      key={idx} 
                      className="text-gray-700 text-sm flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{am}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Extra Mattress Information */}
                {room.id !== 'dormitory' && (
                  <div className="bg-white border-2 border-primary/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-info-circle text-primary"></i>
                      </div>
                      <div>
                        <span className="text-gray-900 font-semibold block mb-1">Additional Services Available</span>
                        <p className="text-sm text-gray-600">At the time of check-in, you can avail extra mattress/bed and other add-ons by paying the applicable charges for additional sleeping arrangements.</p>
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
                          // Cancel existing hold if dates change
                          if (holdData) {
                            handleCancelHold();
                          }
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
                          // Cancel existing hold if dates change
                          if (holdData) {
                            handleCancelHold();
                          }
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
                        min="1" 
                        max={selectedRoom?.props?.max_capacity || (room.id === 'dormitory' ? "28" : "10")} 
                        value={guests}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          const maxCapacity = selectedRoom?.props?.max_capacity || (room.id === 'dormitory' ? 28 : 10);
                          setGuests(Math.min(value, maxCapacity));
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
                      />
                      {selectedRoom?.props?.max_capacity && (
                        <p className="text-xs text-gray-500 mt-1">Max capacity: {selectedRoom.props.max_capacity} guests</p>
                      )}
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
                          <p className="text-gray-600 font-semibold">No rooms available for selected dates</p>
                          <p className="text-sm text-gray-500">Please try different dates</p>
                        </div>
                      ) : (
                        <div className="bg-white border-2 border-primary/20 rounded-xl p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-start md:items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-bed text-primary text-lg"></i>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-base md:text-lg">
                                  {availableRooms[0]?.props?.name || room.name}
                                </h4>
                                <p className="text-xs md:text-sm text-gray-600">
                                  {availableRooms[0]?.availableCount || 0} room(s) available | Max {availableRooms[0]?.props?.max_capacity || 2} guests per room
                                </p>
                              </div>
                            </div>
                            <div className="text-left md:text-right">
                              <div className="text-xl md:text-2xl font-bold text-primary">₹{availableRooms[0]?.price || roomPricing[room.id]}</div>
                              <div className="text-xs md:text-sm text-gray-600">
                                {room.id === 'dormitory' ? 'per night per person' : 'per night per room'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Room Selection */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Rooms</label>
                              <select 
                                value={selectedRoomCount}
                                onChange={(e) => {
                                  const roomCount = parseInt(e.target.value);
                                  setSelectedRoomCount(roomCount);
                                }}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                              >
                                {Array.from({length: Math.min(availableRooms[0]?.availableCount || 1, 10)}, (_, i) => (
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
                                      <div>
                                        <span className="text-sm font-medium">{addon.name}</span>
                                        <p className="text-xs text-gray-500">{addon.description}</p>
                                      </div>
                                      <span className="text-sm text-primary font-semibold">+₹{addon.price}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Book Now Button - Moved Here */}
                          <button 
                            onClick={handleHoldRooms}
                            className="w-full bg-primary text-white px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider shadow-lg hover:bg-primaryDark hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={holdLoading}
                          >
                            {holdLoading ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-calendar-check mr-2"></i>
                                Book Now
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Extra Mattress/Add-ons Info Note */}
                  {room.id !== 'dormitory' && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="fas fa-info-circle text-blue-600"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">Additional Services Available</h4>
                          <p className="text-sm text-gray-600">
                            At the time of check-in, you can avail extra mattress/bed and other add-ons by paying the applicable charges for additional comfort.
                          </p>
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
                            {(room.id === 'dormitory'
                              ? ` × ${guests} person(s)` 
                              : ` × ${selectedRoomCount} room(s)`)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Amount</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remove the old Booking Button from here - it's now in the available rooms section */}
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
      
      {/* Booking Confirmation Modal - Improved Mobile Layout */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-primary text-white p-4 md:p-6 rounded-t-2xl">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-lg md:text-2xl font-bold font-garamond mb-1 md:mb-2">Confirm Your Booking</h2>
                  <p className="text-white/90 text-xs md:text-sm">Please review your booking details</p>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    handleCancelHold();
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition flex-shrink-0"
                >
                  <i className="fas fa-times text-lg md:text-xl"></i>
                </button>
              </div>
              
              {/* Timer Display */}
              {timeRemaining && (
                <div className="mt-3 md:mt-4 bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between text-sm md:text-base">
                  <span className="text-xs md:text-sm">Rooms held for you</span>
                  <span className="font-bold text-base md:text-lg">
                    <i className="fas fa-clock mr-1 md:mr-2"></i>
                    {timeRemaining}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6">
              {/* Booking Summary */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Booking Summary</h3>
                <div className="bg-gray-50 rounded-xl p-3 md:p-4 space-y-2 md:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Room Type</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900 text-right">{room.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Check-in</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900">{new Date(checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Check-out</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900">{new Date(checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Nights</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900">
                      {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Rooms</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900">{selectedRoomCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Guests</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900">{guests}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 md:pt-3 mt-2 md:mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base md:text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-xl md:text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Information Form */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Guest Information</h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543210"
                      maxLength="10"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">10-digit mobile number</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    handleCancelHold();
                  }}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
                  disabled={paymentLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-primary text-white rounded-full font-semibold hover:bg-primaryDark transition disabled:bg-gray-400"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card mr-1 md:mr-2"></i>
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Processing Overlay */}
      {processingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <i className="fas fa-spinner fa-spin text-primary text-3xl"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Processing Payment
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Please wait while we confirm your booking...
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs md:text-sm text-yellow-800 font-medium">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Do not refresh or close this page
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Success Header */}
            <div className="bg-green-600 text-white p-6 rounded-t-2xl text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-4xl"></i>
              </div>
              <h2 className="text-2xl font-bold font-garamond mb-2">Booking Confirmed!</h2>
              <p className="text-white/90">Your payment was successful</p>
            </div>

            {/* Success Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Thank you for your booking at Woodlands Resort. We've sent a confirmation email to <strong>{guestInfo.email}</strong>
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
                  <div className="font-bold text-2xl text-primary">
                    {bookingIds.map((id, index) => (
                      <span key={id}>
                        #{id}
                        {index < bookingIds.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                    Booking Details
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Room:</span>
                      <span className="font-semibold">{room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rooms:</span>
                      <span className="font-semibold">{selectedRoomCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-semibold">{guests}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-300">
                      <span>Total Paid:</span>
                      <span className="font-bold text-lg text-primary">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Download Voucher Button */}
                <button
                  onClick={downloadBookingVoucher}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryDark transition mb-3 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  Download Booking Voucher (PDF)
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset form
                  setGuestInfo({ name: '', email: '', phone: '' });
                  setCheckIn('');
                  setCheckOut('');
                  setGuests(2);
                  setAvailabilityChecked(false);
                  setAvailableRooms([]);
                }}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Failure Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Failure Header */}
            <div className="bg-red-600 text-white p-6 rounded-t-2xl text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-times text-red-600 text-4xl"></i>
              </div>
              <h2 className="text-2xl font-bold font-garamond mb-2">Payment Failed</h2>
              <p className="text-white/90">Your booking could not be completed</p>
            </div>

            {/* Failure Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">
                    {paymentError || 'Payment was unsuccessful. Please try again.'}
                  </p>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Don't worry, no amount has been deducted from your account. You can try booking again.
                </p>

                {holdData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      Your room hold is still active. You can try payment again or cancel to release the rooms.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowFailureModal(false);
                    setPaymentError(null);
                    // Reopen booking modal if hold is still active
                    if (holdData) {
                      setShowBookingModal(true);
                    }
                  }}
                  className="w-full bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primaryDark transition"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Try Again
                </button>
                
                <button
                  onClick={() => {
                    setShowFailureModal(false);
                    setPaymentError(null);
                    // Cancel hold and reset
                    if (holdData) {
                      handleCancelHold();
                    }
                    setGuestInfo({ name: '', email: '', phone: '' });
                  }}
                  className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
