import { http } from "../utils/interceptor";

export const getFilmBannerAPI = async () => {
  const res = await http.get("/api/QuanLyPhim/LayDanhSachBanner");
  return res.data.content;
};

