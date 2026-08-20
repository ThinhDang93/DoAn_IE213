import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        tenPhim: {
            type: String,
            required: true,
            trim: true,
        },
        trailer: {
            type: String,
            default: "",
        },
        moTa: {
            type: String,
            default: "",
        },
        ngayKhoiChieu: {
            type: Date,
            required: true,
        },
        dangChieu: {
            type: Boolean,
            default: false,
        },
        sapChieu: {
            type: Boolean,
            default: false,
        },
        hot: {
            type: Boolean,
            default: false,
        },
        danhGia: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        hinhAnh: {
            type: String,
            required: true,
        },
        theLoai: {
            type: String,
            default: "",
        },
        daoDien: {
            type: String,
            default: "",
        },
        dienVien: {
            type: String,
            default: "",
        },
        thoiLuong: {
            type: Number,
            default: 0,
        },
        doTuoi: {
            type: String,
            default: "",
        },
        dinhDang: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Movie", movieSchema);