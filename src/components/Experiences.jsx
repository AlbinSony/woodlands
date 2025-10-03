import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const experiencesData = [
  {
    id: 1,
    title: 'Jeep Safari Tours',
    image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80',
    description: 'Embark on an exciting guided safari tour through the wilderness. Experience the thrill of spotting wildlife in their natural habitat while exploring the rugged terrain of Periyar Tiger Reserve.',
    contact: 'Questions? - Call us at +91 94470 21958',
    buttonText: 'Book Safari',
  },
  {
    id: 2,
    title: 'Ayurvedic Treatments',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    description: 'Rejuvenate your body and mind with authentic traditional Ayurvedic wellness treatments. Our experienced practitioners offer personalized therapies using natural herbs and ancient techniques.',
    contact: 'Questions? - Call us at +91 94470 21958',
    buttonText: 'Book Treatment',
  },
  {
    id: 3,
    title: 'Campfire Evenings',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    description: 'Enjoy cozy campfire gatherings under the stars. Share stories, roast marshmallows, and create unforgettable memories with family and friends in the serene ambiance of nature.',
    contact: 'Questions? - Call us at +91 94470 21958',
    buttonText: 'Reserve Spot',
  },
  {
    id: 4,
    title: 'Cultural Experiences',
    image: 'https://images.unsplash.com/photo-1569006898109-4ea8edecd9f4?w=800&q=80',
    description: 'Immerse yourself in Kerala\'s vibrant cultural heritage. Visit the nearby Kalari Payattu and Navarasa Kathakali Centre to witness traditional martial arts and classical dance performances.',
    contact: 'Questions? - Call us at +91 94470 21958',
    buttonText: 'Learn More',
  },
];

const Experiences = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? experiencesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === experiencesData.length - 1 ? 0 : prev + 1));
  };

  const currentExperience = experiencesData[currentIndex];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h6 className="text-primary font-semibold text-sm md:text-base uppercase tracking-widest mb-4">
              Experiences
            </h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-garamond">
              Harmony With Nature
            </h2>
          </div>
        </ScrollReveal>

        {/* Experience Slider */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Image */}
          <ScrollReveal delay={100}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentExperience.image}
                  alt={currentExperience.title}
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                />
              </div>
              
              {/* Bottom Section - Counter and Navigation */}
              <div className="flex items-center justify-between mt-8">
                {/* Counter */}
                <div className="flex items-center gap-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary font-garamond">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </div>
                  <div className="h-px bg-gray-300 w-32 md:w-48"></div>
                  <div className="text-lg text-primary font-garamond">
                    Activities
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary hover:bg-primaryDark text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                    aria-label="Previous activity"
                  >
                    <i className="fas fa-arrow-left text-lg"></i>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary hover:bg-primaryDark text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                    aria-label="Next activity"
                  >
                    <i className="fas fa-arrow-right text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Side - Content */}
          <ScrollReveal delay={200}>
            <div className="lg:pl-8">
              {/* Small Counter */}
              <div className="text-sm text-gray-500 mb-4 font-medium">
                {String(currentIndex + 1).padStart(2, '0')} / {String(experiencesData.length).padStart(2, '0')}
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-garamond leading-tight">
                {currentExperience.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                {currentExperience.description}
              </p>

              {/* Contact Info */}
              <p className="text-sm md:text-base text-gray-900 font-medium mb-8">
                {currentExperience.contact}
              </p>

              {/* CTA Button */}
              <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold uppercase text-sm tracking-wide transition-all">
                {currentExperience.buttonText}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
