import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import RoomDetailRouter from "./RoomDetailRouter";
import NotFound from "./NotFound";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsConditions from "./TermsConditions";
import RefundCancellation from "./RefundCancellation";
import CookiePolicy from "./CookiePolicy";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/room/:roomType" element={<RoomDetailRouter />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/refund-cancellation" element={<RefundCancellation />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
