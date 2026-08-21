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

const uploadCumRapFields = uploadCinemaComplex.fields([
    { name: "File", maxCount: 1 },
    { name: "Gallery", maxCount: 8 },
]);

router.post(
    "/ThemCumRap",
    verifyToken,
    checkAdmin,
    uploadCumRapFields,
    ThemCumRap
);

router.put(
    "/CapNhatCumRap",
    verifyToken,
    checkAdmin,
    uploadCumRapFields,
    CapNhatCumRap
);

router.delete("/XoaCumRap", verifyToken,checkAdmin, XoaCumRap);

export default router;