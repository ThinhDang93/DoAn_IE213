import * as CinemaSystemService from "../services/CinemaSystemService.js";
import * as CinemaComplexService from "../services/CinemaComplexService.js";
import { mapCinemaSystem } from "../utils/catalogMapper.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";
import mongoose from "mongoose";

export const LayThongTinHeThongRap = async (req, res) => {
    try {
        const { MaHeThongRap } = req.query;

        if (MaHeThongRap) {
            if (!mongoose.Types.ObjectId.isValid(MaHeThongRap)) {
                return sendError(res, new Error("MaHeThongRap is invalid"), 400);
            }

            const system = await CinemaSystemService.LayThongTinHeThongRap(MaHeThongRap);

            if (!system) {
                return sendError(res, new Error("Cinema system not found"), 404);
            }

            return sendSuccess(
                res,
                mapCinemaSystem(system, req),
                "Lay thong tin he thong rap thanh cong"
            );
        }

        const systems = await CinemaSystemService.LayDanhSachHeThongRap();
        const content = systems.map((system) => mapCinemaSystem(system, req));

        return sendSuccess(res, content, "Lay danh sach he thong rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThemHeThongRap = async (req, res) => {
    try {
        const { tenHeThongRap, logo, gioiThieu, namThanhLap } = req.body;
        const logoUrl = req.files?.File?.[0]?.path || logo;
        const galleryFiles = (req.files?.Gallery || []).map((file) => file.path);

        if (!tenHeThongRap || !logoUrl) {
            return sendError(
                res,
                new Error("tenHeThongRap va logo la bat buoc"),
                400
            );
        }

        const createdSystem = await CinemaSystemService.ThemHeThongRap({
            tenHeThongRap,
            logo: logoUrl,
            ...(gioiThieu !== undefined ? { gioiThieu } : {}),
            ...(namThanhLap !== undefined && namThanhLap !== ""
                ? { namThanhLap: Number(namThanhLap) }
                : {}),
            danhSachHinhAnh: galleryFiles,
        });

        return sendSuccess(
            res,
            mapCinemaSystem(createdSystem, req),
            "Them he thong rap thanh cong",
            201
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const CapNhatHeThongRap = async (req, res) => {
    try {
        const {
            maHeThongRap,
            tenHeThongRap,
            logo,
            gioiThieu,
            namThanhLap,
            danhSachHinhAnhGiuLai,
        } = req.body;
        const logoUrl = req.files?.File?.[0]?.path || logo;
        const galleryFiles = (req.files?.Gallery || []).map((file) => file.path);

        if (!maHeThongRap) {
            return sendError(res, new Error("Missing maHeThongRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maHeThongRap)) {
            return sendError(res, new Error("maHeThongRap is invalid"), 400);
        }

        let danhSachHinhAnh;
        if (danhSachHinhAnhGiuLai !== undefined) {
            const keptImages = JSON.parse(danhSachHinhAnhGiuLai);
            danhSachHinhAnh = [...keptImages, ...galleryFiles];
        } else if (galleryFiles.length > 0) {
            const existing = await CinemaSystemService.LayThongTinHeThongRap(
                maHeThongRap
            );
            danhSachHinhAnh = [...(existing?.danhSachHinhAnh || []), ...galleryFiles];
        }

        const updatedSystem = await CinemaSystemService.CapNhatHeThongRap(
            maHeThongRap,
            {
                ...(tenHeThongRap !== undefined ? { tenHeThongRap } : {}),
                ...(logoUrl !== undefined ? { logo: logoUrl } : {}),
                ...(gioiThieu !== undefined ? { gioiThieu } : {}),
                ...(namThanhLap !== undefined && namThanhLap !== ""
                    ? { namThanhLap: Number(namThanhLap) }
                    : {}),
                ...(danhSachHinhAnh !== undefined ? { danhSachHinhAnh } : {}),
            }
        );

        if (!updatedSystem) {
            return sendError(res, new Error("Cinema system not found"), 404);
        }

        return sendSuccess(
            res,
            mapCinemaSystem(updatedSystem, req),
            "Cap nhat he thong rap thanh cong"
        );
    } catch (error) {
        return sendError(res, error);
    }
};

export const XoaHeThongRap = async (req, res) => {
    try {
        const { MaHeThongRap } = req.query;

        if (!MaHeThongRap) {
            return sendError(res, new Error("Missing MaHeThongRap"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaHeThongRap)) {
            return sendError(res, new Error("MaHeThongRap is invalid"), 400);
        }

        const complexes = await CinemaComplexService.LayDanhSachCumRap({
            maHeThongRap: MaHeThongRap,
        });

        if (complexes.length > 0) {
            return sendError(
                res,
                new Error("He thong rap dang co cum rap, khong the xoa"),
                400
            );
        }

        const deletedSystem = await CinemaSystemService.XoaHeThongRap(MaHeThongRap);

        if (!deletedSystem) {
            return sendError(res, new Error("Cinema system not found"), 404);
        }

        return sendSuccess(res, null, "Xoa he thong rap thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};