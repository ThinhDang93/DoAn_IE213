import express from "express";
import {
    CapNhatLichChieu,
    LayDanhSachLichChieu,
    LayThongTinLichChieu,
    LayThongTinLichChieuPhim,
    ThemLichChieu,
    XoaLichChieu,
} from "../controllers/showtimesController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/LayDanhSachLichChieu", LayDanhSachLichChieu);

router.get("/LayThongTinLichChieu", LayThongTinLichChieu);

router.get("/LayThongTinLichChieuPhim", LayThongTinLichChieuPhim);

router.post("/ThemLichChieu", verifyToken, checkAdmin, ThemLichChieu);

router.put("/CapNhatLichChieu", verifyToken, checkAdmin, CapNhatLichChieu);

router.delete("/XoaLichChieu", verifyToken, checkAdmin, XoaLichChieu);

export default router;