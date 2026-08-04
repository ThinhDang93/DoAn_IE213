import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        taiKhoan: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        matKhau: {
            type: String,
            required: true,
        },
        hoTen: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        soDT: {
            type: String,
            required: false,
        },
        maLoaiNguoiDung: {
            type: String,
            enum: ["QuanTri", "KhachHang"],
            default: "KhachHang",
            required: true,
        },
    },
    {
        timestamps: { createdAt: "ngayTao", updatedAt: false },
        versionKey: false,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("matKhau")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.matKhau = await bcrypt.hash(this.matKhau, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.matKhau);
};

const User = mongoose.model("User", userSchema, "users");

export default User;
