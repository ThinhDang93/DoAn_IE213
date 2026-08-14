import { http } from "../utils/interceptor";

// He thong rap
export const LayDanhSachHeThongRapAPI = async () => {
  const res = await http.get("/api/QuanLyHeThongRap/LayThongTinHeThongRap");
  return res.data.content;
};

export const ThemHeThongRapAPI = async (data) => {
  const res = await http.post("/api/QuanLyHeThongRap/ThemHeThongRap", data);
  return res.data;
};

export const CapNhatHeThongRapAPI = async (maHeThongRap, data) => {
  const res = await http.put("/api/QuanLyHeThongRap/CapNhatHeThongRap", {
    maHeThongRap,
    ...data,
  });
  return res.data;
};

export const XoaHeThongRapAPI = async (maHeThongRap) => {
  const res = await http.delete(
    `/api/QuanLyHeThongRap/XoaHeThongRap?MaHeThongRap=${maHeThongRap}`
  );
  return res.data;
};

// Cum rap
export const LayDanhSachCumRapAPI = async () => {
  const res = await http.get("/api/QuanLyCumRap/LayDanhSachCumRap");
  return res.data.content;
};

export const ThemCumRapAPI = async (data) => {
  const res = await http.post("/api/QuanLyCumRap/ThemCumRap", data);
  return res.data;
};

export const CapNhatCumRapAPI = async (maCumRap, data) => {
  const res = await http.put("/api/QuanLyCumRap/CapNhatCumRap", {
    maCumRap,
    ...data,
  });
  return res.data;
};

export const XoaCumRapAPI = async (maCumRap) => {
  const res = await http.delete(
    `/api/QuanLyCumRap/XoaCumRap?MaCumRap=${maCumRap}`
  );
  return res.data;
};

// Rap (phong chieu)
export const LayDanhSachRapAPI = async () => {
  const res = await http.get("/api/QuanLyRap/LayDanhSachRap");
  return res.data.content;
};

export const ThemRapAPI = async (data) => {
  const res = await http.post("/api/QuanLyRap/ThemRap", data);
  return res.data;
};

export const CapNhatRapAPI = async (maRap, data) => {
  const res = await http.put("/api/QuanLyRap/CapNhatRap", {
    maRap,
    ...data,
  });
  return res.data;
};

export const XoaRapAPI = async (maRap) => {
  const res = await http.delete(`/api/QuanLyRap/XoaRap?MaRap=${maRap}`);
  return res.data;
};
