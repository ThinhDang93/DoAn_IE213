import mongoose from "mongoose";

const bookingSeatSchema = new mongoose.Schema(
    {
        maGhe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seat",
            required: true,
        },
        giaVe: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const bookingSchema = new mongoose.Schema(
    {
        taiKhoan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        maLichChieu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Showtime",
            required: true,
        },
        danhSachGhe: {
            type: [bookingSeatSchema],
            required: true,
            validate: {
                validator: (value) => Array.isArray(value) && value.length > 0,
                message: "danhSachGhe khong duoc rong",
            },
        },
        tongTien: {
            type: Number,
            required: true,
            min: 0,
        },
        trangThai: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending",
            required: true,
        },
    },
    {
        timestamps: { createdAt: "ngayDat", updatedAt: false },
        versionKey: false,
    }
);

export default mongoose.model("Booking", bookingSchema);
