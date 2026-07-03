import { setCookie } from "../utils/cookie";
import { http, TOKEN } from "../utils/interceptor";

export const getUserToken = async (value) => {
  const res = await http.post("/api/QuanLyNguoiDung/DangNhap", value);
  localStorage.setItem(TOKEN, res.data.content.accessToken);
  localStorage.setItem("user", JSON.stringify(res.data.content));
};
