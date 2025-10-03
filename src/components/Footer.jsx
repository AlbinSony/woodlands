import React from 'react';
import ScrollReveal from './ScrollReveal';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white text-gray-900">
      {/* Newsletter Section */}
      <div className="bg-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h4 className="text-2xl md:text-3xl font-bold mb-6 font-garamond text-white">
                Sign up for our newsletter to receive special offers, news, and events.
              </h4>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="bg-white text-primary px-8 py-3 rounded-full font-medium uppercase tracking-wide hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 md:py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Contact Info */}
            <ScrollReveal>
              <div>
                <h3 className="text-2xl font-bold mb-6 font-garamond text-primary">Contact Us</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                    <span className="text-gray-700">
                      Kumily, Thekkady, Kerala, India
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-phone text-primary mt-1"></i>
                    <a href="tel:+919447021958" className="text-gray-700 hover:text-primary transition">
                      +91 94470 21958
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-envelope text-primary mt-1"></i>
                    <a href="mailto:info@woodlands.com" className="text-gray-700 hover:text-primary transition">
                      info@woodlands.com
                    </a>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Quick Links */}
            <ScrollReveal delay={100}>
              <div>
                <h3 className="text-2xl font-bold mb-6 font-garamond text-primary">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#home" className="text-gray-700 hover:text-primary transition">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="text-gray-700 hover:text-primary transition">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#rooms" className="text-gray-700 hover:text-primary transition">
                      Rooms
                    </a>
                  </li>
                  <li>
                    <a href="#amenities" className="text-gray-700 hover:text-primary transition">
                      Amenities
                    </a>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Services */}
            <ScrollReveal delay={200}>
              <div>
                <h3 className="text-2xl font-bold mb-6 font-garamond text-primary">Services</h3>
                <ul className="space-y-3">
                  <li className="text-gray-700">Ayurvedic Treatments</li>
                  <li className="text-gray-700">Jeep Safari Tours</li>
                  <li className="text-gray-700">Campfire Arrangements</li>
                  <li className="text-gray-700">Cultural Programs</li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Social Media */}
            <ScrollReveal delay={300}>
              <div>
                <h3 className="text-2xl font-bold mb-6 font-garamond text-primary">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold font-garamond mb-2 text-primary">WOODLANDS</p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Woodlands. All Rights Reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-primary transition">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-primary transition">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
