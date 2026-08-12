import User from "../models/User.js";

export const seedUsers = async () => {
    const count = await User.countDocuments();

    if (count > 0) {
        return;
    }

    await User.create([
        {
            taiKhoan: "admin",
            matKhau: "Admin@123",
            hoTen: "Quan Tri Vien",
            email: "admin@datvexemphim.local",
            soDT: "0900000001",
            maLoaiNguoiDung: "QuanTri",
        },
        {
            taiKhoan: "khachhang1",
            matKhau: "KhachHang@123",
            hoTen: "Nguyen Van Khach",
            email: "khachhang1@datvexemphim.local",
            soDT: "0900000002",
            maLoaiNguoiDung: "KhachHang",
        },
    ]);
};
