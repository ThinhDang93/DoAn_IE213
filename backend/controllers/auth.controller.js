import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// [POST] /api/QuanLyNguoiDung/DangNhap
export const dangNhap = async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;

        // 1. Tìm người dùng theo tài khoản
        const user = await User.findOne({ taiKhoan });
        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Tài khoản không tồn tại.",
                content: null
            });
        }

        // 2. So sánh mật khẩu bằng Instance Method đã định nghĩa trong Model
        const isMatch = await user.comparePassword(matKhau);
        if (!isMatch) {
            return res.status(401).json({
                statusCode: 401,
                message: "Mật khẩu không chính xác.",
                content: null
            });
        }

        // 3. Khởi tạo JWT Payload
        const payload = {
            id: user._id,
            taiKhoan: user.taiKhoan,
            maLoaiNguoiDung: user.maLoaiNguoiDung
        };

        // Ký token với JWT_SECRET, thời gian sống 7 ngày
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 4. Trả về thông tin cá nhân và accessToken, lược bỏ matKhau
        return res.status(200).json({
            statusCode: 200,
            message: "Đăng nhập thành công.",
            content: {
                taiKhoan: user.taiKhoan,
                hoTen: user.hoTen,
                email: user.email,
                soDT: user.soDT,
                maLoaiNguoiDung: user.maLoaiNguoiDung,
                accessToken: accessToken
            }
        });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
            content: error.message
        });
    }
};

// [POST] /api/QuanLyNguoiDung/DangKy
export const dangKy = async (req, res) => {
    try {
        const { taiKhoan, matKhau, hoTen, email, soDT } = req.body;

        // Kiểm tra tài khoản hoặc email trùng lặp
        const existingUser = await User.findOne({ $or: [{ taiKhoan }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "Tài khoản hoặc email đã tồn tại trong hệ thống.",
                content: null
            });
        }

        // Khởi tạo user mới (matKhau sẽ tự động được băm bởi Pre-save Middleware)
        const newUser = new User({
            taiKhoan,
            matKhau,
            hoTen,
            email,
            soDT
        });

        await newUser.save();

        // Chỉ trả message thành công, không auto-login
        return res.status(201).json({
            statusCode: 201,
            message: "Đăng ký tài khoản thành công.",
            content: null
        });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
            content: error.message
        });
    }
};

