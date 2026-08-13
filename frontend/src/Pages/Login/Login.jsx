import React from "react";
import Navbar from "../template/Navbar";
import Footer from "../template/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { http, TOKEN } from "../../utils/interceptor";

const Login = () => {
  const navigate = useNavigate();

  const frmLogin = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
    },
    onSubmit: async (values) => {
      localStorage.removeItem("user", TOKEN);
      const res = await http.post("/api/QuanLyNguoiDung/DangNhap", values);
      localStorage.setItem(TOKEN, res.data.content.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.content));
      const userData = res.data.content;
      console.log(res);

      if (
        userData.maLoaiNguoiDung === "QuanTri" ||
        userData.maLoaiNguoiDung === "quanTri"
      ) {
        navigate("/admin/film"); // Trang quản lý phim
      } else if (
        userData.maLoaiNguoiDung === "khachHang" ||
        userData.maLoaiNguoiDung === "KhachHang"
      ) {
        navigate("/"); // Trang chủ
      } else {
        alert("Không tìm thấy user");
      }
    },
  });
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Đăng nhập
          </h2>

          <form onSubmit={frmLogin.handleSubmit} className="space-y-5">
            {/* Tài khoản */}
            <div>
              <label htmlFor="text" className="block text-gray-700 mb-1">
                Tài khoản
              </label>
              <input
                id="taiKhoan"
                type="text"
                name="taiKhoan"
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                  frmLogin.touched.taiKhoan && frmLogin.errors.taiKhoan
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                placeholder="Nhập tài khoản..."
                value={frmLogin.values.taiKhoan}
                onChange={frmLogin.handleChange}
                onBlur={frmLogin.handleBlur}
              />
              {frmLogin.touched.taiKhoan && frmLogin.errors.taiKhoan && (
                <p className="text-red-500 text-sm mt-1">
                  {frmLogin.errors.taiKhoan}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                id="matKhau"
                type="password"
                name="matKhau"
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                  frmLogin.touched.matKhau && frmLogin.errors.matKhau
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                placeholder="Nhập mật khẩu..."
                value={frmLogin.values.matKhau}
                onChange={frmLogin.handleChange}
                onBlur={frmLogin.handleBlur}
              />
              {frmLogin.touched.matKhau && frmLogin.errors.matKhau && (
                <p className="text-red-500 text-sm mt-1">
                  {frmLogin.errors.matKhau}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={frmLogin.isSubmitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 shadow ${
                frmLogin.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {frmLogin.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* Đăng ký */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Chưa có tài khoản?{" "}
            <NavLink
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
