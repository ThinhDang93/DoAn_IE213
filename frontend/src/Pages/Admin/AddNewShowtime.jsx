import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import FormShowtime from "./ComponentAdmin/FormShowtime";

const AddNewShowtime = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <FormShowtime />
      </div>
    </>
  );
};

export default AddNewShowtime;
