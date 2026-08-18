import Movie from "../models/movies.js";

export const LayDanhSachPhim = async () => {
    return Movie.find().sort({ createdAt: -1 }).lean();
};

export const LayThongTinPhim = async (maPhim) => {
    return Movie.findById(maPhim).lean();
};

export const ThemPhim = async (movieData) => {
    const movie = await Movie.create(movieData);
    return movie.toObject();
};

export const CapNhatPhim = async (maPhim, movieData) => {
    return Movie.findByIdAndUpdate(maPhim, movieData, {
        returnDocument: "after",
        runValidators: true,
    }).lean();
};

export const XoaPhim = async (maPhim) => {
    return Movie.findByIdAndDelete(maPhim).lean();
};

