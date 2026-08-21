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

const uploadHeThongRapFields = uploadCinemaSystem.fields([
    { name: "File", maxCount: 1 },
    { name: "Gallery", maxCount: 8 },
]);

router.post(
    "/ThemHeThongRap",
    verifyToken,
    checkAdmin,
    uploadHeThongRapFields,
    ThemHeThongRap
);

router.put(
    "/CapNhatHeThongRap",
    verifyToken,
    checkAdmin,
    uploadHeThongRapFields,
    CapNhatHeThongRap
);

router.delete("/XoaHeThongRap", verifyToken, checkAdmin, XoaHeThongRap);

export default router;