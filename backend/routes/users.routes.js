import express from "express";
import { verifyToken, checkAdmin } from "../middlewares/auth.middleware.js";
import {
    layThongTinTaiKhoan,
    capNhatThongTinTaiKhoan,
    doiMatKhau,
    themNguoiDung,
    layDanhSachNguoiDung,
    capNhatNguoiDung,
    xoaNguoiDung,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/ThongTinTaiKhoan", verifyToken, layThongTinTaiKhoan);
router.put("/ThongTinTaiKhoan", verifyToken, capNhatThongTinTaiKhoan);
router.put("/DoiMatKhau", verifyToken, doiMatKhau);

router.post("/ThemNguoiDung", verifyToken, checkAdmin, themNguoiDung);
router.get("/DanhSachNguoiDung", verifyToken, checkAdmin, layDanhSachNguoiDung);
router.put("/CapNhatNguoiDung", verifyToken, checkAdmin, capNhatNguoiDung);
router.delete("/XoaNguoiDung", verifyToken, checkAdmin, xoaNguoiDung);

export default router;
