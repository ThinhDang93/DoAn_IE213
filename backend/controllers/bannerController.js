import * as BannerService from "../services/BannerService.js";
import { toAbsoluteAssetUrl, toIdString } from "../utils/catalogMapper.js";
import { sendError, sendSuccess } from "../utils/httpResponse.js";
import mongoose from "mongoose";

const mapBanner = (banner, req) => ({
    maBanner: toIdString(banner._id),
    hinhAnh: toAbsoluteAssetUrl(req, banner.hinhAnh),
    thuTu: Number(banner.thuTu ?? 0),
});

export const LayDanhSachBanner = async (req, res) => {
    try {
        const banners = await BannerService.LayDanhSachBanner();
        const content = banners.map((banner) => mapBanner(banner, req));

        return sendSuccess(res, content, "Lay danh sach banner thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const ThemBanner = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, new Error("Anh banner la bat buoc"), 400);
        }

        const { thuTu } = req.body;

        const created = await BannerService.ThemBanner({
            hinhAnh: req.file.path,
            ...(thuTu !== undefined ? { thuTu: Number(thuTu) } : {}),
        });

        return sendSuccess(res, mapBanner(created, req), "Them banner thanh cong", 201);
    } catch (error) {
        return sendError(res, error);
    }
};

export const CapNhatBanner = async (req, res) => {
    try {
        const { maBanner, thuTu } = req.body;

        if (!maBanner) {
            return sendError(res, new Error("Missing maBanner"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(maBanner)) {
            return sendError(res, new Error("maBanner is invalid"), 400);
        }

        const updated = await BannerService.CapNhatBanner(maBanner, {
            ...(req.file ? { hinhAnh: req.file.path } : {}),
            ...(thuTu !== undefined ? { thuTu: Number(thuTu) } : {}),
        });

        if (!updated) {
            return sendError(res, new Error("Banner not found"), 404);
        }

        return sendSuccess(res, mapBanner(updated, req), "Cap nhat banner thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};

export const XoaBanner = async (req, res) => {
    try {
        const { MaBanner } = req.query;

        if (!MaBanner) {
            return sendError(res, new Error("Missing MaBanner"), 400);
        }

        if (!mongoose.Types.ObjectId.isValid(MaBanner)) {
            return sendError(res, new Error("MaBanner is invalid"), 400);
        }

        const deleted = await BannerService.XoaBanner(MaBanner);

        if (!deleted) {
            return sendError(res, new Error("Banner not found"), 404);
        }

        return sendSuccess(res, null, "Xoa banner thanh cong");
    } catch (error) {
        return sendError(res, error);
    }
};
