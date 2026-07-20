import app from './server.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function main() {
    dotenv.config();
    const port = process.env.PORT || 8080;

    try {
        // Thiết lập kết nối đến cơ sở dữ liệu MongoDB
        await mongoose.connect(process.env.MOVIEREVIEWS_DB_URI);
        console.log("Database connection established.");

        // Khởi chạy máy chủ web
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    } catch (error) {
        console.error("Initialization error:", error);
        process.exit(1);
    }
}

main().catch(console.error);