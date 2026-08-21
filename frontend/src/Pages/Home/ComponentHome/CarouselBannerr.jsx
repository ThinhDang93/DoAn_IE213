import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayDanhSachBannerAPI } from "../../../API/BannerAPI";

const Banner = () => {
  const query = useQuery({
    queryKey: ["getBanner"],
    queryFn: LayDanhSachBannerAPI,
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
  } else if (!query.data || query.data.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden pt-12">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {query.data.map((item, index) => (
          <div key={item.maBanner} className="relative w-full flex-none">
            <img
              src={item.hinhAnh}
              alt={`banner-${index}`}
              className="
              block
              w-full
              h-auto
              max-h-[80vh]
              object-contain
              object-center
            "
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div
        className="
        absolute
        z-30
        flex
        -translate-x-1/2
        bottom-4
        left-1/2
        gap-2
      "
      >
        {query.data.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Banner ${index + 1}`}
            className={`
            w-2.5
            h-2.5
            rounded-full
            transition-all
            duration-300
            ${index === currentIndex ? "bg-white scale-110" : "bg-white/50"}
          `}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
