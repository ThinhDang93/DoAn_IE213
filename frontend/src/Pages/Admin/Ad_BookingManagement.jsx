import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import BookingManager from "./ComponentAdmin/BookingManager";

const Ad_BookingManagement = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <BookingManager />
      </div>
    </>
  );
};

export default Ad_BookingManagement;
