import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFound = () => (
  <div className="bg-white min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">Page not found.</p>
        <a href="/" className="bg-primary text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wide shadow-lg hover:bg-primaryDark transition">Go Home</a>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
