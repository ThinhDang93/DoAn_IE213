import * as ShowtimeService from "../services/ShowtimeService.js";
import * as MovieService from "../services/MovieService.js";
import * as RoomService from "../services/RoomService.js";
import * as BookingService from "../services/BookingService.js";
import {
    buildShowtimeTreeByMovie,
    mapShowtime,
} from "../utils/catalogMapper.js";
import { parseDateInput, parseNumber } from "../utils/catalogParsers.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";
import mongoose from "mongoose";

const buildShowtimePayload = (body) => {
    const payload = {};

    if (body.maPhim !== undefined) {
        payload.maPhim = body.maPhim;
    }

    if (body.maRap !== undefined) {
        payload.maRap = body.maRap;
    }

    if (body.giaVe !== undefined) {
        payload.giaVe = parseNumber(body.giaVe, 0);
    }

    if (body.ngayChieuGioChieu !== undefined) {
        const parsedDate = parseDateInput(body.ngayChieuGioChieu);

        if (!parsedDate) {
            throw new Error("ngayChieuGioChieu is invalid");
        }

        payload.ngayChieuGioChieu = parsedDate;
    }

    return payload;
};

export const LayDanhSachLichChieu = async (req, res) => {
    try {
        const { MaPhim } = req.query;
        const filter = {};

        if (MaPhim) {
            if (!mongoose.Types.ObjectId.isValid(MaPhim)) {
                return sendError(res, new Error("MaPhim is invalid"), 400);
            }

            filter.maPhim = MaPhim;
        }

        const data = await ShowtimeService.LayDanhSachLichChieu(filter);
        const content = data.map((showtime) => mapShowtime(showtime));

        return sendSuccess(res, content, "Lay danh sach lich chieu thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayThongTinLichChieu = async (req, res) => {
    try {
        const { MaLichChieu: maLichChieu } = req.query;

        if (!maLichChieu) {
            return sendError(res, new Error("Missing MaLichChieu"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maLichChieu)) {
            return sendError(res, new Error("MaLichChieu is invalid"), 400);
        }

        const showtime = await ShowtimeService.LayThongTinLichChieu(maLichChieu);

        if (!showtime) {
            return sendError(res, new Error("Showtime not found"), 404);
        }

        return sendSuccess(
            res,
            mapShowtime(showtime),
            "Lay thong tin lich chieu thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThemLichChieu = async (req, res) => {
    try {
        const payload = buildShowtimePayload(req.body);

        if (
            !payload.maPhim ||
            !payload.maRap ||
            !payload.ngayChieuGioChieu ||
            payload.giaVe === undefined
        ) {
            return sendError(
                res,
                new Error("maPhim, maRap, ngayChieuGioChieu va giaVe la bat buoc"),
                400
            );
        }

        if (!mongoose.Types.ObjectId.isValid(payload.maPhim)) {
            return sendError(res, new Error("maPhim is invalid"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(payload.maRap)) {
            return sendError(res, new Error("maRap is invalid"), 400);
        }

        const movie = await MovieService.LayThongTinPhim(payload.maPhim);

        if (!movie) {
            return sendError(res, new Error("Phim khong ton tai"), 400);
        }

        const room = await RoomService.LayThongTinRap(payload.maRap);

        if (!room) {
            return sendError(res, new Error("Phong chieu khong ton tai"), 400);
        }

        const createdShowtime = await ShowtimeService.ThemLichChieu(payload);

        return sendSuccess(
            res,
            mapShowtime(createdShowtime),
            "Them lich chieu thanh cong",
            201
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const CapNhatLichChieu = async (req, res) => {
    try {
        const { maLichChieu } = req.body;

        if (!maLichChieu) {
            return sendError(res, new Error("Missing maLichChieu"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maLichChieu)) {
            return sendError(res, new Error("maLichChieu is invalid"), 400);
        }

        const payload = buildShowtimePayload(req.body);

        if (payload.maPhim) {
            if (!mongoose.Types.ObjectId.isValid(payload.maPhim)) {
                return sendError(res, new Error("maPhim is invalid"), 400);
            }

            const movie = await MovieService.LayThongTinPhim(payload.maPhim);

            if (!movie) {
                return sendError(res, new Error("Phim khong ton tai"), 400);
            }
        }

        if (payload.maRap) {
            if (!mongoose.Types.ObjectId.isValid(payload.maRap)) {
                return sendError(res, new Error("maRap is invalid"), 400);
            }

            const room = await RoomService.LayThongTinRap(payload.maRap);

            if (!room) {
                return sendError(res, new Error("Phong chieu khong ton tai"), 400);
            }
        }

        const updatedShowtime = await ShowtimeService.CapNhatLichChieu(
            maLichChieu,
            payload
        );

        if (!updatedShowtime) {
            return sendError(res, new Error("Showtime not found"), 404);
        }

        return sendSuccess(
            res,
            mapShowtime(updatedShowtime),
            "Cap nhat lich chieu thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const XoaLichChieu = async (req, res) => {
    try {
        const { MaLichChieu: maLichChieu } = req.query;

        if (!maLichChieu) {
            return sendError(res, new Error("Missing MaLichChieu"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maLichChieu)) {
            return sendError(res, new Error("MaLichChieu is invalid"), 400);
        }

        const soVeChuaHuy = await BookingService.DemVeChuaHuyTheoLichChieu(
            maLichChieu
        );

        if (soVeChuaHuy > 0) {
            return sendError(
                res,
                new Error("Lich chieu dang co ve da dat, khong the xoa"),
                400
            );
        }

        const deletedShowtime = await ShowtimeService.XoaLichChieu(maLichChieu);

        if (!deletedShowtime) {
            return sendError(res, new Error("Showtime not found"), 404);
        }

        return sendSuccess(res, null, "Xoa lich chieu thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayThongTinLichChieuPhim = async (req, res) => {
    try {
        const { MaPhim } = req.query;

        if (!MaPhim) {
            return sendError(res, new Error("Missing MaPhim"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaPhim)) {
            return sendError(res, new Error("MaPhim is invalid"), 400);
        }

        const showtimes = await ShowtimeService.LayThongTinLichChieuPhim(MaPhim);
        const content = buildShowtimeTreeByMovie(showtimes, req);

        return sendSuccess(res, content, "Lay thong tin lich chieu phim thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};