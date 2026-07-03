import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import FormFilm from "./ComponentAdmin/FormFilm";
import { setCookie } from "../../utils/cookie";

const AddNewFilm = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <FormFilm />
      </div>
    </>
  );
};

export default AddNewFilm;
