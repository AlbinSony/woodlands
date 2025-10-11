import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import RoomDetailRouter from "./RoomDetailRouter";
import NotFound from "./NotFound";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsConditions from "./TermsConditions";
import RefundCancellation from "./RefundCancellation";
import CookiePolicy from "./CookiePolicy";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminBookings from "./AdminBookings";
import AdminHoldRoomsTabs from "./AdminHoldRoomsTabs";
import AdminConfirmBooking from "./AdminConfirmBooking";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/room/:roomType" element={<RoomDetailRouter />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/refund-cancellation" element={<RefundCancellation />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      
      {/* Admin Routes */}
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/adminLogin/dashboard" element={<AdminDashboard />} />
      <Route path="/adminLogin/dashboard/bookings" element={<AdminBookings />} />
      <Route path="/adminLogin/dashboard/hold-rooms" element={<AdminHoldRoomsTabs />} />
      <Route path="/adminLogin/dashboard/confirm-booking" element={<AdminConfirmBooking />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
