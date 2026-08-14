import React, { useEffect, useState } from "react";
import { HuyVeAPI, LayLichSuDatVeAPI } from "../../API/BookingAPI";

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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    const data = await LayLichSuDatVeAPI();
    setBookings(data);
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      setUser(JSON.parse(raw));
    }
    loadBookings().finally(() => setLoading(false));
  }, []);

  const handleHuyVe = async (maVe) => {
    if (!window.confirm("Bạn có chắc muốn huỷ vé này không?")) {
      return;
    }

    try {
      await HuyVeAPI(maVe);
      await loadBookings();
    } catch (error) {
      alert(error?.response?.data?.message || "Huỷ vé thất bại");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <h2 className="text-2xl font-bold mb-4">Hồ sơ của tôi</h2>

        {user && (
          <div className="bg-gray-100 p-4 rounded shadow mb-6 space-y-1">
            <p>
              <b>Tài khoản:</b> {user.taiKhoan}
            </p>
            <p>
              <b>Họ tên:</b> {user.hoTen}
            </p>
            <p>
              <b>Email:</b> {user.email}
            </p>
            <p>
              <b>Số điện thoại:</b> {user.soDT}
            </p>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-3">Lịch sử đặt vé</h3>

        {loading ? (
          <p>Đang tải...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">Chưa có vé nào.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.maVe} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold">{b.thongTinPhim.tenPhim}</p>
                    <p className="text-sm text-gray-600">
                      {b.thongTinPhim.tenHeThongRap} - {b.thongTinPhim.tenCumRap} -{" "}
                      {b.thongTinPhim.tenRap}
                    </p>
                    <p className="text-sm text-gray-600">
                      Suất chiếu:{" "}
                      {new Date(b.thongTinPhim.ngayChieuGioChieu).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                    <p className="text-sm">Số ghế: {b.danhSachGhe.length}</p>
                    <p className="text-sm">
                      Tổng tiền: {b.tongTien.toLocaleString()} VND
                    </p>
                    <p className="text-sm">
                      Trạng thái:{" "}
                      <span
                        className={
                          TRANG_THAI_CLASS[b.trangThai] || "text-gray-600"
                        }
                      >
                        {TRANG_THAI_LABEL[b.trangThai] || b.trangThai}
                      </span>
                    </p>
                  </div>
                  {b.trangThai !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => handleHuyVe(b.maVe)}
                      className="shrink-0 text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                    >
                      Huỷ vé
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
