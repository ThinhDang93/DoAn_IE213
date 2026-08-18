import Seat from "../models/seats.js";

const SEATS_PER_ROW = 10;
const GIA_VE_THUONG = 75000;
const GIA_VE_VIP = 95000;

export const buildSeatsForRoom = (room) => {
    const rowCount = Math.max(1, Math.ceil(room.soLuongGhe / SEATS_PER_ROW));
    const seats = [];

    for (let row = 0; row < rowCount && seats.length < room.soLuongGhe; row += 1) {
        const rowLabel = String.fromCharCode(65 + row);
        const isLastRow = row === rowCount - 1;

        for (
            let col = 1;
            col <= SEATS_PER_ROW && seats.length < room.soLuongGhe;
            col += 1
        ) {
            const loaiGhe = isLastRow ? "Vip" : "Thuong";

            seats.push({
                tenGhe: `${rowLabel}${col}`,
                loaiGhe,
                maRap: room._id,
                giaVe: loaiGhe === "Vip" ? GIA_VE_VIP : GIA_VE_THUONG,
            });
        }
    }

    return seats;
};

export const seedSeats = async (rooms) => {
    const count = await Seat.countDocuments();

    if (count > 0) {
        return;
    }

    const docs = rooms.flatMap((room) => buildSeatsForRoom(room));

    if (docs.length > 0) {
        await Seat.insertMany(docs);
    }
};

// Dam bao du so ghe theo soLuongGhe hien tai cua room. Chi THEM/CAP NHAT
// (upsert theo cap {maRap, tenGhe}), khong bao gio xoa ghe da co - tranh
// lam hong tham chieu maGhe trong cac booking da tao truoc do.
export const syncSeatsForRoom = async (room) => {
    const desiredSeats = buildSeatsForRoom(room);

    if (desiredSeats.length === 0) {
        return;
    }

    const ops = desiredSeats.map((seat) => ({
        updateOne: {
            filter: { maRap: seat.maRap, tenGhe: seat.tenGhe },
            update: {
                $set: { loaiGhe: seat.loaiGhe, giaVe: seat.giaVe },
                $setOnInsert: { maRap: seat.maRap, tenGhe: seat.tenGhe },
            },
            upsert: true,
        },
    }));

    await Seat.bulkWrite(ops);
};
