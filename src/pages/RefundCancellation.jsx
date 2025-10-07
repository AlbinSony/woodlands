import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

const RefundCancellation = () => {
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
                Refund & Cancellation Policy
              </h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
                <p className="text-gray-700 mb-4">
                  Our cancellation policy varies based on the time of cancellation and room type:
                </p>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-green-800 mb-2">Free Cancellation</h3>
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    <li>Cancellations made 7+ days before check-in: 100% refund</li>
                    <li>No cancellation charges apply</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-yellow-800 mb-2">Partial Cancellation Charges</h3>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    <li>Cancellations made 3-6 days before check-in: 25% cancellation charge</li>
                    <li>Cancellations made 1-2 days before check-in: 50% cancellation charge</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-red-800 mb-2">No Refund</h3>
                  <ul className="list-disc list-inside text-red-700 space-y-1">
                    <li>Cancellations made on the day of check-in: 100% cancellation charge (No refund)</li>
                    <li>No-show: 100% cancellation charge (No refund)</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Refunds will be processed to the original payment method</li>
                  <li>Processing time: 5-10 business days for credit/debit cards</li>
                  <li>Bank transfer refunds: 3-5 business days</li>
                  <li>Cash payments: Refunds available within 24 hours at the property</li>
                  <li>Service charges and taxes are non-refundable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Modification Policy</h2>
                <p className="text-gray-700 mb-4">
                  Booking modifications are subject to availability and the following conditions:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Date changes made 3+ days in advance: Free of charge (subject to rate difference)</li>
                  <li>Date changes made 1-2 days in advance: ₹500 modification fee + rate difference</li>
                  <li>Room type changes: Subject to availability and rate difference</li>
                  <li>Guest count modifications: Additional charges may apply</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Circumstances</h2>
                <p className="text-gray-700 mb-4">
                  We understand that unexpected situations may arise:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Medical Emergency:</strong> Full refund with valid medical certificate</li>
                  <li><strong>Natural Disasters:</strong> Full refund or rescheduling options</li>
                  <li><strong>Government Travel Restrictions:</strong> Full refund or credit voucher</li>
                  <li><strong>Property Issues:</strong> Full refund if we cannot provide accommodation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Bookings</h2>
                <p className="text-gray-700 mb-4">
                  For group bookings (5+ rooms), special terms apply:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>30+ days advance cancellation: 90% refund</li>
                  <li>15-29 days advance cancellation: 75% refund</li>
                  <li>7-14 days advance cancellation: 50% refund</li>
                  <li>Less than 7 days: 25% refund</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Cancel</h2>
                <p className="text-gray-700 mb-4">
                  To cancel your booking:
                </p>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                  <li>Email us at <a href="mailto:bookings@woodlands.com" className="text-primary hover:underline">bookings@woodlands.com</a></li>
                  <li>Call us at <a href="tel:+919447021958" className="text-primary hover:underline">+91 94470 21958</a></li>
                  <li>Provide your booking confirmation number</li>
                  <li>State your reason for cancellation</li>
                  <li>We will process your request within 24 hours</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact for Cancellations</h2>
                <p className="text-gray-700 mb-4">
                  For all cancellation and refund inquiries:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:bookings@woodlands.com" className="text-primary hover:underline">bookings@woodlands.com</a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> <a href="tel:+919447021958" className="text-primary hover:underline">+91 94470 21958</a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>WhatsApp:</strong> <a href="https://wa.me/919447021958" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+91 94470 21958</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Office Hours:</strong> 24/7 Customer Support
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

export default RefundCancellation;