import { http } from "../utils/interceptor";

export const LayDanhSachLichChieuAPI = async () => {
  const res = await http.get("/api/QuanLyLichChieu/LayDanhSachLichChieu");
  return res.data.content;
};

export const LayThongTinLichChieuAPI = async (maLichChieu) => {
  const res = await http.get(
    `/api/QuanLyLichChieu/LayThongTinLichChieu?MaLichChieu=${maLichChieu}`
  );
  return res.data.content;
};

export const ThemLichChieuAPI = async (data) => {
  const res = await http.post("/api/QuanLyLichChieu/ThemLichChieu", data);
  return res.data;
};

export const CapNhatLichChieuAPI = async (maLichChieu, data) => {
  const res = await http.put("/api/QuanLyLichChieu/CapNhatLichChieu", {
    maLichChieu,
    ...data,
  });
  return res.data;
};

export const XoaLichChieuAPI = async (maLichChieu) => {
  const res = await http.delete(
    `/api/QuanLyLichChieu/XoaLichChieu?MaLichChieu=${maLichChieu}`
  );
  return res.data;
};
