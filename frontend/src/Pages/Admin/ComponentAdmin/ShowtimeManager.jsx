import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayDanhSachLichChieuAPI,
  XoaLichChieuAPI,
} from "../../../API/ShowtimeAPI";

const ShowtimeManager = () => {
  const [showtimes, setShowtimes] = useState([]);

  const loadShowtimes = async () => {
    const data = await LayDanhSachLichChieuAPI();
    setShowtimes(data);
  };

  useEffect(() => {
    loadShowtimes();
  }, []);

  const handleDelete = async (maLichChieu) => {
    if (window.confirm("Bạn có muốn xoá lịch chiếu này không ?")) {
      try {
        await XoaLichChieuAPI(maLichChieu);
        await loadShowtimes();
      } catch (error) {
        alert(error?.response?.data?.message || "Không thể xoá");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý lịch chiếu</h2>
        <NavLink
          to={"/admin/showtime/addnew"}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          + Thêm lịch chiếu
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Phim</th>
              <th className="px-4 py-3">Rạp</th>
              <th className="px-4 py-3">Cụm rạp</th>
              <th className="px-4 py-3">Ngày giờ chiếu</th>
              <th className="px-4 py-3">Giá vé</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {showtimes?.map((s) => (
              <tr key={s.maLichChieu} className="border-b">
                <td className="px-4 py-3">{s.tenPhim}</td>
                <td className="px-4 py-3">{s.tenRap}</td>
                <td className="px-4 py-3">{s.tenCumRap}</td>
                <td className="px-4 py-3">
                  {new Date(s.ngayChieuGioChieu).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-3">{s.giaVe.toLocaleString()} VND</td>
                <td className="px-4 py-3">
                  <div className="flex">
                    <NavLink
                      to={`/admin/showtime/update/${s.maLichChieu}`}
                      className="text-green-700 hover:text-white border-2 border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                    >
                      Sửa
                    </NavLink>
                    <button
                      type="button"
                      className="text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      onClick={() => handleDelete(s.maLichChieu)}
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowtimeManager;
