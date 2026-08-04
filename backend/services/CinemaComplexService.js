import CinemaComplex from "../models/cinemaComplexes.js";

export const LayDanhSachCumRap = async (filter = {}) => {
    return CinemaComplex.find(filter)
        .populate("maHeThongRap")
        .sort({ createdAt: -1 })
        .lean();
};

export const LayThongTinCumRap = async (id) => {
    return CinemaComplex.findById(id).populate("maHeThongRap").lean();
};

export const ThemCumRap = async (data) => {
    const created = await CinemaComplex.create(data);
    return created.toObject();
};

export const CapNhatCumRap = async (id, data) => {
    return CinemaComplex.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    })
        .populate("maHeThongRap")
        .lean();
};

export const XoaCumRap = async (id) => {
    return CinemaComplex.findByIdAndDelete(id).lean();
};