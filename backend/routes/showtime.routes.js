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
router.use(verifyToken, checkAdmin);

router.get("/LayDanhSachLichChieu", LayDanhSachLichChieu);

router.get("/LayThongTinLichChieu", LayThongTinLichChieu);

router.get("/LayThongTinLichChieuPhim", LayThongTinLichChieuPhim);

router.post("/ThemLichChieu", ThemLichChieu);

router.put("/CapNhatLichChieu", CapNhatLichChieu);

router.delete("/XoaLichChieu", XoaLichChieu);

export default router;