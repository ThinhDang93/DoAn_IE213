import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        tenRap: {
            type: String,
            required: true,
            trim: true,
        },
        maCumRap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CinemaComplex",
            required: true,
        },
        soLuongGhe: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Room", roomSchema);