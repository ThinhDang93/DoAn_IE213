import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import FormUser from "./ComponentAdmin/FormUser";

const AddNewUser = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <FormUser />
      </div>
    </>
  );
};

export default AddNewUser;
