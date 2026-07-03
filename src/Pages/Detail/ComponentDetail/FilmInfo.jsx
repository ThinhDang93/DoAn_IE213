import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getFilmDetailbyIDActionThunk } from "../../../redux/reducers/FilmReducer";

const FilmInfo = () => {
  const param = useParams();
  const { filmDetail } = useSelector((state) => state.FilmReducer);
  const dispatch = useDispatch();

  const getFilmbyID = async () => {
    const actionThunk = getFilmDetailbyIDActionThunk(param.maPhim);
    dispatch(actionThunk);
  };

  useEffect(() => {
    getFilmbyID();
  }, [param.maPhim]);

  return (
    <div className="max-w-6xl mx-auto p-6 pt-18">
      {/* Grid chia 2 cột */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="rounded-2xl overflow-hidden shadow-lg aspect-[2/3]">
          <img
            src={filmDetail.hinhAnh}
            alt={filmDetail.tenPhim}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="md:col-span-2 flex flex-col justify-between">
          {/* Nội dung phim */}
          <div className="space-y-4">
            {/* Tên phim */}
            <h1 className="text-4xl font-bold">{filmDetail.tenPhim}</h1>

            {/* Mô tả */}
            <p className="text-gray-700 leading-relaxed line-clamp-6">
              {filmDetail.moTa}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {filmDetail.hot && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Hot
                </span>
              )}
              {filmDetail.dangChieu && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Đang chiếu
                </span>
              )}
              {filmDetail.sapChieu && (
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                  Sắp chiếu
                </span>
              )}
            </div>

            {/* Extra Info */}
            <div className="space-y-2 text-gray-800">
              <p>
                <span className="font-semibold">Ngày khởi chiếu:</span>{" "}
                {new Date(filmDetail.ngayKhoiChieu).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span className="font-semibold">Đánh giá:</span>{" "}
                <span className="text-yellow-500 font-semibold">
                  ⭐ {filmDetail.danhGia}/10
                </span>
              </p>
            </div>
          </div>

          {/* Nút trailer luôn nằm cuối */}
          <div className="mt-6">
            <NavLink
              to={filmDetail.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 
              hover:from-green-500 hover:to-green-700 
              focus:ring-4 focus:outline-none focus:ring-green-300 
              font-medium rounded-lg text-base px-6 py-3 text-center shadow-md"
            >
              🎬 Xem trailer
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmInfo;
