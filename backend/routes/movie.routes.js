import express from "express";
import { uploadMovie as upload } from "../middlewares/multer.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";
import {
    CapNhatPhimUpload,
    LayDanhSachBanner,
    LayDanhSachPhim,
    LayThongTinPhim,
    ThemPhimUploadHinh,
    XoaPhim,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/LayDanhSachPhim", LayDanhSachPhim);

router.get("/LayThongTinPhim", LayThongTinPhim);

router.get("/LayDanhSachBanner", LayDanhSachBanner);

router.post(
    "/ThemPhimUploadHinh",
    verifyToken,
    checkAdmin,
    upload.single("File"),
    ThemPhimUploadHinh
);

router.post(
    "/CapNhatPhimUpload",
    verifyToken,
    checkAdmin,
    upload.single("File"),
    CapNhatPhimUpload
);

router.put(
    "/CapNhatPhimUpload",
    verifyToken,
    checkAdmin,
    upload.single("File"),
    CapNhatPhimUpload
);

router.delete("/XoaPhim", verifyToken, checkAdmin, XoaPhim);

export default router;