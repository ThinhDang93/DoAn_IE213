import * as MovieService from "../services/MovieService.js";
import * as ShowtimeService from "../services/ShowtimeService.js";
import { mapMovie } from "../utils/catalogMapper.js";
import {
    parseBoolean,
    parseDateInput,
    parseNumber,
} from "../utils/catalogParsers.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";
import mongoose from "mongoose";

export const LayDanhSachPhim = async (req, res) => {
    try {
        const movies = await MovieService.LayDanhSachPhim();
        const content = movies.map((movie) => mapMovie(movie, req));

        return sendSuccess(res, content, "Lay danh sach phim thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

const buildMoviePayload = (body, file) => {
    const payload = {};

    if (body.tenPhim !== undefined) {
        payload.tenPhim = String(body.tenPhim).trim();
    }

    if (body.trailer !== undefined) {
        payload.trailer = String(body.trailer).trim();
    }

    if (body.moTa !== undefined) {
        payload.moTa = String(body.moTa).trim();
    }

    if (body.ngayKhoiChieu !== undefined) {
        const parsedDate = parseDateInput(body.ngayKhoiChieu);
        if (!parsedDate) {
            throw new Error("ngayKhoiChieu is invalid");
        }
        payload.ngayKhoiChieu = parsedDate;
    }

    if (body.dangChieu !== undefined) {
        payload.dangChieu = parseBoolean(body.dangChieu);
    }

    if (body.sapChieu !== undefined) {
        payload.sapChieu = parseBoolean(body.sapChieu);
    }

    if (body.hot !== undefined) {
        payload.hot = parseBoolean(body.hot);
    }

    if (body.danhGia !== undefined) {
        payload.danhGia = parseNumber(body.danhGia, 0);
    }

    if (body.hinhAnh !== undefined && body.hinhAnh !== "") {
        payload.hinhAnh = String(body.hinhAnh);
    }

    if (file) {
        payload.hinhAnh = file.path;
    }

    return payload;
};

export const LayThongTinPhim = async (req, res) => {
    try {
        const { MaPhim } = req.query;

        if (!MaPhim) {
            return sendError(res, new Error("Missing MaPhim"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaPhim)) {
            return sendError(res, new Error("MaPhim is invalid"), 400);
        }

        const movie = await MovieService.LayThongTinPhim(MaPhim);

        if (!movie) {
            return sendError(res, new Error("Movie not found"), 404);
        }

        return sendSuccess(res, mapMovie(movie, req), "Lay thong tin phim thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThemPhimUploadHinh = async (req, res) => {
    try {
        const movieData = buildMoviePayload(req.body, req.file);

        if (!movieData.tenPhim || !movieData.ngayKhoiChieu || !movieData.hinhAnh) {
            return sendError(
                res,
                new Error("tenPhim, ngayKhoiChieu va hinhAnh la bat buoc"),
                400
            );
        }

        const movie = await MovieService.ThemPhim(movieData);

        return sendSuccess(res, mapMovie(movie, req), "Them phim thanh cong", 201);
    } catch (error) {
        return sendError(res, error);
    }
};

export const CapNhatPhimUpload = async (req, res) => {
    try {
        const { maPhim } = req.body;

        if (!maPhim) {
            return sendError(res, new Error("Missing maPhim in form-data"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maPhim)) {
            return sendError(res, new Error("maPhim is invalid"), 400);
        }

        const existingMovie = await MovieService.LayThongTinPhim(maPhim);

        if (!existingMovie) {
            return sendError(res, new Error("Movie not found"), 404);
        }

        const payload = buildMoviePayload(req.body, req.file);
        const updatedMovie = await MovieService.CapNhatPhim(maPhim, payload);

        return sendSuccess(
            res,
            mapMovie(updatedMovie, req),
            "Cap nhat phim thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const XoaPhim = async (req, res) => {
    try {
        const { MaPhim } = req.query;

        if (!MaPhim) {
            return sendError(res, new Error("Missing MaPhim"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaPhim)) {
            return sendError(res, new Error("MaPhim is invalid"), 400);
        }

        const showtimes = await ShowtimeService.LayDanhSachLichChieu({
            maPhim: MaPhim,
        });

        if (showtimes.length > 0) {
            return sendError(
                res,
                new Error("Phim dang co lich chieu, khong the xoa"),
                400
            );
        }

        const deletedMovie = await MovieService.XoaPhim(MaPhim);

        if (!deletedMovie) {
            return sendError(res, new Error("Movie not found"), 404);
        }

        return sendSuccess(res, null, "Xoa phim thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};