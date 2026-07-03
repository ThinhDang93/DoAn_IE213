import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllShowTimebyIDActionThunk } from "../../../redux/reducers/CinemaSystemReducer";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAllBookingDatabyIDActionThunk } from "../../../redux/reducers/BookingReducer";

const ShowTimeByID = () => {
  const param = useParams();

  const { CinemaDetaibyFilm } = useSelector(
    (state) => state.CinemaSystemReducer
  );

  const dispatch = useDispatch();

  const getAllShowTimebyID = async () => {
    const actionThunk = getAllShowTimebyIDActionThunk(param.maPhim);
    dispatch(actionThunk);
  };

  useEffect(() => {
    getAllShowTimebyID();
  }, [param.maPhim]);

  return (
    <div className="space-y-6">
      {CinemaDetaibyFilm.map((rap) => (
        <div key={rap.maCumRap} className="border rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-lg">{rap.tenCumRap}</h3>
          <div className="flex items-center gap-4 mb-3">
            <img
              src={rap.hinhAnh}
              alt=""
              className="w-14 h-14 rounded-lg border object-contain mr-3"
            />
            <h3 className="text-gray-500 text-sm">{rap.diaChi}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {rap.lichChieuPhim.map((lich) => {
              const date = new Date(lich.ngayChieuGioChieu);
              const timeStr = date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <NavLink
                  key={lich.maLichChieu}
                  to={`/booking/${lich.maLichChieu}`}
                  onClick={() => {
                    dispatch(
                      getAllBookingDatabyIDActionThunk(lich.maLichChieu)
                    );
                  }}
                >
                  <button
                    type="button"
                    className="text-green-600 hover:text-white   hover:bg-green-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-2xl px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {timeStr}
                    {/* {lich.maLichChieu} */}
                  </button>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTimeByID;
