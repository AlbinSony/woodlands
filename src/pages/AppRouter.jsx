import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import RoomDetailRouter from "./RoomDetailRouter";
import NotFound from "./NotFound";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/room/:roomType" element={<RoomDetailRouter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
