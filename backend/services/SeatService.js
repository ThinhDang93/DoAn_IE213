import Seat from "../models/seats.js";
import Booking from "../models/bookings.js";

export const LayDanhSachGheTheoRap = async (maRap) => {
    return Seat.find({ maRap }).sort({ tenGhe: 1 }).lean();
};

export const LayGheTheoIds = async (ids) => {
    return Seat.find({ _id: { $in: ids } }).lean();
};

export const LayTapMaGheDaDat = async (maLichChieu) => {
    const bookings = await Booking.find({
        maLichChieu,
        trangThai: { $ne: "cancelled" },
    })
        .select("danhSachGhe")
        .lean();

    const bookedIds = new Set();
    bookings.forEach((booking) => {
        booking.danhSachGhe.forEach((ghe) => bookedIds.add(String(ghe.maGhe)));
    });

    return bookedIds;
};
