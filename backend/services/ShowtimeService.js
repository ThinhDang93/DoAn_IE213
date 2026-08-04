import Showtime from "../models/showtimes.js";

const SHOWTIME_POPULATE = [
    {
        path: "maPhim",
    },
    {
        path: "maRap",
        populate: {
            path: "maCumRap",
            populate: {
                path: "maHeThongRap",
            },
        },
    },
];

export const LayDanhSachLichChieu = async (filter = {}) => {
    return Showtime.find(filter)
        .populate(SHOWTIME_POPULATE)
        .sort({ ngayChieuGioChieu: 1 })
        .lean();
};

export const LayThongTinLichChieu = async (id) => {
    return Showtime.findById(id).populate(SHOWTIME_POPULATE).lean();
};

export const ThemLichChieu = async (data) => {
    const created = await Showtime.create(data);
    return LayThongTinLichChieu(created._id);
};

export const CapNhatLichChieu = async (id, data) => {
    await Showtime.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    }).lean();

    return LayThongTinLichChieu(id);
};

export const XoaLichChieu = async (id) => {
    return Showtime.findByIdAndDelete(id).lean();
};

export const LayThongTinLichChieuPhim = async (maPhim) => {
    return LayDanhSachLichChieu({ maPhim });
};