const isHttpUrl = (value) => /^https?:\/\//i.test(value);

export const toIdString = (value) => {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "object" && typeof value.toHexString === "function") {
        return value.toHexString();
    }

    if (typeof value === "object" && value._id && value._id !== value) {
        return toIdString(value._id);
    }

    return String(value);
};

export const toIsoString = (value) => {
    if (!value) {
        return null;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

export const toAbsoluteAssetUrl = (req, value) => {
    if (!value) {
        return "";
    }

    if (isHttpUrl(value)) {
        return value;
    }

    const cleanedPath = String(value)
        .replace(/\\/g, "/")
        .replace(/^\.?\//, "")
        .replace(/^\/+/, "");

    return `${req.protocol}://${req.get("host")}/${cleanedPath}`;
};

export const mapMovie = (movie, req) => ({
    maPhim: toIdString(movie._id || movie.maPhim),
    tenPhim: movie.tenPhim || "",
    trailer: movie.trailer || "",
    moTa: movie.moTa || "",
    ngayKhoiChieu: toIsoString(movie.ngayKhoiChieu),
    dangChieu: Boolean(movie.dangChieu),
    sapChieu: Boolean(movie.sapChieu),
    hot: Boolean(movie.hot),
    danhGia: Number(movie.danhGia ?? 0),
    hinhAnh: toAbsoluteAssetUrl(req, movie.hinhAnh),
    theLoai: movie.theLoai || "",
    daoDien: movie.daoDien || "",
    dienVien: movie.dienVien || "",
    thoiLuong: Number(movie.thoiLuong ?? 0),
    doTuoi: movie.doTuoi || "",
    dinhDang: movie.dinhDang || "",
});

export const mapCinemaSystem = (system, req) => ({
    maHeThongRap: toIdString(system._id || system.maHeThongRap),
    tenHeThongRap: system.tenHeThongRap || "",
    logo: toAbsoluteAssetUrl(req, system.logo),
    gioiThieu: system.gioiThieu || "",
    namThanhLap: system.namThanhLap ?? null,
    danhSachHinhAnh: (system.danhSachHinhAnh || []).map((url) =>
        toAbsoluteAssetUrl(req, url)
    ),
});

export const mapCinemaComplex = (complex, req) => ({
    maCumRap: toIdString(complex._id || complex.maCumRap),
    tenCumRap: complex.tenCumRap || "",
    diaChi: complex.diaChi || "",
    hinhAnh: toAbsoluteAssetUrl(req, complex.hinhAnh),
    danhSachHinhAnh: (complex.danhSachHinhAnh || []).map((url) =>
        toAbsoluteAssetUrl(req, url)
    ),
    maHeThongRap: toIdString(complex.maHeThongRap),
});

export const mapRoom = (room) => ({
    maRap: toIdString(room._id || room.maRap),
    tenRap: room.tenRap || "",
    maCumRap: toIdString(room.maCumRap),
    soLuongGhe: Number(room.soLuongGhe ?? 0),
});

export const mapShowtime = (showtime) => ({
    maLichChieu: toIdString(showtime._id || showtime.maLichChieu),
    maPhim: toIdString(showtime.maPhim?._id || showtime.maPhim),
    tenPhim: showtime.maPhim?.tenPhim || "",
    maRap: toIdString(showtime.maRap?._id || showtime.maRap),
    tenRap: showtime.maRap?.tenRap || "",
    maCumRap: toIdString(showtime.maRap?.maCumRap?._id || showtime.maRap?.maCumRap),
    tenCumRap: showtime.maRap?.maCumRap?.tenCumRap || "",
    maHeThongRap: toIdString(
        showtime.maRap?.maCumRap?.maHeThongRap?._id ||
        showtime.maRap?.maCumRap?.maHeThongRap
    ),
    tenHeThongRap: showtime.maRap?.maCumRap?.maHeThongRap?.tenHeThongRap || "",
    ngayChieuGioChieu: toIsoString(showtime.ngayChieuGioChieu),
    giaVe: Number(showtime.giaVe ?? 0),
});

export const buildShowtimeTreeByMovie = (showtimes, req, seatPriceByRoom = new Map()) => {
    const groupedSystems = new Map();

    for (const showtime of showtimes) {
        const room = showtime.maRap;
        const complex = room?.maCumRap;
        const system = complex?.maHeThongRap;

        if (!system || !complex || !room) {
            continue;
        }

        const systemId = toIdString(system._id || system);
        const complexId = toIdString(complex._id || complex);

        if (!groupedSystems.has(systemId)) {
            groupedSystems.set(systemId, {
                maHeThongRap: systemId,
                tenHeThongRap: system.tenHeThongRap || "",
                logo: toAbsoluteAssetUrl(req, system.logo),
                _cumRapMap: new Map(),
            });
        }

        const currentSystem = groupedSystems.get(systemId);

        if (!currentSystem._cumRapMap.has(complexId)) {
            currentSystem._cumRapMap.set(complexId, {
                maCumRap: complexId,
                tenCumRap: complex.tenCumRap || "",
                diaChi: complex.diaChi || "",
                hinhAnh: toAbsoluteAssetUrl(req, complex.hinhAnh),
                lichChieuPhim: [],
            });
        }

        const roomId = toIdString(room._id || room);
        const seatPrice = seatPriceByRoom.get(roomId);
        const giaVeMacDinh = Number(showtime.giaVe ?? 0);

        const currentComplex = currentSystem._cumRapMap.get(complexId);
        currentComplex.lichChieuPhim.push({
            maLichChieu: toIdString(showtime._id || showtime.maLichChieu),
            maRap: roomId,
            tenRap: room.tenRap || "",
            ngayChieuGioChieu: toIsoString(showtime.ngayChieuGioChieu),
            giaVe: giaVeMacDinh,
            giaVeMin: seatPrice ? Number(seatPrice.giaVeMin) : giaVeMacDinh,
            giaVeMax: seatPrice ? Number(seatPrice.giaVeMax) : giaVeMacDinh,
        });
    }

    const firstMovie = showtimes[0]?.maPhim;

    const heThongRapChieu = Array.from(groupedSystems.values()).map((system) => {
        const cumRapChieu = Array.from(system._cumRapMap.values()).map((complex) => {
            complex.lichChieuPhim.sort((left, right) => {
                const leftDate = new Date(left.ngayChieuGioChieu).getTime();
                const rightDate = new Date(right.ngayChieuGioChieu).getTime();
                return leftDate - rightDate;
            });

            return complex;
        });

        return {
            maHeThongRap: system.maHeThongRap,
            tenHeThongRap: system.tenHeThongRap,
            logo: system.logo,
            cumRapChieu,
        };
    });

    return {
        maPhim: toIdString(firstMovie?._id || firstMovie),
        tenPhim: firstMovie?.tenPhim || "",
        heThongRapChieu,
    };
};
