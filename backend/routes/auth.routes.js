import express from 'express';
import { dangKy, dangNhap } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/DangKy', dangKy);
router.post('/DangNhap', dangNhap);

export default router;