import React from "react";
import Navbar from "../template/Navbar";
import Banner from "./ComponentHome/CarouselBannerr";
import FilmFilter from "./ComponentHome/FilmFilter";
import FilmCard from "./ComponentHome/FilmCard";
import Footer from "../template/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <FilmFilter />
      <FilmCard />
      <Footer />
    </>
  );
};

export default Home;
