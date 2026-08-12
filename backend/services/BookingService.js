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
