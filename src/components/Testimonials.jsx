import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const testimonialsData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Family Traveler',
    image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=a50102&color=fff&size=200',
    text: 'Wonderful stay at Woodlands! The hospitality was exceptional and the location is perfect for exploring Thekkady. The campfire evening was a highlight of our trip.',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Solo Traveler',
    image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=a50102&color=fff&size=200',
    text: 'As a solo female traveler, I felt completely safe and welcomed. The staff was incredibly helpful and the Ayurvedic treatment was rejuvenating.',
  },
  {
    id: 3,
    name: 'Michael D\'Silva',
    role: 'Adventure Enthusiast',
    image: 'https://ui-avatars.com/api/?name=Michael+DSilva&background=a50102&color=fff&size=200',
    text: 'The jeep safari organized by Woodlands was amazing! Great value for money and the proximity to Periyar Tiger Reserve made our wildlife experience unforgettable.',
  },
];

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-quote-left text-3xl text-primary"></i>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-garamond">
              Happy Customers
            </h2>
          </div>
        </ScrollReveal>

        {/* Testimonials Slider */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {testimonialsData.map((testimonial, index) => (
              <ScrollReveal key={testimonial.id} delay={index * 100}>
                <div
                  className={`bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg border transition-all duration-300 cursor-pointer ${
                    activeTestimonial === index
                      ? 'border-primary shadow-2xl scale-105'
                      : 'border-gray-200 hover:border-primary hover:shadow-xl'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                >
                  <div className="relative mb-6">
                    <i className="fas fa-quote-left text-4xl text-primary/20 absolute -top-2 -left-2"></i>
                    <p className="text-gray-700 leading-relaxed pt-6 min-h-[120px]">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonial === index ? 'bg-primary w-8' : 'bg-gray-300'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
