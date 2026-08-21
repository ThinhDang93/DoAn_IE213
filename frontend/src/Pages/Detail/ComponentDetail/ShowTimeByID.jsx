import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllShowTimebyIDActionThunk } from "../../../redux/reducers/CinemaSystemReducer";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAllBookingDatabyIDActionThunk } from "../../../redux/reducers/BookingReducer";
import { formatVietnamDate, formatVietnamTime } from "../../../utils/vietnamTime";

const formatGia = (value) => `${Math.round(value / 1000)}k`;

const ComplexShowtimes = ({ rap, dispatch }) => {
  const groupedByDate = useMemo(() => {
    const map = new Map();

    rap.lichChieuPhim.forEach((lich) => {
      const key = formatVietnamDate(lich.ngayChieuGioChieu);

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(lich);
    });

    map.forEach((list) =>
      list.sort(
        (a, b) => new Date(a.ngayChieuGioChieu) - new Date(b.ngayChieuGioChieu)
      )
    );

    return map;
  }, [rap.lichChieuPhim]);

  const dateKeys = Array.from(groupedByDate.keys());
  const [selectedDate, setSelectedDate] = useState(dateKeys[0] || "");

  useEffect(() => {
    if (dateKeys.length > 0 && !dateKeys.includes(selectedDate)) {
      setSelectedDate(dateKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rap.maCumRap, dateKeys.join(",")]);

  const timesForSelectedDate = groupedByDate.get(selectedDate) || [];

  return (
    <div className="border rounded-2xl p-4 shadow-sm bg-white">
      <h3 className="font-semibold text-lg">{rap.tenCumRap}</h3>
      <div className="flex items-center gap-4 mb-3">
        <img
          src={rap.hinhAnh}
          alt=""
          className="w-14 h-14 rounded-lg border object-contain mr-3"
        />
        <h3 className="text-gray-500 text-sm">{rap.diaChi}</h3>
      </div>

      {/* Chọn ngày */}
      <div className="flex flex-wrap gap-2 mb-3">
        {dateKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedDate(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
              selectedDate === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Giờ chiếu theo ngày đã chọn */}
      <div className="flex flex-wrap gap-2">
        {timesForSelectedDate.map((lich) => {
          const timeStr = formatVietnamTime(lich.ngayChieuGioChieu);
          const giaLabel =
            lich.giaVeMin && lich.giaVeMax && lich.giaVeMin !== lich.giaVeMax
              ? `${formatGia(lich.giaVeMin)} ~ ${formatGia(lich.giaVeMax)}`
              : formatGia(lich.giaVeMin ?? lich.giaVe);

          return (
            <NavLink
              key={lich.maLichChieu}
              to={`/booking/${lich.maLichChieu}`}
              onClick={() => {
                dispatch(getAllBookingDatabyIDActionThunk(lich.maLichChieu));
              }}
            >
              <button
                type="button"
                className="flex flex-col items-center border-2 border-green-600 text-green-600 hover:text-white hover:bg-green-600 focus:ring-4 focus:outline-none rounded-lg px-4 py-2 me-2 mb-2 transition"
              >
                <span className="text-lg font-semibold leading-tight">
                  {timeStr}
                </span>
                <span className="text-xs leading-tight">{giaLabel}</span>
              </button>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

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
    <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      {CinemaDetaibyFilm.map((rap) => (
        <ComplexShowtimes key={rap.maCumRap} rap={rap} dispatch={dispatch} />
      ))}
    </div>
  );
};

export default ShowTimeByID;
