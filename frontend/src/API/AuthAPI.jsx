import { http } from "../utils/interceptor";

export const dangKyAPI = async (values) => {
  const res = await http.post("/api/QuanLyNguoiDung/DangKy", values);
  return res.data;
};

export const capNhatThongTinTaiKhoanAPI = async (values) => {
  const res = await http.put("/api/QuanLyNguoiDung/ThongTinTaiKhoan", values);
  return res.data;
};
