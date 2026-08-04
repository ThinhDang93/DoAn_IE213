import * as CinemaComplexService from "../services/CinemaComplexService.js";
import { mapCinemaComplex } from "../utils/catalogMapper.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";
import mongoose from "mongoose";

export const LayDanhSachCumRap = async (req, res) => {
    try {
        const { MaHeThongRap } = req.query;
        const filter = {};

        if (MaHeThongRap) {
            if (!mongoose.Types.ObjectId.isValid(MaHeThongRap)) {
                return sendError(res, new Error("MaHeThongRap is invalid"), 400);
            }

            filter.maHeThongRap = MaHeThongRap;
        }

        const complexes = await CinemaComplexService.LayDanhSachCumRap(filter);
        const content = complexes.map((complex) => mapCinemaComplex(complex, req));

        return sendSuccess(res, content, "Lay danh sach cum rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const LayThongTinCumRap = async (req, res) => {
    try {
        const { MaCumRap } = req.query;

        if (!MaCumRap) {
            return sendError(res, new Error("Missing MaCumRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaCumRap)) {
            return sendError(res, new Error("MaCumRap is invalid"), 400);
        }

        const complex = await CinemaComplexService.LayThongTinCumRap(MaCumRap);

        if (!complex) {
            return sendError(res, new Error("Cinema complex not found"), 404);
        }

        return sendSuccess(
            res,
            mapCinemaComplex(complex, req),
            "Lay thong tin cum rap thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThemCumRap = async (req, res) => {
    try {
        const { tenCumRap, diaChi, hinhAnh = "", maHeThongRap } = req.body;

        if (!tenCumRap || !diaChi || !maHeThongRap) {
            return sendError(
                res,
                new Error("tenCumRap, diaChi va maHeThongRap la bat buoc"),
                400
            );
        }

        if (!mongoose.Types.ObjectId.isValid(maHeThongRap)) {
            return sendError(res, new Error("maHeThongRap is invalid"), 400);
        }

        const createdComplex = await CinemaComplexService.ThemCumRap({
            tenCumRap,
            diaChi,
            hinhAnh,
            maHeThongRap,
        });

        return sendSuccess(
            res,
            mapCinemaComplex(createdComplex, req),
            "Them cum rap thanh cong",
            201
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const CapNhatCumRap = async (req, res) => {
    try {
        const { maCumRap, tenCumRap, diaChi, hinhAnh, maHeThongRap } = req.body;

        if (!maCumRap) {
            return sendError(res, new Error("Missing maCumRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maCumRap)) {
            return sendError(res, new Error("maCumRap is invalid"), 400);
        }

        if (maHeThongRap && !mongoose.Types.ObjectId.isValid(maHeThongRap)) {
            return sendError(res, new Error("maHeThongRap is invalid"), 400);
        }

        const updatedComplex = await CinemaComplexService.CapNhatCumRap(maCumRap, {
            ...(tenCumRap !== undefined ? { tenCumRap } : {}),
            ...(diaChi !== undefined ? { diaChi } : {}),
            ...(hinhAnh !== undefined ? { hinhAnh } : {}),
            ...(maHeThongRap !== undefined ? { maHeThongRap } : {}),
        });

        if (!updatedComplex) {
            return sendError(res, new Error("Cinema complex not found"), 404);
        }

        return sendSuccess(
            res,
            mapCinemaComplex(updatedComplex, req),
            "Cap nhat cum rap thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const XoaCumRap = async (req, res) => {
    try {
        const { MaCumRap } = req.query;

        if (!MaCumRap) {
            return sendError(res, new Error("Missing MaCumRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaCumRap)) {
            return sendError(res, new Error("MaCumRap is invalid"), 400);
        }

        const deletedComplex = await CinemaComplexService.XoaCumRap(MaCumRap);

        if (!deletedComplex) {
            return sendError(res, new Error("Cinema complex not found"), 404);
        }

        return sendSuccess(res, null, "Xoa cum rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};