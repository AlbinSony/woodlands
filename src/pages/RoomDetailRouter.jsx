import React from "react";
import { useParams } from "react-router-dom";
import RoomDetail from "./RoomDetail";

const RoomDetailRouter = () => {
  const { roomType } = useParams();
  return <RoomDetail roomType={roomType} />;
};

export default RoomDetailRouter;
