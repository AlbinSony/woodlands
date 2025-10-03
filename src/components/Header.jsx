import React, { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      {/* Main Navigation */}
      <nav className="bg-white px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="text-primary font-garamond text-2xl md:text-3xl font-bold tracking-wide hover:opacity-90 transition">
            WOODLANDS
          </a>

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
