import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { toAbsoluteAssetUrl, toIdString, toIsoString } from "./catalogMapper.js";
import { VIETNAM_UTC_OFFSET_HOURS } from "./vietnamTime.js";

dayjs.extend(utc);

export const mapPhongVe = (showtime, seats, bookedIds) => {
    // showtime.ngayChieuGioChieu luu la UTC that trong DB; +7h de FORMAT
    // ra dung gio Viet Nam, khong dung dayjs(...) tho vi no se format
    // theo timezone cua server dang chay (Render la UTC, gay lech gio).
    const showDate = dayjs
        .utc(showtime.ngayChieuGioChieu)
        .add(VIETNAM_UTC_OFFSET_HOURS, "hour");
    const room = showtime.maRap;
    const complex = room?.maCumRap;

    return {
        thongTinPhim: {
            tenPhim: showtime.maPhim?.tenPhim || "",
            tenCumRap: complex?.tenCumRap || "",
            tenRap: room?.tenRap || "",
            diaChi: complex?.diaChi || "",
            ngayChieu: showDate.format("DD/MM/YYYY"),
            gioChieu: showDate.format("HH:mm"),
        },
        danhSachGhe: seats.map((seat) => ({
            maGhe: toIdString(seat._id),
            tenGhe: seat.tenGhe,
            loaiGhe: seat.loaiGhe,
            daDat: bookedIds.has(String(seat._id)),
            giaVe: Number(seat.giaVe ?? 0),
        })),
    };
};

export const mapBookingAdmin = (booking, req) => ({
    ...mapBookingHistory(booking, req),
    taiKhoan: booking.taiKhoan?.taiKhoan || "",
    hoTenKhachHang: booking.taiKhoan?.hoTen || "",
    emailKhachHang: booking.taiKhoan?.email || "",
});

export const mapBookingHistory = (booking, req) => {
    const showtime = booking.maLichChieu;
    const room = showtime?.maRap;
    const complex = room?.maCumRap;
    const system = complex?.maHeThongRap;

    return {
        maVe: toIdString(booking._id),
        ngayDat: toIsoString(booking.ngayDat),
        trangThai: booking.trangThai,
        tongTien: Number(booking.tongTien ?? 0),
        danhSachGhe: (booking.danhSachGhe || []).map((ghe) => ({
            maGhe: toIdString(ghe.maGhe?._id || ghe.maGhe),
            tenGhe: ghe.maGhe?.tenGhe || "",
            giaVe: Number(ghe.giaVe ?? 0),
        })),
        thongTinPhim: {
            maLichChieu: toIdString(showtime?._id),
            tenPhim: showtime?.maPhim?.tenPhim || "",
            hinhAnh: toAbsoluteAssetUrl(req, showtime?.maPhim?.hinhAnh),
            ngayChieuGioChieu: toIsoString(showtime?.ngayChieuGioChieu),
            tenHeThongRap: system?.tenHeThongRap || "",
            tenCumRap: complex?.tenCumRap || "",
            tenRap: room?.tenRap || "",
        },
    };
};
