import * as RoomService from "../services/RoomService.js";
import * as CinemaSystemService from "../services/CinemaSystemService.js";
import * as ShowtimeService from "../services/ShowtimeService.js";
import {
    buildShowtimeTreeByMovie,
    mapCinemaSystem,
    mapRoom,
} from "../utils/catalogMapper.js";
import { parseNumber } from "../utils/catalogParsers.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";
import mongoose from "mongoose";

export const LayDanhSachRap = async (req, res) => {
    try {
        const { MaCumRap } = req.query;
        const filter = {};

        if (MaCumRap) {
            if (!mongoose.Types.ObjectId.isValid(MaCumRap)) {
                return sendError(res, new Error("MaCumRap is invalid"), 400);
            }

            filter.maCumRap = MaCumRap;
        }

        const rooms = await RoomService.LayDanhSachRap(filter);
        const content = rooms.map((room) => mapRoom(room));

        return sendSuccess(res, content, "Lay danh sach rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayThongTinRap = async (req, res) => {
    try {
        const { MaRap } = req.query;

        if (!MaRap) {
            return sendError(res, new Error("Missing MaRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaRap)) {
            return sendError(res, new Error("MaRap is invalid"), 400);
        }

        const room = await RoomService.LayThongTinRap(MaRap);

        if (!room) {
            return sendError(res, new Error("Room not found"), 404);
        }

        return sendSuccess(res, mapRoom(room), "Lay thong tin rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThemRap = async (req, res) => {
    try {
        const { tenRap, maCumRap, soLuongGhe } = req.body;

        if (!tenRap || !maCumRap || soLuongGhe === undefined) {
            return sendError(
                res,
                new Error("tenRap, maCumRap va soLuongGhe la bat buoc"),
                400
            );
        }

        if (!mongoose.Types.ObjectId.isValid(maCumRap)) {
            return sendError(res, new Error("maCumRap is invalid"), 400);
        }

        const room = await RoomService.ThemRap({
            tenRap,
            maCumRap,
            soLuongGhe: parseNumber(soLuongGhe, 0),
        });

        return sendSuccess(res, mapRoom(room), "Them rap thanh cong", 201);
    } catch (error) {
        return sendError(res, error);
    }
};

export const CapNhatRap = async (req, res) => {
    try {
        const { maRap, tenRap, maCumRap, soLuongGhe } = req.body;

        if (!maRap) {
            return sendError(res, new Error("Missing maRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maRap)) {
            return sendError(res, new Error("maRap is invalid"), 400);
        }

        if (maCumRap && !mongoose.Types.ObjectId.isValid(maCumRap)) {
            return sendError(res, new Error("maCumRap is invalid"), 400);
        }

        const updatedRoom = await RoomService.CapNhatRap(maRap, {
            ...(tenRap !== undefined ? { tenRap } : {}),
            ...(maCumRap !== undefined ? { maCumRap } : {}),
            ...(soLuongGhe !== undefined
                ? { soLuongGhe: parseNumber(soLuongGhe, 0) }
                : {}),
        });

        if (!updatedRoom) {
            return sendError(res, new Error("Room not found"), 404);
        }

        return sendSuccess(res, mapRoom(updatedRoom), "Cap nhat rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const XoaRap = async (req, res) => {
    try {
        const { MaRap } = req.query;

        if (!MaRap) {
            return sendError(res, new Error("Missing MaRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaRap)) {
            return sendError(res, new Error("MaRap is invalid"), 400);
        }

        const deletedRoom = await RoomService.XoaRap(MaRap);

        if (!deletedRoom) {
            return sendError(res, new Error("Room not found"), 404);
        }

        return sendSuccess(res, null, "Xoa rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayThongTinHeThongRap = async (req, res) => {
    try {
        const systems = await CinemaSystemService.LayDanhSachHeThongRap();
        const content = systems.map((system) => mapCinemaSystem(system, req));

        return sendSuccess(res, content, "Lay thong tin he thong rap thanh cong");
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

