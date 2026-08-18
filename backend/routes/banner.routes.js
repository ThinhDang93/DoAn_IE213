import express from "express";
import {
    CapNhatBanner,
    LayDanhSachBanner,
    ThemBanner,
    XoaBanner,
} from "../controllers/bannerController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";
import { uploadBanner } from "../middlewares/multer.js";

const router = express.Router();

router.get("/LayDanhSachBanner", LayDanhSachBanner);

router.post(
    "/ThemBanner",
    verifyToken,
    checkAdmin,
    uploadBanner.single("File"),
    ThemBanner
);

router.put(
    "/CapNhatBanner",
    verifyToken,
    checkAdmin,
    uploadBanner.single("File"),
    CapNhatBanner
);

router.delete("/XoaBanner", verifyToken, checkAdmin, XoaBanner);

export default router;
