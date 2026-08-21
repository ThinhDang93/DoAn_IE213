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

// 1 phong chieu vat ly chi chieu duoc 1 suat tai 1 thoi diem, bat ke phim
// nao - kiem tra trung theo dung (maRap, ngayChieuGioChieu), khac phong thi
// van cho phep du trung gio. excludeId dung khi cap nhat de khong tu trung
// voi chinh no.
export const TonTaiLichChieuTrungGio = async (
    maRap,
    ngayChieuGioChieu,
    excludeId
) => {
    const filter = { maRap, ngayChieuGioChieu };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    const conflict = await Showtime.findOne(filter).lean();
    return Boolean(conflict);
};

export const LayThongTinLichChieuPhim = async (maPhim) => {
    return LayDanhSachLichChieu({ maPhim });
};