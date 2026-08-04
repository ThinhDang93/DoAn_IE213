import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
    {
        maPhim: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        maRap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        ngayChieuGioChieu: {
            type: Date,
            required: true,
        },
        giaVe: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Showtime", showtimeSchema);