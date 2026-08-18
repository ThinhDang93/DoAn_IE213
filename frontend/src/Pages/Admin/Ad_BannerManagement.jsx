import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import BannerManager from "./ComponentAdmin/BannerManager";

const Ad_BannerManagement = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <BannerManager />
      </div>
    </>
  );
};

export default Ad_BannerManagement;
