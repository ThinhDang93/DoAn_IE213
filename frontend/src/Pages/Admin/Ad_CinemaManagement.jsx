import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import CinemaManager from "./ComponentAdmin/CinemaManager";

const Ad_CinemaManagement = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <CinemaManager />
      </div>
    </>
  );
};

export default Ad_CinemaManagement;
