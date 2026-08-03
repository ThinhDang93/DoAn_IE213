import express from "express";
import {
    CapNhatHeThongRap,
    LayThongTinHeThongRap,
    ThemHeThongRap,
    XoaHeThongRap,
} from "../controllers/cinemaSystemsController.js";

const router = express.Router();

router.get("/LayThongTinHeThongRap", LayThongTinHeThongRap);

router.post("/ThemHeThongRap", ThemHeThongRap);

router.put("/CapNhatHeThongRap", CapNhatHeThongRap);

router.delete("/XoaHeThongRap", XoaHeThongRap);

export default router;