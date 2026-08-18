import Banner from "../models/banners.js";

export const LayDanhSachBanner = async () => {
    return Banner.find().sort({ thuTu: 1, createdAt: -1 }).lean();
};

export const LayThongTinBanner = async (id) => {
    return Banner.findById(id).lean();
};

export const ThemBanner = async (data) => {
    const created = await Banner.create(data);
    return created.toObject();
};

export const CapNhatBanner = async (id, data) => {
    return Banner.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    }).lean();
};

export const XoaBanner = async (id) => {
    return Banner.findByIdAndDelete(id).lean();
};
