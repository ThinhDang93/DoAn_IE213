import React from "react";
import Navbar from "../template/Navbar";
import Banner from "./ComponentHome/CarouselBannerr";
import FilmCard from "./ComponentHome/FilmCard";
import Footer from "../template/Footer";
import AllSystem from "../template/AllSystem";

const Home = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <FilmCard />
      <div className="container py-5">
        <AllSystem />
      </div>
      <Footer />
    </>
  );
};

export default Home;
