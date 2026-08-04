import fs from "fs";
import multer from "multer";
import path from "path";

const moviesUploadDir = path.resolve(process.cwd(), "uploads/movies");
fs.mkdirSync(moviesUploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, moviesUploadDir);
    },
    filename: (_req, file, callback) => {
        const fileExtension = path.extname(file.originalname) || ".jpg";
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, `${safeName}${fileExtension}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

export default upload;
