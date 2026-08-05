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

router.use(verifyToken, checkAdmin);
router.get("/LayDanhSachRap", LayDanhSachRap);

router.get("/LayThongTinRap", LayThongTinRap);

router.post("/ThemRap", ThemRap);

router.put("/CapNhatRap", CapNhatRap);

router.delete("/XoaRap", XoaRap);

router.get("/LayThongTinHeThongRap", LayThongTinHeThongRap);

router.get("/LayThongTinLichChieuPhim", LayThongTinLichChieuPhim);

export default router;