import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

const CookiePolicy = () => {
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
                Cookie Policy
              </h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and improving the functionality of our site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-bold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-gray-700 mb-2">These cookies are necessary for the website to function properly:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Session management and security</li>
                      <li>Shopping cart functionality</li>
                      <li>Authentication and login status</li>
                      <li>Form submission and data validation</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-bold text-gray-900 mb-2">Performance Cookies</h3>
                    <p className="text-gray-700 mb-2">These cookies help us understand how visitors use our website:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Page visit statistics</li>
                      <li>User behavior analytics</li>
                      <li>Site performance monitoring</li>
                      <li>Error tracking and debugging</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-bold text-gray-900 mb-2">Functionality Cookies</h3>
                    <p className="text-gray-700 mb-2">These cookies enhance your experience by remembering your choices:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Language preferences</li>
                      <li>Regional settings</li>
                      <li>Customized content</li>
                      <li>Accessibility options</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-bold text-gray-900 mb-2">Marketing Cookies</h3>
                    <p className="text-gray-700 mb-2">These cookies are used to deliver relevant advertisements:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Personalized advertising</li>
                      <li>Social media integration</li>
                      <li>Remarketing campaigns</li>
                      <li>Third-party advertising networks</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We may also use third-party services that set their own cookies:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Google Analytics:</strong> For website traffic analysis</li>
                  <li><strong>Facebook Pixel:</strong> For social media marketing</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Booking Platforms:</strong> For reservation management</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
                <p className="text-gray-700 mb-4">
                  You can control and manage cookies in several ways:
                </p>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-blue-800 mb-2">Browser Settings</h3>
                  <p className="text-blue-700 mb-2">Most browsers allow you to:</p>
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>View and delete cookies</li>
                    <li>Block cookies from specific sites</li>
                    <li>Block third-party cookies</li>
                    <li>Clear all cookies when you close the browser</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-yellow-800 mb-2">Cookie Consent Banner</h3>
                  <p className="text-yellow-700">
                    When you first visit our website, you can choose which types of cookies to accept through our cookie consent banner.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser-Specific Instructions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">Google Chrome</h3>
                    <p className="text-gray-700 text-sm">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">Mozilla Firefox</h3>
                    <p className="text-gray-700 text-sm">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">Safari</h3>
                    <p className="text-gray-700 text-sm">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">Microsoft Edge</h3>
                    <p className="text-gray-700 text-sm">
                      Settings → Site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Please note that disabling certain cookies may affect your experience:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>You may need to re-enter information repeatedly</li>
                  <li>Some features may not work properly</li>
                  <li>Personalized content may not be available</li>
                  <li>The booking process may be interrupted</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:privacy@woodlands.com" className="text-primary hover:underline">privacy@woodlands.com</a>
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

export default CookiePolicy;