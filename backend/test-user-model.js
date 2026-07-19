import dns from "dns";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Ghi đè DNS cục bộ cho tiến trình Node.js nhằm vượt qua lỗi phân giải SRV
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

async function runModelTest() {
    try {
        console.log("[1] Khởi tạo kết nối cơ sở dữ liệu...");
        await mongoose.connect(process.env.MOVIEREVIEWS_DB_URI);
        console.log("-> Kết nối thành công.\n");

        console.log("[2] Dọn dẹp dữ liệu rác trước khi kiểm thử...");
        await User.deleteOne({ taiKhoan: "test_engineer" });

        console.log("[3] Khởi tạo đối tượng User mới...");
        const plainPassword = "SecurePassword123";
        const testUser = new User({
            taiKhoan: "test_engineer",
            matKhau: plainPassword,
            hoTen: "System Engineer",
            email: "engineer@system.local"
        });

        console.log("[4] Thực thi lệnh lưu (Kích hoạt Pre-save Middleware)...");
        const savedUser = await testUser.save();
        
        console.log(`-> Mật khẩu gốc: ${plainPassword}`);
        console.log(`-> Mật khẩu sau khi băm (trong DB): ${savedUser.matKhau}`);
        console.log(`-> Quyền người dùng mặc định: ${savedUser.maLoaiNguoiDung}`);
        console.log(`-> Thời gian tạo (ngayTao): ${savedUser.ngayTao}\n`);

        console.log("[5] Kiểm thử phương thức comparePassword...");
        const isMatch = await savedUser.comparePassword(plainPassword);
        const isMismatch = await savedUser.comparePassword("WrongPassword!");
        
        console.log(`-> Khớp mật khẩu đúng (${plainPassword}): ${isMatch}`);
        console.log(`-> Khớp mật khẩu sai (WrongPassword!): ${isMismatch}\n`);

        console.log("[6] Dọn dẹp dữ liệu kiểm thử (Clean up)...");
        await User.deleteOne({ _id: savedUser._id });
        console.log("-> Đã xóa dữ liệu kiểm thử khỏi Database.\n");

        console.log("[7] Ngắt kết nối cơ sở dữ liệu.");
        await mongoose.disconnect();
        console.log("-> Hoàn tất quy trình kiểm thử.");

    } catch (error) {
        console.error("\n!!! LỖI KIỂM THỬ ĐƯỢC GHI NHẬN !!!");
        console.error(error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

// Khởi chạy tiến trình
runModelTest();