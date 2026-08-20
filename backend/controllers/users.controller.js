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
        const allowedFields = ["hoTen", "email", "soDT"];
        const updateData = Object.fromEntries(
            allowedFields
                .filter((field) => req.body?.[field] !== undefined)
                .map((field) => [
                    field,
                    typeof req.body[field] === "string"
                        ? req.body[field].trim()
                        : req.body[field],
                ])
        );

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "Vui lòng cung cấp ít nhất một thông tin cần cập nhật.",
                content: null,
            });
        }

        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase();
            const existingUser = await User.findOne({
                email: updateData.email,
                _id: { $ne: req.user.id },
            });

            if (existingUser) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "Email đã được sử dụng bởi tài khoản khác.",
                    content: null,
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-matKhau");

        if (!updatedUser) {
            return res.status(404).json({
                statusCode: 404,
                message: "Không tìm thấy người dùng.",
                content: null,
            });
        }

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

export const doiMatKhau = async (req, res) => {
    try {
        const { matKhauCu, matKhauMoi, xacNhanMatKhau } = req.body || {};

        if (!matKhauCu || !matKhauMoi || !xacNhanMatKhau) {
            return res.status(400).json({
                statusCode: 400,
                message: "matKhauCu, matKhauMoi và xacNhanMatKhau là bắt buộc.",
                content: null,
            });
        }

        if (matKhauMoi !== xacNhanMatKhau) {
            return res.status(400).json({
                statusCode: 400,
                message: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
                content: null,
            });
        }

        if (matKhauCu === matKhauMoi) {
            return res.status(400).json({
                statusCode: 400,
                message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
                content: null,
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "Không tìm thấy người dùng.",
                content: null,
            });
        }

        const isCurrentPasswordValid = await user.comparePassword(matKhauCu);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: "Mật khẩu hiện tại không chính xác.",
                content: null,
            });
        }

        user.matKhau = matKhauMoi;
        await user.save();

        return res.status(200).json({
            statusCode: 200,
            message: "Đổi mật khẩu thành công.",
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

export const themNguoiDung = async (req, res) => {
    try {
        const { taiKhoan, matKhau, hoTen, email, soDT, maLoaiNguoiDung } = req.body;

        if (!taiKhoan || !matKhau || !hoTen || !email) {
            return res.status(400).json({
                statusCode: 400,
                message: "taiKhoan, matKhau, hoTen, email là bắt buộc.",
                content: null,
            });
        }

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
            ...(maLoaiNguoiDung ? { maLoaiNguoiDung } : {}),
        });

        await newUser.save();

        const userData = newUser.toObject();
        delete userData.matKhau;

        return res.status(201).json({
            statusCode: 201,
            message: "Thêm người dùng thành công.",
            content: userData,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ nội bộ.",
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
        const taiKhoan =
            req.query?.TaiKhoan ||
            req.query?.taiKhoan ||
            req.body?.TaiKhoan ||
            req.body?.taiKhoan;

        if (!taiKhoan) {
            return res.status(400).json({
                statusCode: 400,
                message: "Vui lòng cung cấp tham số TaiKhoan.",
                content: null,
            });
        }

        const updateData = { ...req.body };
        delete updateData.matKhau;
        delete updateData.taiKhoan;
        delete updateData.TaiKhoan;

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
        const taiKhoan =
            req.query?.TaiKhoan ||
            req.query?.taiKhoan ||
            req.body?.TaiKhoan ||
            req.body?.taiKhoan;

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
