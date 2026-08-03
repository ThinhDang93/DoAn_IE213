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

const router = express.Router();

router.get("/LayDanhSachRap", LayDanhSachRap);

router.get("/LayThongTinRap", LayThongTinRap);

router.post("/ThemRap", ThemRap);

router.put("/CapNhatRap", CapNhatRap);

router.delete("/XoaRap", XoaRap);

router.get("/LayThongTinHeThongRap", LayThongTinHeThongRap);

router.get("/LayThongTinLichChieuPhim", LayThongTinLichChieuPhim);

export default router;