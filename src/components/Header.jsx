import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHeroSection, setIsHeroSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const heroSectionHeight = window.innerHeight;
      
      // Check if we're in hero section
      const inHeroSection = currentScrollPos < heroSectionHeight;
      setIsHeroSection(inHeroSection);
      
      // Always show navbar in hero section
      if (inHeroSection) {
        setVisible(true);
        setPrevScrollPos(currentScrollPos);
        return;
      }

      // Handle scroll direction after hero section
      const isScrollingDown = prevScrollPos < currentScrollPos;
      
      setVisible(!isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-transform duration-300 ${
        !visible ? '-translate-y-full' : 'translate-y-0'
      }`}>
      {/* Main Navigation */}
      <nav className="bg-white px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <img 
              src="/woodlandslogo.png" 
              alt="Woodlands Logo" 
              className="h-14 md:h-16 lg:h-18 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-8">
            <li>
              <a href="#home" className="text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide">
                Home
              </a>
            </li>
            <li className="group relative">
              <a href="#rooms" className="text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide flex items-center gap-1">
                Rooms
                <i className="fas fa-chevron-down text-xs"></i>
              </a>
            </li>
            <li>
              <a href="#about" className="text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide">
                About
              </a>
            </li>
            <li>
              <a href="#amenities" className="text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide">
                Amenities
              </a>
            </li>
            <li>
              <a href="#contact" className="text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide">
                Contact
              </a>
            </li>
          </ul>

          {/* Book Now Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="#book"
              className="hidden md:flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-primaryDark transition shadow-lg"
            >
              <i className="fas fa-calendar-check"></i>
              <span>Book Now</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-primary text-2xl focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-primary/20">
            <ul className="space-y-3 mt-4">
              <li>
                <a
                  href="#home"
                  className="block text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#rooms"
                  className="block text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rooms
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#amenities"
                  className="block text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Amenities
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="block text-primary hover:text-primary/80 transition font-medium text-sm uppercase tracking-wide py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#book"
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-primaryDark transition w-fit"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-calendar-check"></i>
                  <span>Book Now</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
