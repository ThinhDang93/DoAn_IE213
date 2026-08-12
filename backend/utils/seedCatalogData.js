import dayjs from "dayjs";
import CinemaComplex from "../models/cinemaComplexes.js";
import CinemaSystem from "../models/cinemaSystems.js";
import Movie from "../models/movies.js";
import Room from "../models/rooms.js";
import Showtime from "../models/showtimes.js";

const seedCinemaSystems = async () => {
    const count = await CinemaSystem.countDocuments();

    if (count > 0) {
        return CinemaSystem.find();
    }

    return CinemaSystem.insertMany([
        {
            tenHeThongRap: "CGV Cinemas",
            logo: "https://placehold.co/120x120/png?text=CGV",
        },
        {
            tenHeThongRap: "Lotte Cinema",
            logo: "https://placehold.co/120x120/png?text=Lotte",
        },
        {
            tenHeThongRap: "BHD Star",
            logo: "https://placehold.co/120x120/png?text=BHD",
        },
    ]);
};

const seedCinemaComplexes = async (systems) => {
    const count = await CinemaComplex.countDocuments();

    if (count > 0) {
        return CinemaComplex.find();
    }

    const firstSystem = systems[0];
    const secondSystem = systems[1] || firstSystem;
    const thirdSystem = systems[2] || firstSystem;

    return CinemaComplex.insertMany([
        {
            tenCumRap: "CGV Vincom Dong Khoi",
            diaChi: "72 Le Thanh Ton, Quan 1, TP.HCM",
            hinhAnh: "https://placehold.co/400x240/png?text=CGV+Dong+Khoi",
            maHeThongRap: firstSystem._id,
        },
        {
            tenCumRap: "Lotte Nowzone",
            diaChi: "235 Nguyen Van Cu, Quan 1, TP.HCM",
            hinhAnh: "https://placehold.co/400x240/png?text=Lotte+Nowzone",
            maHeThongRap: secondSystem._id,
        },
        {
            tenCumRap: "BHD Bitexco",
            diaChi: "2 Hai Trieu, Quan 1, TP.HCM",
            hinhAnh: "https://placehold.co/400x240/png?text=BHD+Bitexco",
            maHeThongRap: thirdSystem._id,
        },
    ]);
};

const seedRooms = async (complexes) => {
    const count = await Room.countDocuments();

    if (count > 0) {
        return Room.find();
    }

    const docs = [];

    for (const complex of complexes) {
        docs.push({
            tenRap: "Rap 1",
            maCumRap: complex._id,
            soLuongGhe: 80,
        });
        docs.push({
            tenRap: "Rap VIP",
            maCumRap: complex._id,
            soLuongGhe: 50,
        });
    }

    return Room.insertMany(docs);
};

const seedMovies = async () => {
    const count = await Movie.countDocuments();

    if (count > 0) {
        return Movie.find();
    }

    return Movie.insertMany([
        {
            tenPhim: "Interstellar",
            trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
            moTa: "Nhom phi hanh gia du hanh qua ho den de tim hanh tinh moi.",
            ngayKhoiChieu: new Date("2026-10-01T00:00:00.000Z"),
            dangChieu: true,
            sapChieu: false,
            hot: true,
            danhGia: 9,
            hinhAnh: "https://placehold.co/640x960/png?text=Interstellar",
        },
        {
            tenPhim: "Inception",
            trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
            moTa: "Doi dac vu xam nhap vao giac mo de cai dat y tuong.",
            ngayKhoiChieu: new Date("2026-10-05T00:00:00.000Z"),
            dangChieu: true,
            sapChieu: false,
            hot: true,
            danhGia: 8,
            hinhAnh: "https://placehold.co/640x960/png?text=Inception",
        },
        {
            tenPhim: "Dune: Part Two",
            trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
            moTa: "Paul Atreides tiep tuc hanh trinh giua vu tru Arrakis.",
            ngayKhoiChieu: new Date("2026-11-01T00:00:00.000Z"),
            dangChieu: false,
            sapChieu: true,
            hot: true,
            danhGia: 9,
            hinhAnh: "https://placehold.co/640x960/png?text=Dune+Part+Two",
        },
    ]);
};

const seedShowtimes = async (movies, rooms) => {
    const count = await Showtime.countDocuments();

    if (count > 0) {
        return;
    }

    const docs = [];
    const baseDate = dayjs().add(1, "day").hour(9).minute(0).second(0).millisecond(0);

    rooms.slice(0, 6).forEach((room, roomIndex) => {
        movies.slice(0, 3).forEach((movie, movieIndex) => {
            docs.push({
                maPhim: movie._id,
                maRap: room._id,
                ngayChieuGioChieu: baseDate
                    .add(movieIndex, "day")
                    .add(roomIndex * 2, "hour")
                    .toDate(),
                giaVe: 70000 + roomIndex * 5000,
            });
        });
    });

    if (docs.length > 0) {
        await Showtime.insertMany(docs);
    }
};

export const seedCatalogData = async () => {
    const systems = await seedCinemaSystems();
    const complexes = await seedCinemaComplexes(systems);
    const rooms = await seedRooms(complexes);
    const movies = await seedMovies();
    await seedShowtimes(movies, rooms);

    return { systems, complexes, rooms, movies };
};
