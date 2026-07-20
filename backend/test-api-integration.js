import dns from "dns";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Cấu hình DNS và nạp biến môi trường
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

// Cấu hình Base URL (Sử dụng 127.0.0.1 để tránh lỗi IPv6 ::1 resolving trên fetch)
const BASE_URL = 'http://127.0.0.1:8080/api/QuanLyNguoiDung';

// Hàm hỗ trợ giao tiếp HTTP với Node.js Native Fetch
async function fetchAPI(endpoint, method = 'GET', token = null, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
}

// Kịch bản chính
async function runIntegrationTest() {
    try {
        console.log("[1] TÍCH HỢP HỆ THỐNG: KHỞI TẠO MÔI TRƯỜNG...");
        await mongoose.connect(process.env.MOVIEREVIEWS_DB_URI);
        await User.deleteMany({ taiKhoan: { $in: ["test_admin_e2e", "test_user_e2e"] } });

        // Tiêm (Seed) tài khoản QuanTri
        const adminUser = new User({
            taiKhoan: "test_admin_e2e",
            matKhau: "admin_secure123",
            hoTen: "System Administrator",
            email: "admin.e2e@system.local",
            maLoaiNguoiDung: "QuanTri"
        });
        await adminUser.save();
        console.log("-> Môi trường đã sẵn sàng.\n");

        console.log("[2] KIỂM THỬ: ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG");
        let res = await fetchAPI('/DangKy', 'POST', null, {
            taiKhoan: "test_user_e2e",
            matKhau: "user_secure123",
            hoTen: "Standard User",
            email: "user.e2e@system.local",
            soDT: "0900000001"
        });
        console.log(`-> Status: ${res.status} | Message: ${res.data.message}`);

        console.log("\n[3] KIỂM THỬ: XÁC THỰC VÀ LẤY TOKEN");
        // Đăng nhập Khách Hàng
        res = await fetchAPI('/DangNhap', 'POST', null, { taiKhoan: "test_user_e2e", matKhau: "user_secure123" });
        const userToken = res.data.content.accessToken;
        console.log(`-> User Token nhận được: ${userToken.substring(0, 30)}...`);

        // Đăng nhập Quản Trị
        res = await fetchAPI('/DangNhap', 'POST', null, { taiKhoan: "test_admin_e2e", matKhau: "admin_secure123" });
        const adminToken = res.data.content.accessToken;
        console.log(`-> Admin Token nhận được: ${adminToken.substring(0, 30)}...\n`);

        console.log("[4] KIỂM THỬ: TRUY XUẤT VÀ CẬP NHẬT CÁ NHÂN (USER SCOPE)");
        res = await fetchAPI('/ThongTinTaiKhoan', 'GET', userToken);
        console.log(`-> [GET] Info: ${res.data.content.hoTen} - ${res.data.content.email}`);
        
        res = await fetchAPI('/ThongTinTaiKhoan', 'PUT', userToken, { hoTen: "Updated Standard User" });
        console.log(`-> [PUT] Info (Updated): ${res.data.content.hoTen}`);

        console.log("\n[5] KIỂM THỬ: BẢO MẬT PHÂN QUYỀN (Ranh giới Admin)");
        res = await fetchAPI('/DanhSachNguoiDung', 'GET', userToken);
        console.log(`-> Dùng User Token gọi API Admin | Status: ${res.status} (Kỳ vọng: 403) | Msg: ${res.data.message}`);

        console.log("\n[6] KIỂM THỬ: ĐẶC QUYỀN QUẢN TRỊ (ADMIN SCOPE)");
        res = await fetchAPI('/DanhSachNguoiDung', 'GET', adminToken);
        console.log(`-> [GET] Tổng số tài khoản trên hệ thống: ${res.data.content.length}`);

        res = await fetchAPI('/CapNhatNguoiDung?TaiKhoan=test_user_e2e', 'PUT', adminToken, { soDT: "0999999999" });
        console.log(`-> [PUT] Admin cập nhật SDT User | Status: ${res.status} | New SDT: ${res.data.content.soDT}`);

        res = await fetchAPI('/XoaNguoiDung?TaiKhoan=test_user_e2e', 'DELETE', adminToken);
        console.log(`-> [DELETE] Admin xóa User | Status: ${res.status} | Msg: ${res.data.message}`);

        console.log("\n[7] TEARDOWN: DỌN DẸP DỮ LIỆU...");
        await User.deleteOne({ taiKhoan: "test_admin_e2e" });
        await mongoose.disconnect();
        console.log("-> Hoàn tất kịch bản kiểm thử toàn diện.");

    } catch (error) {
        console.error("\n!!! LỖI QUÁ TRÌNH KIỂM THỬ !!!");
        console.error(error);
        if (mongoose.connection.readyState === 1) await mongoose.disconnect();
        process.exit(1);
    }
}

runIntegrationTest();