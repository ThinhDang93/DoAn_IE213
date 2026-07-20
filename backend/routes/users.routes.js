import express from 'express';
import { verifyToken, checkAdmin } from '../middlewares/auth.middleware.js';
import { 
    layThongTinTaiKhoan, 
    capNhatThongTinTaiKhoan,
    layDanhSachNguoiDung,
    capNhatNguoiDung,
    xoaNguoiDung
} from '../controllers/users.controller.js';

const router = express.Router();

// Route dành cho Khách hàng / Cá nhân (Bảo vệ bằng verifyToken)
router.get('/ThongTinTaiKhoan', verifyToken, layThongTinTaiKhoan);
router.put('/ThongTinTaiKhoan', verifyToken, capNhatThongTinTaiKhoan);

// Route dành cho Admin (Bảo vệ bằng verifyToken VÀ checkAdmin)
router.get('/DanhSachNguoiDung', verifyToken, checkAdmin, layDanhSachNguoiDung);
router.put('/CapNhatNguoiDung', verifyToken, checkAdmin, capNhatNguoiDung);
router.delete('/XoaNguoiDung', verifyToken, checkAdmin, xoaNguoiDung);

export default router;