import jwt from "jsonwebtoken";
import User from "../models/User.js";

const jwtSecret = process.env.JWT_SECRET || "dev-secret-key";

export const dangNhap = async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;

        const user = await User.findOne({ taiKhoan });
        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Tài khoản không tồn tại.",
                content: null,
            });
        }

        const isMatch = await user.comparePassword(matKhau);
        if (!isMatch) {
            return res.status(401).json({
                statusCode: 401,
                message: "Mật khẩu không chính xác.",
                content: null,
            });
        }

        const payload = {
            id: user._id,
            taiKhoan: user.taiKhoan,
            maLoaiNguoiDung: user.maLoaiNguoiDung,
        };

        const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

        return res.status(200).json({
            statusCode: 200,
            message: "Đăng nhập thành công.",
            content: {
                taiKhoan: user.taiKhoan,
                hoTen: user.hoTen,
                email: user.email,
                soDT: user.soDT,
                maLoaiNguoiDung: user.maLoaiNguoiDung,
                accessToken,
            },
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
            content: error.message,
        });
    }
};

export const dangKy = async (req, res) => {
    try {
        const { taiKhoan, matKhau, hoTen, email, soDT } = req.body;

        const existingUser = await User.findOne({ $or: [{ taiKhoan }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "Tài khoản hoặc email đã tồn tại trong hệ thống.",
                content: null,
            });
        }

        const newUser = new User({
            taiKhoan,
            matKhau,
            hoTen,
            email,
            soDT,
        });

        await newUser.save();

        return res.status(201).json({
            statusCode: 201,
            message: "Đăng ký tài khoản thành công.",
            content: null,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
            content: error.message,
        });
    }
};
