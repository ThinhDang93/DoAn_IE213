import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = (folder, transformation) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `datvexemphim/${folder}`,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            ...(transformation ? { transformation: [transformation] } : {}),
        },
    });

    return multer({
        storage,
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    });
};

// Kich thuoc chuan cho banner trang chu - moi anh upload len deu duoc
// Cloudinary resize + crop ve dung 2048x877 (crop "fill" + gravity "auto"
// de tu dong giu lai phan noi dung quan trong nhat khi crop), dam bao
// dong bo ty le giua cac banner du anh goc co kich thuoc gi.
const BANNER_WIDTH = 2048;
const BANNER_HEIGHT = 877;

export const uploadMovie = createUploader("movies");
export const uploadCinemaSystem = createUploader("cinema-systems");
export const uploadCinemaComplex = createUploader("cinema-complexes");
export const uploadBanner = createUploader("banners", {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    crop: "fill",
    gravity: "auto",
});
