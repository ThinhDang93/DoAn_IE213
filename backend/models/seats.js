import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
    {
        tenGhe: {
            type: String,
            required: true,
            trim: true,
        },
        loaiGhe: {
            type: String,
            enum: ["Thuong", "Vip"],
            required: true,
        },
        maRap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
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

seatSchema.index({ maRap: 1, tenGhe: 1 }, { unique: true });

export default mongoose.model("Seat", seatSchema);
