import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import UserManager from "./ComponentAdmin/UserManager";

const Ad_UserManagement = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <UserManager />
      </div>
    </>
  );
};

export default Ad_UserManagement;
