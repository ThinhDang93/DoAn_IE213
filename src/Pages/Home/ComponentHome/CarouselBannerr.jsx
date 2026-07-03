import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFilmBannerAPI } from "../../../API/filmBannerAPI";

const Banner = () => {
  const query = useQuery({
    queryKey: ["getFilmBanner"],
    queryFn: getFilmBannerAPI,
    staleTime: 5000,
    gcTime: 100000,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!query.data) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % query.data.length);
    }, 5000); // auto chuyển slide mỗi 5s
    return () => clearInterval(interval);
  }, [query.data]);

  if (query.isLoading) {
    return <div>Loading....</div>;
  } else if (query.error) {
    return <div>Lỗi: {query.error.message}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-lg  py-16">
      {/* Wrapper */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${query.data.length * 100}%`,
        }}
      >
        {query.data.map((item, index) => (
          <div
            key={item.maBanner}
            className=" flex-shrink-0 w-full h-[40vh] md:h-[60vh] lg:h-[80vh] overflow-hidden "
          >
            <img
              src={item.hinhAnh}
              alt={`banner-${index}`}
              className="w-screen h-auto object-cover
              "
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {query.data.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
