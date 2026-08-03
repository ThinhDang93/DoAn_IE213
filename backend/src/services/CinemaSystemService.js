import CinemaSystem from "../models/cinemaSystems.js";

export const LayDanhSachHeThongRap = async () => {
    return CinemaSystem.find().sort({ createdAt: -1 }).lean();
};

export const LayThongTinHeThongRap = async (id) => {
    return CinemaSystem.findById(id).lean();
};

export const ThemHeThongRap = async (data) => {
    const created = await CinemaSystem.create(data);
    return created.toObject();
};

export const CapNhatHeThongRap = async (id, data) => {
    return CinemaSystem.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    }).lean();
};

export const XoaHeThongRap = async (id) => {
    return CinemaSystem.findByIdAndDelete(id).lean();
};

