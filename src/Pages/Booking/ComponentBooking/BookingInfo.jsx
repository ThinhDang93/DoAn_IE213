import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookingDatabyIDActionThunk,
  toggleSeat,
} from "../../../redux/reducers/BookingReducer";
import { useParams } from "react-router-dom";

const BookingInfo = () => {
  const param = useParams();

  const { thongTinPhim, danhSachGhe, gheDangChon } = useSelector(
    (state) => state.BookingReducer
  );

  const dispatch = useDispatch();

  const getAllBookingInfo = async () => {
    const actionThunk = getAllBookingDatabyIDActionThunk(param.maLichChieu);
    dispatch(actionThunk);
  };

  useEffect(() => {
    getAllBookingInfo();
  }, [param.maLichChieu]);

  const total = danhSachGhe
    .filter((g) => gheDangChon.includes(g.maGhe))
    .reduce((sum, g) => sum + g.giaVe, 0);

  console.log(thongTinPhim);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 p-6">
      {/* Bên trái: Ghế */}
      <div className="col-span-8">
        <h2 className="text-xl font-bold text-center mb-4">Chọn ghế</h2>
        <div className="bg-gray-800 text-white text-center py-2 rounded-md mb-4">
          MÀN HÌNH
        </div>
        <div className="grid grid-cols-16 justify-items-center gap-1">
          {danhSachGhe.map((ghe) => {
            const isSelected = gheDangChon.includes(ghe.maGhe);
            return (
              <button
                key={ghe.maGhe}
                disabled={ghe.daDat}
                onClick={() => dispatch(toggleSeat(ghe.maGhe))}
                className={`w-12 h-12 rounded text-sm 
                  ${
                    ghe.daDat
                      ? "bg-gray-500 cursor-not-allowed text-white"
                      : isSelected
                      ? "bg-red-500 text-white"
                      : ghe.loaiGhe === "Vip"
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-green-400 hover:bg-green-500"
                  }`}
              >
                {ghe.daDat ? "X" : ghe.tenGhe}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bên phải: Thông tin */}
      <div className="col-span-4 space-y-4">
        <h2 className="text-xl font-bold">Thông tin vé</h2>
        <div className="bg-gray-100 p-4 rounded shadow space-y-2">
          <p>
            <b>Phim:</b> {thongTinPhim.tenPhim}
          </p>
          <p>
            <b>Cụm rạp:</b> {thongTinPhim.tenCumRap}
          </p>
          <p>
            <b>Rạp:</b> {thongTinPhim.tenRap}
          </p>
          <p>
            <b>Địa chỉ:</b> {thongTinPhim.diaChi}
          </p>
          <p>
            <b>Ngày chiếu:</b> {thongTinPhim.ngayChieu} -{" "}
            {thongTinPhim.gioChieu}
          </p>
          <p>
            <b>Ghế đã chọn:</b> {gheDangChon.join(", ") || "Chưa chọn"}
          </p>
          <p>
            <b className="text-red-500">Tổng tiền:</b> {total.toLocaleString()}{" "}
            VND
          </p>
          <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;
