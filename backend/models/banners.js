import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        hinhAnh: {
            type: String,
            required: true,
        },
        thuTu: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Banner", bannerSchema);
