import User from "../models/User.js";

export const layThongTinTaiKhoan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-matKhau");

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "Không tìm thấy người dùng.",
                content: null,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy thông tin tài khoản thành công.",
            content: user,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ.",
            content: error.message,
        });
    }
};

export const capNhatThongTinTaiKhoan = async (req, res) => {
    try {
        const { hoTen, email, soDT } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { hoTen, email, soDT },
            { new: true, runValidators: true }
        ).select("-matKhau");

        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật tài khoản thành công.",
            content: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ.",
            content: error.message,
        });
    }
};

export const layDanhSachNguoiDung = async (_req, res) => {
    try {
        const users = await User.find().select("-matKhau");

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách người dùng thành công.",
            content: users,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
            content: error.message,
        });
    }
};

export const capNhatNguoiDung = async (req, res) => {
    try {
        const taiKhoan = req.query.TaiKhoan;

        if (!taiKhoan) {
            return res.status(400).json({
                statusCode: 400,
                message: "Vui lòng cung cấp tham số TaiKhoan.",
                content: null,
            });
        }

        const updateData = { ...req.body };
        if (updateData.matKhau) {
            delete updateData.matKhau;
        }

        const updatedUser = await User.findOneAndUpdate(
            { taiKhoan },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-matKhau");

        if (!updatedUser) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy tài khoản: ${taiKhoan}`,
                content: null,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật thông tin người dùng thành công.",
            content: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
            content: error.message,
        });
    }
};

export const xoaNguoiDung = async (req, res) => {
    try {
        const taiKhoan = req.query.TaiKhoan;

        if (!taiKhoan) {
            return res.status(400).json({
                statusCode: 400,
                message: "Vui lòng cung cấp tham số TaiKhoan.",
                content: null,
            });
        }

        const deletedUser = await User.findOneAndDelete({ taiKhoan });

        if (!deletedUser) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy tài khoản: ${taiKhoan} để xóa.`,
                content: null,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: `Xóa tài khoản ${taiKhoan} thành công.`,
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
