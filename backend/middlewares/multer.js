import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = (folder) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `datvexemphim/${folder}`,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
    });

    return multer({
        storage,
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    });
};

export const uploadMovie = createUploader("movies");
export const uploadCinemaSystem = createUploader("cinema-systems");
export const uploadCinemaComplex = createUploader("cinema-complexes");
