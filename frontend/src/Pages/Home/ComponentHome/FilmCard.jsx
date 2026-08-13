import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllFilmAPIActionThunk } from "../../../redux/reducers/FilmReducer";

const FilmCard = () => {
  const { arrFilm } = useSelector((state) => state.FilmReducer);

  const dispatch = useDispatch();

  const getAllFilm = () => {
    const actionThunk = getAllFilmAPIActionThunk();
    dispatch(actionThunk);
  };

  useEffect(() => {
    getAllFilm();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-6 container mx-auto px-4">
        {arrFilm?.map((item) => (
          <div
            key={item.maPhim}
            className="w-64 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition"
          >
            {/* Ảnh */}
            <NavLink to={`/detail/${item.maPhim}`}>
              <img
                className="h-72 w-full object-cover bg-black"
                src={item.hinhAnh}
                alt={item.tenPhim}
              />
            </NavLink>

            {/* Nội dung */}
            <div className="p-4 flex flex-col justify-between h-44">
              {/* Tên phim */}
              <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                {item.tenPhim}
              </h5>

              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <svg
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < 4 ? "text-yellow-400" : "text-gray-300"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                </div>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                  5.0
                </span>
              </div>

              {/* Button */}
              <NavLink
                to={`/detail/${item.maPhim}`}
                className="mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                Đặt vé
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilmCard;
