import mongoose from "mongoose";

const cinemaSystemSchema = new mongoose.Schema(
    {
        tenHeThongRap: {
            type: String,
            required: true,
            trim: true,
        },
        logo: {
            type: String,
            required: true,
        },
        gioiThieu: {
            type: String,
            default: "",
        },
        namThanhLap: {
            type: Number,
            default: null,
        },
        danhSachHinhAnh: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("CinemaSystem", cinemaSystemSchema);