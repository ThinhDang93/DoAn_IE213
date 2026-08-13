import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { dangKyAPI } from "../../../API/AuthAPI";

const FormRegister = () => {
  const navigate = useNavigate();

  const frmRegister = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDT: "",
    },
    onSubmit: async (values) => {
      try {
        await dangKyAPI(values);
        alert("Đăng ký thành công, vui lòng đăng nhập");
        navigate("/login");
      } catch (error) {
        const message = error?.response?.data?.message || "Đăng ký thất bại";
        alert(message);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Đăng ký
        </h2>

        <form onSubmit={frmRegister.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taiKhoan" className="block text-gray-700 mb-1">
              Tài khoản
            </label>
            <input
              id="taiKhoan"
              name="taiKhoan"
              type="text"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-400"
              placeholder="Nhập tài khoản..."
              value={frmRegister.values.taiKhoan}
              onChange={frmRegister.handleChange}
            />
          </div>

          <div>
            <label htmlFor="matKhau" className="block text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="matKhau"
              name="matKhau"
              type="password"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-400"
              placeholder="Nhập mật khẩu..."
              value={frmRegister.values.matKhau}
              onChange={frmRegister.handleChange}
            />
          </div>

          <div>
            <label htmlFor="hoTen" className="block text-gray-700 mb-1">
              Họ tên
            </label>
            <input
              id="hoTen"
              name="hoTen"
              type="text"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-400"
              placeholder="Nhập họ tên..."
              value={frmRegister.values.hoTen}
              onChange={frmRegister.handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-400"
              placeholder="Nhập email..."
              value={frmRegister.values.email}
              onChange={frmRegister.handleChange}
            />
          </div>

          <div>
            <label htmlFor="soDT" className="block text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              id="soDT"
              name="soDT"
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-400"
              placeholder="Nhập số điện thoại..."
              value={frmRegister.values.soDT}
              onChange={frmRegister.handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={frmRegister.isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 shadow ${
              frmRegister.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {frmRegister.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormRegister;
