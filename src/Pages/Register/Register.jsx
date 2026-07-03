import React from "react";
import Navbar from "../template/Navbar";
import Footer from "../template/Footer";
import FormRegister from "./ComponentRegister/FormRegister";

const Register = () => {
  return (
    <>
      <div className="mx-auto container">
        <FormRegister />
      </div>
    </>
  );
};

export default Register;
