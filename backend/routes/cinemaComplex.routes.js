import express from "express";
import {
    CapNhatCumRap,
    LayDanhSachCumRap,
    LayThongTinCumRap,
    ThemCumRap,
    XoaCumRap,
} from "../controllers/cinemaComplexesController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";
import { uploadCinemaComplex } from "../middlewares/multer.js";

const router = express.Router();

router.get("/LayDanhSachCumRap", LayDanhSachCumRap);

router.get("/LayThongTinCumRap", LayThongTinCumRap);

router.post(
    "/ThemCumRap",
    verifyToken,
    checkAdmin,
    uploadCinemaComplex.single("File"),
    ThemCumRap
);

router.put(
    "/CapNhatCumRap",
    verifyToken,
    checkAdmin,
    uploadCinemaComplex.single("File"),
    CapNhatCumRap
);

router.delete("/XoaCumRap", verifyToken,checkAdmin, XoaCumRap);

export default router;