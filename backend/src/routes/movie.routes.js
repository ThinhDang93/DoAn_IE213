import express from "express";
import upload from "../config/multer.js";
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

router.post("/ThemPhimUploadHinh", upload.single("File"), ThemPhimUploadHinh);

router.post("/CapNhatPhimUpload", upload.single("File"), CapNhatPhimUpload);

router.put("/CapNhatPhimUpload", upload.single("File"), CapNhatPhimUpload);

router.delete("/XoaPhim", XoaPhim);

export default router;