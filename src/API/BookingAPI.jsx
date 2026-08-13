import { http } from "../utils/interceptor";

export const DatVeAPI = async (maLichChieu, danhSachGhe) => {
  const res = await http.post("/api/QuanLyDatVe/DatVe", {
    maLichChieu,
    danhSachGhe,
  });
  return res.data;
};
