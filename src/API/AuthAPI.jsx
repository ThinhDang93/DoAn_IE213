import { http } from "../utils/interceptor";

export const dangKyAPI = async (values) => {
  const res = await http.post("/api/QuanLyNguoiDung/DangKy", values);
  return res.data;
};
