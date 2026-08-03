import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import cinemaComplexRoutes from "./src/routes/cinemaComplex.routes.js";
import cinemaSystemRoutes from "./src/routes/cinemaSystem.routes.js";
import movieRoutes from "./src/routes/movie.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import showtimeRoutes from "./src/routes/showtime.routes.js";
import { connectDatabase } from "./src/config/database.js";
import { seedCatalogData } from "./src/utils/seedCatalogData.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

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
    await connectDatabase();

    if (process.env.SEED_CATALOG_ON_START !== "false") {
        await seedCatalogData();
    }

    app.listen(PORT, () => {
        console.log(`Backend is listening on http://localhost:${PORT}`);
    });
};

bootstrap().catch((error) => {
    console.error("Failed to start backend", error);
    process.exit(1);
});