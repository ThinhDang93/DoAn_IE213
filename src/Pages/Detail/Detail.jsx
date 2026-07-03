import React, { useEffect } from "react";
import FilmInfo from "./ComponentDetail/FilmInfo";
import Footer from "../template/Footer";
import Navbar from "../template/Navbar";
import AllSystem from "../template/AllSystem";
import ShowTimeByID from "./ComponentDetail/ShowTimeByID";

const Detail = () => {
  return (
    <>
      <FilmInfo />
      <div className="max-w-6xl mx-auto container p-6 grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <AllSystem />
        </div>
        <div className="col-span-9">
          <ShowTimeByID />
        </div>
      </div>
    </>
  );
};

export default Detail;
