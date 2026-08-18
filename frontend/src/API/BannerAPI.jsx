import { http } from "../utils/interceptor";

export const LayDanhSachBannerAPI = async () => {
  const res = await http.get("/api/QuanLyBanner/LayDanhSachBanner");
  return res.data.content;
};

export const ThemBannerAPI = async (formData) => {
  const res = await http.post("/api/QuanLyBanner/ThemBanner", formData);
  return res.data;
};

export const CapNhatBannerAPI = async (formData) => {
  const res = await http.put("/api/QuanLyBanner/CapNhatBanner", formData);
  return res.data;
};

export const XoaBannerAPI = async (maBanner) => {
  const res = await http.delete(
    `/api/QuanLyBanner/XoaBanner?MaBanner=${maBanner}`
  );
  return res.data;
};
