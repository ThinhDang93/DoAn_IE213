import express from "express";
import {
    DatVe,
    HuyVe,
    LayDanhSachPhongVe,
    LayDanhSachVeDaBan,
    LayLichSuDatVe,
    ThongKeDoanhThu,
} from "../controllers/bookingController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/LayDanhSachPhongVe", LayDanhSachPhongVe);

router.post("/DatVe", verifyToken, DatVe);

router.get("/LayLichSuDatVe", verifyToken, LayLichSuDatVe);

router.put("/HuyVe", verifyToken, HuyVe);

router.get("/LayDanhSachVeDaBan", verifyToken, checkAdmin, LayDanhSachVeDaBan);

router.get("/ThongKeDoanhThu", verifyToken, checkAdmin, ThongKeDoanhThu);

export default router;
