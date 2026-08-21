import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { LayDanhSachPhimAPI } from "../../../API/APIFilm";
import { LayDanhSachRapAPI } from "../../../API/CinemaAPI";
import {
  CapNhatLichChieuAPI,
  LayThongTinLichChieuAPI,
  ThemLichChieuAPI,
} from "../../../API/ShowtimeAPI";
import { toVietnamDatetimeLocalValue } from "../../../utils/vietnamTime";

const FormShowtime = () => {
  const match = useMatch("/admin/showtime/update/:maLichChieu");
  const params = useParams();
  const navigate = useNavigate();
  const isEdit = !!match;

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const frmShowtime = useFormik({
    enableReinitialize: true,
    initialValues: {
      maPhim: "",
      maRap: "",
      ngayChieuGioChieu: "",
      giaVe: "",
    },
    onSubmit: async (values) => {
      try {
        const payload = { ...values, giaVe: Number(values.giaVe) };
        if (isEdit) {
          await CapNhatLichChieuAPI(params.maLichChieu, payload);
          alert("Cập nhật lịch chiếu thành công");
        } else {
          await ThemLichChieuAPI(payload);
          alert("Thêm lịch chiếu thành công");
        }
        navigate("/admin/showtime");
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          (isEdit ? "Cập nhật thất bại" : "Thêm lịch chiếu thất bại");
        alert(message);
      }
    },
  });

  const loadOptions = async () => {
    const [movieList, roomList] = await Promise.all([
      LayDanhSachPhimAPI(),
      LayDanhSachRapAPI(),
    ]);
    setMovies(movieList);
    setRooms(roomList);
  };

  const loadShowtimeEdit = async () => {
    const data = await LayThongTinLichChieuAPI(params.maLichChieu);
    frmShowtime.setValues({
      maPhim: data.maPhim,
      maRap: data.maRap,
      ngayChieuGioChieu: toVietnamDatetimeLocalValue(data.ngayChieuGioChieu),
      giaVe: data.giaVe,
    });
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (isEdit && params.maLichChieu) {
      loadShowtimeEdit();
    }
  }, [isEdit, params.maLichChieu]);

  return (
    <div className="p-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {isEdit ? "Cập nhật" : "Thêm mới"} lịch chiếu
        </h2>
      </div>
      <form
        className="space-y-4 max-w-lg"
        onSubmit={frmShowtime.handleSubmit}
      >
        <div>
          <label className="block mb-1 font-medium">Phim</label>
          <select
            id="maPhim"
            name="maPhim"
            value={frmShowtime.values.maPhim}
            onChange={frmShowtime.handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">-- Chọn phim --</option>
            {movies.map((m) => (
              <option key={m.maPhim} value={m.maPhim}>
                {m.tenPhim}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Phòng chiếu</label>
          <select
            id="maRap"
            name="maRap"
            value={frmShowtime.values.maRap}
            onChange={frmShowtime.handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">-- Chọn phòng chiếu --</option>
            {rooms.map((r) => (
              <option key={r.maRap} value={r.maRap}>
                {r.tenRap}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Ngày giờ chiếu</label>
          <input
            id="ngayChieuGioChieu"
            name="ngayChieuGioChieu"
            type="datetime-local"
            value={frmShowtime.values.ngayChieuGioChieu}
            onChange={frmShowtime.handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Giá vé mặc định</label>
          <input
            id="giaVe"
            name="giaVe"
            type="number"
            min="0"
            value={frmShowtime.values.giaVe}
            onChange={frmShowtime.handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            {isEdit ? "Cập nhật" : "Thêm"} lịch chiếu
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormShowtime;
