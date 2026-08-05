import express from "express";
import {
    CapNhatCumRap,
    LayDanhSachCumRap,
    LayThongTinCumRap,
    ThemCumRap,
    XoaCumRap,
} from "../controllers/cinemaComplexesController.js";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken,checkAdmin);
router.get("/LayDanhSachCumRap", LayDanhSachCumRap);

router.get("/LayThongTinCumRap", LayThongTinCumRap);

router.post("/ThemCumRap", ThemCumRap);

router.put("/CapNhatCumRap", CapNhatCumRap);

router.delete("/XoaCumRap", XoaCumRap);

export default router;