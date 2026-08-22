import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { HuyVeAPI, LayLichSuDatVeAPI } from "../../API/BookingAPI";
import { formatVietnamDateTime } from "../../utils/vietnamTime";
import SampleQRCode from "./SampleQRCode";

const COUNTDOWN_SECONDS = 15 * 60;

const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const PaymentPending = () => {
  const { maVe } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  // outcome: null (dang cho) | "success" | "expired" | "failed"
  const [outcome, setOutcome] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await LayLichSuDatVeAPI();
      const found = data.find((b) => b.maVe === maVe) || null;
      setBooking(found);
      if (found && found.trangThai !== "pending") {
        setOutcome(found.trangThai === "cancelled" ? "expired" : "success");
      }
      setLoading(false);
    };
    load();
  }, [maVe]);

  useEffect(() => {
    if (!booking || booking.trangThai !== "pending" || outcome) return;

    if (secondsLeft <= 0) {
      handleHuyGiaoDich("expired");
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, booking, outcome]);

  const handleHuyGiaoDich = async (reason) => {
    if (processing || outcome) return;
    setProcessing(true);
    try {
      await HuyVeAPI(maVe);
    } catch (error) {
      // Ve co the da bi huy tu truoc do (vd nguoi dung mo 2 tab) - bo qua,
      // van chuyen sang trang thai da huy tren giao dien.
    }
    setOutcome(reason);
    setProcessing(false);
  };

  const handleXacNhanDaThanhToan = () => {
    // Mo phong giao dien: du an chua tich hop cong thanh toan / API xac
    // nhan thanh toan that o backend, nen ve trong DB van giu nguyen trang
    // thai "pending" - buoc nay chi mo phong trai nghiem thanh cong cho
    // nguoi dung tren UI theo yeu cau, khong goi API nao them.
    setOutcome("success");
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6 pt-24">Đang tải...</div>;
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto p-6 pt-24 text-center">
        <p className="text-gray-600 mb-4">
          Không tìm thấy vé này hoặc vé không thuộc về tài khoản của bạn.
        </p>
        <NavLink to="/" className="text-blue-600 hover:underline">
          &larr; Về trang chủ
        </NavLink>
      </div>
    );
  }

  const { thongTinPhim, danhSachGhe, tongTien } = booking;
  const tenGheDaChon = danhSachGhe.map((g) => g.tenGhe).join(", ");

  return (
    <div className="max-w-3xl mx-auto p-6 pt-24">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Xác nhận thanh toán
      </h2>

      <div className="border rounded-2xl shadow-sm p-6 space-y-6">
        {/* Thong tin ve */}
        <div className="flex gap-4">
          {thongTinPhim.hinhAnh && (
            <img
              src={thongTinPhim.hinhAnh}
              alt={thongTinPhim.tenPhim}
              className="w-20 h-28 object-cover rounded-lg shrink-0"
            />
          )}
          <div className="space-y-1">
            <p className="font-bold text-lg">{thongTinPhim.tenPhim}</p>
            <p className="text-sm text-gray-600">
              {thongTinPhim.tenHeThongRap} - {thongTinPhim.tenCumRap} -{" "}
              {thongTinPhim.tenRap}
            </p>
            <p className="text-sm text-gray-600">
              Suất chiếu: {formatVietnamDateTime(thongTinPhim.ngayChieuGioChieu)}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Ghế:</span> {tenGheDaChon}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-red-500">Tổng tiền:</span>{" "}
              {tongTien.toLocaleString()} VND
            </p>
          </div>
        </div>

        {outcome === null && (
          <>
            <hr />
            {/* QR + dem nguoc */}
            <div className="flex flex-col items-center gap-3">
              <SampleQRCode />
              <p className="text-xs text-gray-400 text-center max-w-xs">
                Mã QR mẫu minh hoạ - dự án chưa tích hợp cổng thanh toán thật
              </p>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vui lòng thanh toán trong
                </p>
                <p
                  className={`text-3xl font-bold tabular-nums ${
                    secondsLeft <= 60 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {formatCountdown(secondsLeft)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                disabled={processing}
                onClick={handleXacNhanDaThanhToan}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                Tôi đã thanh toán
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleHuyGiaoDich("failed")}
                className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 font-medium px-6 py-2.5 rounded-lg transition"
              >
                Huỷ giao dịch
              </button>
            </div>
          </>
        )}

        {outcome === "expired" || outcome === "failed" ? (
          <>
            <hr />
            <div className="text-center space-y-3">
              <p className="text-red-600 font-semibold text-lg">
                {outcome === "expired"
                  ? "Đã hết thời gian thanh toán"
                  : "Giao dịch đã bị huỷ"}
              </p>
              <p className="text-gray-600 text-sm">
                Vé đã được huỷ, ghế và lịch chiếu đã được trả lại cho hệ thống.
              </p>
              <NavLink
                to="/"
                className="inline-block mt-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                Về trang chủ
              </NavLink>
            </div>
          </>
        ) : null}
      </div>

      {/* Popup thanh toan thanh cong */}
      {outcome === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="text-xl font-bold">Thanh toán thành công!</h3>
            <p className="text-gray-600 text-sm">
              Cảm ơn bạn đã đặt vé. Thông tin vé đã được lưu vào hồ sơ của bạn.
            </p>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
            >
              Xem vé của tôi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPending;
