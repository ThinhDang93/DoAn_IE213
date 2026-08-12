import express from "express";
import {
    DatVe,
    LayDanhSachPhongVe,
    LayLichSuDatVe,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/LayDanhSachPhongVe", LayDanhSachPhongVe);

router.post("/DatVe", verifyToken, DatVe);

router.get("/LayLichSuDatVe", verifyToken, LayLichSuDatVe);

export default router;
