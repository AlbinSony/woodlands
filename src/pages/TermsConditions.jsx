import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-garamond mb-4">
                Terms & Conditions
              </h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using Woodlands' services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservation and Booking</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>All reservations are subject to availability</li>
                  <li>Check-in time: Any time | Check-out time: 12:00 PM (Noon)</li>
                  <li>Early check-in and late check-out are subject to availability and may incur additional charges</li>
                  <li>Valid photo ID is required at check-in</li>
                  <li>Payment must be made in full at the time of booking or check-in</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Occupancy</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Maximum occupancy limits must be strictly observed</li>
                  <li>Additional guests may be charged extra fees</li>
                  <li>Children under 5 years stay free when sharing existing bedding</li>
                  <li>Extra beds and mattresses are available for additional charges</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">House Rules</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Smoking is prohibited inside all rooms and common areas</li>
                  <li>Pets are not allowed without prior approval</li>
                  <li>Guests are responsible for any damage to the property</li>
                  <li>Quiet hours are from 10:00 PM to 7:00 AM</li>
                  <li>Outside food and beverages may be restricted</li>
                  <li>Visitors must be registered at the front desk</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Liability</h2>
                <p className="text-gray-700 mb-4">
                  Woodlands shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Loss or damage to personal belongings</li>
                  <li>Injuries sustained on the property due to negligence</li>
                  <li>Disruptions due to weather, natural disasters, or other force majeure events</li>
                  <li>Changes to tour schedules or cancellations due to external factors</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Force Majeure</h2>
                <p className="text-gray-700 mb-4">
                  Woodlands shall not be held responsible for any failure or delay in performance under this agreement which is due to earthquake, flood, fire, storm, natural disaster, act of God, war, terrorism, or other reason which is beyond the reasonable control of Woodlands.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
                <p className="text-gray-700 mb-4">
                  Woodlands reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These terms and conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Kerala, India.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions regarding these terms and conditions, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:info@woodlands.com" className="text-primary hover:underline">info@woodlands.com</a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> <a href="tel:+919447990411" className="text-primary hover:underline">+91 94479 90411</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Kumily, Thekkady, Kerala, India
                  </p>
                </div>
              </section>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;