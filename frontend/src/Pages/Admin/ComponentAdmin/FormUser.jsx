import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import {
  capNhatNguoiDungAPI,
  layDanhSachNguoiDungAPI,
  themNguoiDungAPI,
} from "../../../API/UserAPI";

const FormUser = () => {
  const match = useMatch("/admin/user/update/:taiKhoan");
  const params = useParams();
  const navigate = useNavigate();

  const isEdit = !!match;

  const frmUser = useFormik({
    enableReinitialize: true,
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDT: "",
      maLoaiNguoiDung: "KhachHang",
    },
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          const { taiKhoan, matKhau, ...updateData } = values;
          await capNhatNguoiDungAPI(taiKhoan, updateData);
          alert("Cập nhật người dùng thành công");
        } else {
          await themNguoiDungAPI(values);
          alert("Thêm người dùng thành công");
        }
        navigate("/admin/user");
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          (isEdit ? "Cập nhật thất bại" : "Thêm người dùng thất bại");
        alert(message);
      }
    },
  });

  const getUserEdit = async () => {
    const users = await layDanhSachNguoiDungAPI();
    const found = users.find((u) => u.taiKhoan === params.taiKhoan);
    if (found) {
      frmUser.setValues({ ...found, matKhau: "" });
    }
  };

  useEffect(() => {
    if (isEdit && params.taiKhoan) {
      getUserEdit();
    }
  }, [isEdit, params.taiKhoan]);

  return (
    <div className="p-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {isEdit ? "Cập nhật" : "Thêm mới"} người dùng
        </h2>
      </div>
      <form className="space-y-4 max-w-lg" onSubmit={frmUser.handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Tài khoản</label>
          <input
            id="taiKhoan"
            name="taiKhoan"
            type="text"
            value={frmUser.values.taiKhoan}
            onChange={frmUser.handleChange}
            disabled={isEdit}
            className="w-full border rounded-lg p-2 disabled:bg-gray-100"
            required
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              id="matKhau"
              name="matKhau"
              type="password"
              value={frmUser.values.matKhau}
              onChange={frmUser.handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Họ tên</label>
          <input
            id="hoTen"
            name="hoTen"
            type="text"
            value={frmUser.values.hoTen}
            onChange={frmUser.handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={frmUser.values.email}
            onChange={frmUser.handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input
            id="soDT"
            name="soDT"
            type="text"
            value={frmUser.values.soDT}
            onChange={frmUser.handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Loại người dùng</label>
          <select
            id="maLoaiNguoiDung"
            name="maLoaiNguoiDung"
            value={frmUser.values.maLoaiNguoiDung}
            onChange={frmUser.handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="KhachHang">KhachHang</option>
            <option value="QuanTri">QuanTri</option>
          </select>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            {isEdit ? "Cập nhật" : "Thêm"} người dùng
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUser;
