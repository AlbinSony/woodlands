import { useEffect } from 'react';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Rooms from './components/Rooms';
import Experiences from './components/Experiences';
import Amenities from './components/Amenities';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SectionDivider from './components/SectionDivider';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Lenis scroll event listener
    lenis.on('scroll', (e) => {
      // You can add scroll-based animations here if needed
    });

    // Request animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-white">
      <Loader />
      <Header />
      <Hero />
      <About />
      <Rooms />
      <Experiences />
      <Amenities />
      <Testimonials />
      <Gallery />
      <BookingForm />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;

