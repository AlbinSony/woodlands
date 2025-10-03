import React from 'react';
import ScrollReveal from './ScrollReveal';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h6 className="text-primary font-semibold text-sm md:text-base uppercase tracking-widest mb-4">
              Welcome to Woodlands
            </h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-garamond">
              About Us
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 italic font-garamond max-w-2xl mx-auto">
              "A place that celebrates life rather than sucks life out of it."
            </p>
          </div>
        </ScrollReveal>

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <ScrollReveal delay={100}>
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                alt="Woodlands Resort Exterior"
                className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                alt="Woodlands Resort View"
                className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Content */}
        <ScrollReveal delay={300}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-garamond">
                Your Perfect Stay in the Heart of Kumily
              </h3>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Since <strong>1958</strong>, Woodlands has been known for its warm hospitality, comfort, and timeless tradition.
                </p>
                
                <p>
                  Located just <strong>200 meters from Kumily town</strong> and <strong>300 meters from the Periyar Lake bus pickup/drop point</strong>, 
                  our resort offers the ideal blend of convenience and tranquility. Right opposite, you'll find the 
                  <strong> Kalari Payattu and Navarasa Kathakali Centre</strong>, giving our guests a chance to immerse themselves 
                  in Kerala's vibrant culture while being surrounded by nature's beauty.
                </p>

                <p>
                  We offer a variety of accommodations to suit every type of traveler – from <strong>Prime Deluxe Rooms</strong> and 
                  <strong> Economy Rooms</strong> to <strong>5-Bedded Deluxe</strong>, <strong>Dormitory stays</strong>, and 
                  <strong> extra mattress facilities</strong> – ensuring comfort for families, groups, and solo travelers alike.
                </p>

                <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mt-8 mb-4 font-garamond">
                  Beyond Stays - A Complete Thekkady Experience
                </h4>

                <ul className="grid md:grid-cols-2 gap-3">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span>Spacious kitchen and dining facilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span>Secure parking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span>Campfire evenings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span>Authentic Ayurvedic treatments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span>Exciting jeep safari tours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    <span>Periyar Tiger Reserve (just 4 km away)</span>
                  </li>
                </ul>

                <p className="text-lg font-medium text-primary mt-8">
                  Whether you're here for <strong>adventure, culture, or relaxation</strong>, 
                  Woodlands is your trusted gateway to an unforgettable stay in Thekkady.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
