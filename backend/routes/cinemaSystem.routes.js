import express from "express";
import {
    CapNhatHeThongRap,
    LayThongTinHeThongRap,
    ThemHeThongRap,
    XoaHeThongRap,
} from "../controllers/cinemaSystemsController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";
import { uploadCinemaSystem } from "../middlewares/multer.js";

const router = express.Router();

router.get("/LayThongTinHeThongRap", LayThongTinHeThongRap);

router.post(
    "/ThemHeThongRap",
    verifyToken,
    checkAdmin,
    uploadCinemaSystem.single("File"),
    ThemHeThongRap
);

router.put(
    "/CapNhatHeThongRap",
    verifyToken,
    checkAdmin,
    uploadCinemaSystem.single("File"),
    CapNhatHeThongRap
);

router.delete("/XoaHeThongRap", verifyToken, checkAdmin, XoaHeThongRap);

export default router;