import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import ShowtimeManager from "./ComponentAdmin/ShowtimeManager";

const Ad_ShowtimeManagement = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <ShowtimeManager />
      </div>
    </>
  );
};

export default Ad_ShowtimeManagement;
