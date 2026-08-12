import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedCatalogData } from "./utils/seedCatalogData.js";
import { seedSeats } from "./utils/seedSeatsData.js";
import { seedUsers } from "./utils/seedUsersData.js";

dotenv.config();

const run = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MOVIEREVIEWS_DB_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not configured in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected, seeding data...");

    const { systems, complexes, rooms, movies } = await seedCatalogData();
    await seedSeats(rooms);
    await seedUsers();

    console.log(`Seeded ${systems.length} cinema systems`);
    console.log(`Seeded ${complexes.length} cinema complexes`);
    console.log(`Seeded ${rooms.length} rooms`);
    console.log(`Seeded ${movies.length} movies`);
    console.log("Seeded seats and users (admin/khachhang1) if not already present");

    await mongoose.disconnect();
    console.log("Done.");
};

run().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
