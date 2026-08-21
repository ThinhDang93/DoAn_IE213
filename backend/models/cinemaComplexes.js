import mongoose from "mongoose";

const cinemaComplexSchema = new mongoose.Schema(
    {
        tenCumRap: {
            type: String,
            required: true,
            trim: true,
        },
        diaChi: {
            type: String,
            required: true,
            trim: true,
        },
        hinhAnh: {
            type: String,
            default: "",
        },
        danhSachHinhAnh: {
            type: [String],
            default: [],
        },
        maHeThongRap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CinemaSystem",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("CinemaComplex", cinemaComplexSchema);