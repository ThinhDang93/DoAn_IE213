import express from "express";
import {
    CapNhatRap,
    LayDanhSachRap,
    LayThongTinHeThongRap,
    LayThongTinLichChieuPhim,
    LayThongTinRap,
    ThemRap,
    XoaRap,
} from "../controllers/roomsController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/LayDanhSachRap", LayDanhSachRap);

router.get("/LayThongTinRap", LayThongTinRap);

router.post("/ThemRap", verifyToken, checkAdmin, ThemRap);

router.put("/CapNhatRap", verifyToken, checkAdmin, CapNhatRap);

router.delete("/XoaRap", verifyToken, checkAdmin, XoaRap);

router.get("/LayThongTinHeThongRap", LayThongTinHeThongRap);

router.get("/LayThongTinLichChieuPhim", LayThongTinLichChieuPhim);

export default router;