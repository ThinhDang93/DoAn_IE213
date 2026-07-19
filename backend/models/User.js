import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Khởi tạo User Schema
const userSchema = new mongoose.Schema({
    taiKhoan: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    matKhau: {
        type: String,
        required: true
    },
    hoTen: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    soDT: {
        type: String,
        required: false
    },
    maLoaiNguoiDung: {
        type: String,
        enum: ['QuanTri', 'KhachHang'],
        default: 'KhachHang',
        required: true
    }
}, {
    timestamps: { createdAt: 'ngayTao', updatedAt: false },
    versionKey: false
});

// 2. Tích hợp Pre-save Middleware theo chuẩn Async/Await (Mongoose 9.x)
userSchema.pre('save', async function() {
    // Chỉ thực hiện băm nếu trường matKhau bị thay đổi hoặc khởi tạo mới
    if (!this.isModified('matKhau')) {
        return;
    }
    
    // Hệ thống tự động xử lý Promise mà không cần callback next()
    const salt = await bcrypt.genSalt(10);
    this.matKhau = await bcrypt.hash(this.matKhau, salt);
});

// 3. Phương thức hỗ trợ so sánh mật khẩu
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.matKhau);
};

// 4. Định nghĩa Model
const User = mongoose.model('User', userSchema, 'users');

export default User;