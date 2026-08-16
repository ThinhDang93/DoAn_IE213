import "dotenv/config";
import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cinemaComplexRoutes from "./routes/cinemaComplex.routes.js";
import cinemaSystemRoutes from "./routes/cinemaSystem.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import roomRoutes from "./routes/room.routes.js";
import showtimeRoutes from "./routes/showtime.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import { seedCatalogData } from "./utils/seedCatalogData.js";
import { seedSeats } from "./utils/seedSeatsData.js";
import { seedUsers } from "./utils/seedUsersData.js";

const app = express();
const PORT = Number(process.env.PORT || 8080);

const connectDatabase = async () => {
    const mongoUri =
        process.env.MONGO_URI || process.env.MOVIEREVIEWS_DB_URI || "";

    if (!mongoUri) {
        console.warn("MongoDB URI is not configured; starting without database.");
        return false;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected");
        return true;
    } catch (error) {
        console.warn("MongoDB connection failed; starting without database.");
        console.warn(error.message);
        return false;
    }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.status(200).json({
        statusCode: 200,
        message: "Catalog backend is running",
        content: null,
    });
});

app.use("/api/QuanLyPhim", movieRoutes);
app.use("/api/QuanLyHeThongRap", cinemaSystemRoutes);
app.use("/api/QuanLyCumRap", cinemaComplexRoutes);
app.use("/api/QuanLyRap", roomRoutes);
app.use("/api/QuanLyLichChieu", showtimeRoutes);
app.use("/api/QuanLyNguoiDung", authRoutes);
app.use("/api/QuanLyNguoiDung", userRoutes);
app.use("/api/QuanLyDatVe", bookingRoutes);

app.use((_req, res) => {
    res.status(404).json({
        statusCode: 404,
        message: "Endpoint not found",
        content: null,
    });
});

app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({
        statusCode: 500,
        message: error.message || "Internal server error",
        content: null,
    });
});

const bootstrap = async () => {
    const connected = await connectDatabase();

    if (connected && process.env.SEED_CATALOG_ON_START !== "false") {
        const { rooms } = await seedCatalogData();
        await seedSeats(rooms);
        await seedUsers();
    }

    app.listen(PORT, () => {
        console.log(`Backend is listening on http://localhost:${PORT}`);
    });
};

bootstrap().catch((error) => {
    console.error("Failed to start backend", error);
    process.exit(1);
});