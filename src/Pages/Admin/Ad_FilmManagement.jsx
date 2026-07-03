import React from "react";
import SlideBar_Admin from "./ComponentAdmin/SlideBar_Admin";
import MovieManager from "./ComponentAdmin/MovieManager";

const Ad_FilmManagement = () => {
  return (
    <>
      <SlideBar_Admin />
      <div className="p-4 sm:ml-64">
        <MovieManager />
      </div>
    </>
  );
};

export default Ad_FilmManagement;
