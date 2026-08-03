import Room from "../models/rooms.js";

export const LayDanhSachRap = async (filter = {}) => {
    return Room.find(filter)
        .populate({
            path: "maCumRap",
            populate: { path: "maHeThongRap" },
        })
        .sort({ createdAt: -1 })
        .lean();
};

export const LayThongTinRap = async (id) => {
    return Room.findById(id)
        .populate({
            path: "maCumRap",
            populate: { path: "maHeThongRap" },
        })
        .lean();
};

export const ThemRap = async (data) => {
    const created = await Room.create(data);
    return created.toObject();
};

export const CapNhatRap = async (id, data) => {
    return Room.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    })
        .populate({
            path: "maCumRap",
            populate: { path: "maHeThongRap" },
        })
        .lean();
};

export const XoaRap = async (id) => {
    return Room.findByIdAndDelete(id).lean();
};