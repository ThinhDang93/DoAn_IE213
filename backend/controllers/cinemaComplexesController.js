import * as CinemaComplexService from "../services/CinemaComplexService.js";
import * as CinemaSystemService from "../services/CinemaSystemService.js";
import * as RoomService from "../services/RoomService.js";
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
        const hinhAnhUrl = req.files?.File?.[0]?.path || hinhAnh;
        const galleryFiles = (req.files?.Gallery || []).map((file) => file.path);

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

        const system = await CinemaSystemService.LayThongTinHeThongRap(
            maHeThongRap
        );

        if (!system) {
            return sendError(res, new Error("He thong rap khong ton tai"), 400);
        }

        const createdComplex = await CinemaComplexService.ThemCumRap({
            tenCumRap,
            diaChi,
            hinhAnh: hinhAnhUrl,
            maHeThongRap,
            danhSachHinhAnh: galleryFiles,
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
        const {
            maCumRap,
            tenCumRap,
            diaChi,
            hinhAnh,
            maHeThongRap,
            danhSachHinhAnhGiuLai,
        } = req.body;
        const hinhAnhUrl = req.files?.File?.[0]?.path || hinhAnh;
        const galleryFiles = (req.files?.Gallery || []).map((file) => file.path);

        if (!maCumRap) {
            return sendError(res, new Error("Missing maCumRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maCumRap)) {
            return sendError(res, new Error("maCumRap is invalid"), 400);
        }

        if (maHeThongRap) {
            if (!mongoose.Types.ObjectId.isValid(maHeThongRap)) {
                return sendError(res, new Error("maHeThongRap is invalid"), 400);
            }

            const system = await CinemaSystemService.LayThongTinHeThongRap(
                maHeThongRap
            );

            if (!system) {
                return sendError(res, new Error("He thong rap khong ton tai"), 400);
            }
        }

        let danhSachHinhAnh;
        if (danhSachHinhAnhGiuLai !== undefined) {
            const keptImages = JSON.parse(danhSachHinhAnhGiuLai);
            danhSachHinhAnh = [...keptImages, ...galleryFiles];
        } else if (galleryFiles.length > 0) {
            const existing = await CinemaComplexService.LayThongTinCumRap(maCumRap);
            danhSachHinhAnh = [...(existing?.danhSachHinhAnh || []), ...galleryFiles];
        }

        const updatedComplex = await CinemaComplexService.CapNhatCumRap(maCumRap, {
            ...(tenCumRap !== undefined ? { tenCumRap } : {}),
            ...(diaChi !== undefined ? { diaChi } : {}),
            ...(hinhAnhUrl !== undefined ? { hinhAnh: hinhAnhUrl } : {}),
            ...(maHeThongRap !== undefined ? { maHeThongRap } : {}),
            ...(danhSachHinhAnh !== undefined ? { danhSachHinhAnh } : {}),
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

        const rooms = await RoomService.LayDanhSachRap({ maCumRap: MaCumRap });

        if (rooms.length > 0) {
            return sendError(
                res,
                new Error("Cum rap dang co phong chieu, khong the xoa"),
                400
            );
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