import mongoose from "mongoose";
import Seat from "../models/seats.js";
import Booking from "../models/bookings.js";

export const LayDanhSachGheTheoRap = async (maRap) => {
    return Seat.find({ maRap }).sort({ tenGhe: 1 }).lean();
};

export const LayGheTheoIds = async (ids) => {
    return Seat.find({ _id: { $in: ids } }).lean();
};

export const XoaGheTheoRap = async (maRap) => {
    return Seat.deleteMany({ maRap });
};

// Tra ve Map<maRap (string), { giaVeMin, giaVeMax }> - dung de hien thi
// gia ve xap xi tren nut chon gio chieu (ghe Thuong/Vip gia khac nhau).
export const LayGiaVeMinMaxTheoRap = async (maRapIds) => {
    const uniqueIds = [...new Set(maRapIds.map(String))];

    if (uniqueIds.length === 0) {
        return new Map();
    }

    const result = await Seat.aggregate([
        { $match: { maRap: { $in: uniqueIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
        {
            $group: {
                _id: "$maRap",
                giaVeMin: { $min: "$giaVe" },
                giaVeMax: { $max: "$giaVe" },
            },
        },
    ]);

    const map = new Map();
    result.forEach((row) => {
        map.set(String(row._id), { giaVeMin: row.giaVeMin, giaVeMax: row.giaVeMax });
    });

    return map;
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
