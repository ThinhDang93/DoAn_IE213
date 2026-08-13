import React, { useEffect, useState } from "react";
import {
  capNhatNguoiDungAPI,
  layDanhSachNguoiDungAPI,
  xoaNguoiDungAPI,
} from "../../../API/UserAPI";

const UserManager = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await layDanhSachNguoiDungAPI();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (taiKhoan, maLoaiNguoiDung) => {
    await capNhatNguoiDungAPI(taiKhoan, { maLoaiNguoiDung });
    await loadUsers();
  };

  const handleDelete = async (taiKhoan) => {
    if (window.confirm(`Bạn có muốn xoá tài khoản ${taiKhoan} không ?`)) {
      await xoaNguoiDungAPI(taiKhoan);
      await loadUsers();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Tài khoản</th>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Số ĐT</th>
              <th className="px-4 py-3">Loại người dùng</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.taiKhoan} className="border-b">
                <td className="px-4 py-3">{user.taiKhoan}</td>
                <td className="px-4 py-3">{user.hoTen}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.soDT}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.maLoaiNguoiDung}
                    onChange={(e) =>
                      handleRoleChange(user.taiKhoan, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    <option value="KhachHang">KhachHang</option>
                    <option value="QuanTri">QuanTri</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => handleDelete(user.taiKhoan)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
