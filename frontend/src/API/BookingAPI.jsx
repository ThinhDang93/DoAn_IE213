import { http } from "../utils/interceptor";

export const DatVeAPI = async (maLichChieu, danhSachGhe) => {
  const res = await http.post("/api/QuanLyDatVe/DatVe", {
    maLichChieu,
    danhSachGhe,
  });
  return res.data;
};

export const LayLichSuDatVeAPI = async () => {
  const res = await http.get("/api/QuanLyDatVe/LayLichSuDatVe");
  return res.data.content;
};

export const HuyVeAPI = async (maVe) => {
  const res = await http.put(`/api/QuanLyDatVe/HuyVe?MaVe=${maVe}`);
  return res.data;
};

export const LayDanhSachVeDaBanAPI = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await http.get(
    `/api/QuanLyDatVe/LayDanhSachVeDaBan${query ? `?${query}` : ""}`
  );
  return res.data.content;
};

export const ThongKeDoanhThuAPI = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await http.get(
    `/api/QuanLyDatVe/ThongKeDoanhThu${query ? `?${query}` : ""}`
  );
  return res.data.content;
};
