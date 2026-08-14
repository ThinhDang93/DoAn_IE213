import Booking from "../models/bookings.js";

const HISTORY_POPULATE = {
    path: "maLichChieu",
    populate: [
        { path: "maPhim" },
        {
            path: "maRap",
            populate: { path: "maCumRap", populate: { path: "maHeThongRap" } },
        },
    ],
};

export const TaoBooking = async (data) => {
    const created = await Booking.create(data);
    return created.toObject();
};

export const LayLichSuDatVeTheoTaiKhoan = async (taiKhoan) => {
    return Booking.find({ taiKhoan })
        .sort({ createdAt: -1 })
        .populate(HISTORY_POPULATE)
        .lean();
};

export const LayBookingTheoId = async (id) => Booking.findById(id);

export const HuyBooking = async (booking) => {
    booking.trangThai = "cancelled";
    await booking.save();
    return booking.toObject();
};

export const LayDanhSachVeDaBan = async (filter = {}) => {
    return Booking.find(filter)
        .sort({ createdAt: -1 })
        .populate({ path: "taiKhoan", select: "taiKhoan hoTen email" })
        .populate(HISTORY_POPULATE)
        .lean();
};

export const ThongKeDoanhThu = async (filter = {}) => {
    const match = { trangThai: { $ne: "cancelled" }, ...filter };

    const result = await Booking.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                tongDoanhThu: { $sum: "$tongTien" },
                soVe: { $sum: 1 },
            },
        },
    ]);

    return result[0]
        ? { tongDoanhThu: result[0].tongDoanhThu, soVe: result[0].soVe }
        : { tongDoanhThu: 0, soVe: 0 };
};
