import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookingDatabyIDActionThunk,
  toggleSeat,
  clearSeat,
} from "../../../redux/reducers/BookingReducer";
import { useNavigate, useParams } from "react-router-dom";
import { DatVeAPI } from "../../../API/BookingAPI";
import { TOKEN } from "../../../utils/interceptor";

const BookingInfo = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { thongTinPhim, danhSachGhe, gheDangChon } = useSelector(
    (state) => state.BookingReducer,
  );

  const dispatch = useDispatch();

  const getAllBookingInfo = async () => {
    const actionThunk = getAllBookingDatabyIDActionThunk(param.maLichChieu);
    dispatch(actionThunk);
  };

  useEffect(() => {
    getAllBookingInfo();
  }, [param.maLichChieu]);

  const gheDaChonInfo = danhSachGhe.filter((g) =>
    gheDangChon.includes(g.maGhe),
  );
  const total = gheDaChonInfo.reduce((sum, g) => sum + g.giaVe, 0);
  const tenGheDaChon = gheDaChonInfo.map((g) => g.tenGhe).join(", ");

  const SEAT_COLUMNS = 10;
  const seatGrid = {};
  const rowSet = new Set();
  danhSachGhe.forEach((ghe) => {
    const match = ghe.tenGhe?.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return;
    const [, row, col] = match;
    rowSet.add(row);
    seatGrid[row] = seatGrid[row] || {};
    seatGrid[row][Number(col)] = ghe;
  });
  const sortedRows = Array.from(rowSet).sort();

  const handleDatVe = async () => {
    if (gheDangChon.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế");
      return;
    }

    if (!localStorage.getItem(TOKEN)) {
      alert("Vui lòng đăng nhập trước khi đặt vé");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const res = await DatVeAPI(param.maLichChieu, gheDangChon);
      dispatch(clearSeat());
      navigate(`/thanh-toan/${res.content.maVe}`);
    } catch (error) {
      const message = error?.response?.data?.message || "Đặt vé thất bại";
      alert(message);
      await getAllBookingInfo();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 p-6">
      {/* Bên trái: Ghế */}
      <div className="col-span-8">
        <h2 className="text-xl font-bold text-center mb-4">Chọn ghế</h2>
        <div className="bg-gray-800 text-white text-center py-2 rounded-md mb-4">
          MÀN HÌNH
        </div>
        <div className="flex flex-col items-center gap-2">
          {sortedRows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5 font-bold text-center">{row}</span>
              <div className="flex gap-1">
                {Array.from({ length: SEAT_COLUMNS }, (_, i) => i + 1).map(
                  (col) => {
                    const ghe = seatGrid[row]?.[col];
                    if (!ghe) {
                      return <div key={col} className="w-12 h-12" />;
                    }
                    const isSelected = gheDangChon.includes(ghe.maGhe);
                    return (
                      <button
                        key={ghe.maGhe}
                        type="button"
                        disabled={ghe.daDat}
                        onClick={() => dispatch(toggleSeat(ghe.maGhe))}
                        title={ghe.tenGhe}
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
                  },
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-green-400 inline-block" />
            Ghế thường
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-yellow-400 inline-block" />
            Ghế Vip
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-red-500 inline-block" />
            Đang chọn
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-gray-500 inline-block" />
            Đã đặt
          </span>
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
            <b>Phòng chiếu:</b> {thongTinPhim.tenRap}
          </p>
          <p>
            <b>Địa chỉ:</b> {thongTinPhim.diaChi}
          </p>
          <p>
            <b>Ngày chiếu:</b> {thongTinPhim.ngayChieu} -{" "}
            {thongTinPhim.gioChieu}
          </p>
          <p>
            <b>Ghế đã chọn:</b> {tenGheDaChon || "Chưa chọn"}
          </p>
          <p>
            <b className="text-red-500">Tổng tiền:</b> {total.toLocaleString()}{" "}
            VND
          </p>
          <button
            type="button"
            disabled={submitting || gheDangChon.length === 0}
            onClick={handleDatVe}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded"
          >
            {submitting ? "Đang đặt vé..." : "Đặt vé"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;
