import express from "express";
import {
    CapNhatLichChieu,
    LayDanhSachLichChieu,
    LayThongTinLichChieu,
    LayThongTinLichChieuPhim,
    ThemLichChieu,
    XoaLichChieu,
} from "../controllers/showtimesController.js";

const router = express.Router();

router.get("/LayDanhSachLichChieu", LayDanhSachLichChieu);

router.get("/LayThongTinLichChieu", LayThongTinLichChieu);

router.get("/LayThongTinLichChieuPhim", LayThongTinLichChieuPhim);

router.post("/ThemLichChieu", ThemLichChieu);

router.put("/CapNhatLichChieu", CapNhatLichChieu);

router.delete("/XoaLichChieu", XoaLichChieu);

export default router;