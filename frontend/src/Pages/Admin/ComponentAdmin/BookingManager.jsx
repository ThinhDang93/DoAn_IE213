import React, { useEffect, useState } from "react";
import {
  LayDanhSachVeDaBanAPI,
  ThongKeDoanhThuAPI,
} from "../../../API/BookingAPI";

const TRANG_THAI_LABEL = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  cancelled: "Đã huỷ",
};

const TRANG_THAI_CLASS = {
  pending: "text-yellow-600",
  paid: "text-green-600",
  cancelled: "text-red-600",
};

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ tongDoanhThu: 0, soVe: 0 });
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");

  const loadData = async () => {
    const params = {};
    if (tuNgay) params.TuNgay = tuNgay;
    if (denNgay) params.DenNgay = denNgay;

    const [bookingList, revenueStats] = await Promise.all([
      LayDanhSachVeDaBanAPI(params),
      ThongKeDoanhThuAPI(params),
    ]);
    setBookings(bookingList);
    setStats(revenueStats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vé đã bán</h2>

      <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Từ ngày</label>
          <input
            type="date"
            value={tuNgay}
            onChange={(e) => setTuNgay(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Đến ngày</label>
          <input
            type="date"
            value={denNgay}
            onChange={(e) => setDenNgay(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Lọc
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xl">
        <div className="bg-green-100 rounded-lg p-4">
          <p className="text-sm text-gray-600">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.tongDoanhThu.toLocaleString()} VND
          </p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-600">Số vé (không tính vé huỷ)</p>
          <p className="text-2xl font-bold text-blue-700">{stats.soVe}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Mã vé</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Phim</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3">Số ghế</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.maVe} className="border-b">
                <td className="px-4 py-3">{b.maVe}</td>
                <td className="px-4 py-3">
                  {b.hoTenKhachHang} ({b.taiKhoan})
                </td>
                <td className="px-4 py-3">{b.thongTinPhim.tenPhim}</td>
                <td className="px-4 py-3">
                  {new Date(b.ngayDat).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-3">{b.danhSachGhe.length}</td>
                <td className="px-4 py-3">{b.tongTien.toLocaleString()} VND</td>
                <td className="px-4 py-3">
                  <span className={TRANG_THAI_CLASS[b.trangThai] || ""}>
                    {TRANG_THAI_LABEL[b.trangThai] || b.trangThai}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManager;
