import mongoose from "mongoose";
import Showtime from "../models/showtimes.js";
import * as SeatService from "../services/SeatService.js";
import * as BookingService from "../services/BookingService.js";
import { mapBookingAdmin, mapBookingHistory, mapPhongVe } from "../utils/bookingMapper.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";

const buildNgayDatFilter = (query) => {
    const { TuNgay, DenNgay } = query;

    if (!TuNgay && !DenNgay) {
        return {};
    }

    const ngayDat = {};
    if (TuNgay) {
        ngayDat.$gte = new Date(TuNgay);
    }
    if (DenNgay) {
        ngayDat.$lte = new Date(DenNgay);
    }

    return { ngayDat };
};

const SHOWTIME_ROOM_POPULATE = [
    { path: "maPhim" },
    { path: "maRap", populate: { path: "maCumRap" } },
];

export const LayDanhSachPhongVe = async (req, res) => {
    try {
        const { MaLichChieu } = req.query;

        if (!MaLichChieu) {
            return sendError(res, new Error("Missing MaLichChieu"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaLichChieu)) {
            return sendError(res, new Error("MaLichChieu is invalid"), 400);
        }

        const showtime = await Showtime.findById(MaLichChieu)
            .populate(SHOWTIME_ROOM_POPULATE)
            .lean();

        if (!showtime) {
            return sendError(res, new Error("Showtime not found"), 404);
        }

        const seats = await SeatService.LayDanhSachGheTheoRap(showtime.maRap._id);
        const bookedIds = await SeatService.LayTapMaGheDaDat(MaLichChieu);

        const content = mapPhongVe(showtime, seats, bookedIds);

        return sendSuccess(res, content, "Lay danh sach phong ve thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const DatVe = async (req, res) => {
    try {
        const { maLichChieu, danhSachGhe } = req.body;

        if (!maLichChieu || !mongoose.Types.ObjectId.isValid(maLichChieu)) {
            return sendError(res, new Error("maLichChieu is invalid"), 400);
        }

        if (!Array.isArray(danhSachGhe) || danhSachGhe.length === 0) {
            return sendError(
                res,
                new Error("danhSachGhe la bat buoc va phai la mang khong rong"),
                400
            );
        }

        if (danhSachGhe.some((maGhe) => !mongoose.Types.ObjectId.isValid(maGhe))) {
            return sendError(res, new Error("danhSachGhe chua maGhe khong hop le"), 400);
        }

        const showtime = await Showtime.findById(maLichChieu).lean();
        if (!showtime) {
            return sendError(res, new Error("Showtime not found"), 404);
        }

        const uniqueSeatIds = [...new Set(danhSachGhe.map(String))];
        const seats = await SeatService.LayGheTheoIds(uniqueSeatIds);

        if (seats.length !== uniqueSeatIds.length) {
            return sendError(res, new Error("Mot so ghe khong ton tai"), 400);
        }

        const saiPhongChieu = seats.some(
            (seat) => String(seat.maRap) !== String(showtime.maRap)
        );
        if (saiPhongChieu) {
            return sendError(
                res,
                new Error("Ghe khong thuoc phong chieu cua lich chieu nay"),
                400
            );
        }

        const bookedIds = await SeatService.LayTapMaGheDaDat(maLichChieu);
        const gheDaBiDat = uniqueSeatIds.some((maGhe) => bookedIds.has(maGhe));
        if (gheDaBiDat) {
            return sendError(
                res,
                new Error("Ghe da duoc dat, vui long chon ghe khac"),
                409
            );
        }

        const danhSachGheSnapshot = seats.map((seat) => ({
            maGhe: seat._id,
            giaVe: seat.giaVe,
        }));
        const tongTien = danhSachGheSnapshot.reduce(
            (tong, ghe) => tong + ghe.giaVe,
            0
        );

        const booking = await BookingService.TaoBooking({
            taiKhoan: req.user.id,
            maLichChieu,
            danhSachGhe: danhSachGheSnapshot,
            tongTien,
        });

        return sendSuccess(
            res,
            {
                maVe: String(booking._id),
                tongTien: booking.tongTien,
                trangThai: booking.trangThai,
                danhSachGhe: danhSachGheSnapshot.map((ghe) => ({
                    maGhe: String(ghe.maGhe),
                    giaVe: ghe.giaVe,
                })),
            },
            "Dat ve thanh cong",
            201
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayLichSuDatVe = async (req, res) => {
    try {
        const bookings = await BookingService.LayLichSuDatVeTheoTaiKhoan(req.user.id);
        const content = bookings.map((booking) => mapBookingHistory(booking, req));

        return sendSuccess(res, content, "Lay lich su dat ve thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const HuyVe = async (req, res) => {
    try {
        const { MaVe } = req.query;

        if (!MaVe || !mongoose.Types.ObjectId.isValid(MaVe)) {
            return sendError(res, new Error("MaVe is invalid"), 400);
        }

        const booking = await BookingService.LayBookingTheoId(MaVe);

        if (!booking) {
            return sendError(res, new Error("Booking not found"), 404);
        }

        if (String(booking.taiKhoan) !== String(req.user.id)) {
            return sendError(res, new Error("Ban khong co quyen huy ve nay"), 403);
        }

        if (booking.trangThai === "cancelled") {
            return sendError(res, new Error("Ve nay da bi huy truoc do"), 400);
        }

        const updated = await BookingService.HuyBooking(booking);

        return sendSuccess(
            res,
            { maVe: String(updated._id), trangThai: updated.trangThai },
            "Huy ve thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayDanhSachVeDaBan = async (req, res) => {
    try {
        const { MaPhim } = req.query;
        const filter = buildNgayDatFilter(req.query);

        const bookings = await BookingService.LayDanhSachVeDaBan(filter);
        let content = bookings.map((booking) => mapBookingAdmin(booking, req));

        if (MaPhim) {
            content = content.filter(
                (booking) => booking.thongTinPhim.maPhim === MaPhim
            );
        }

        return sendSuccess(res, content, "Lay danh sach ve da ban thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThongKeDoanhThu = async (req, res) => {
    try {
        const filter = buildNgayDatFilter(req.query);
        const stats = await BookingService.ThongKeDoanhThu(filter);

        return sendSuccess(res, stats, "Thong ke doanh thu thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};
