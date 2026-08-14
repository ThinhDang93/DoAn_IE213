import { http } from "../utils/interceptor";

export const layDanhSachNguoiDungAPI = async () => {
  const res = await http.get("/api/QuanLyNguoiDung/DanhSachNguoiDung");
  return res.data.content;
};

export const themNguoiDungAPI = async (data) => {
  const res = await http.post("/api/QuanLyNguoiDung/ThemNguoiDung", data);
  return res.data;
};

export const capNhatNguoiDungAPI = async (taiKhoan, data) => {
  const res = await http.put(
    `/api/QuanLyNguoiDung/CapNhatNguoiDung?TaiKhoan=${taiKhoan}`,
    data
  );
  return res.data;
};

export const xoaNguoiDungAPI = async (taiKhoan) => {
  const res = await http.delete(
    `/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`
  );
  return res.data;
};
