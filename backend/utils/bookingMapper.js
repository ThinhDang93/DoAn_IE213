import dayjs from "dayjs";
import { toAbsoluteAssetUrl, toIdString, toIsoString } from "./catalogMapper.js";

export const mapPhongVe = (showtime, seats, bookedIds) => {
    const showDate = dayjs(showtime.ngayChieuGioChieu);
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
            maGhe: toIdString(ghe.maGhe),
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
