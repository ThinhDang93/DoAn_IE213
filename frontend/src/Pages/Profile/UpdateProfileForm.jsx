import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { capNhatThongTinTaiKhoanAPI } from "../../API/AuthAPI";
import { setUser } from "../../redux/reducers/AuthReducer";

const UpdateProfileForm = ({ user, onClose, onUpdated }) => {
  const dispatch = useDispatch();

  const frmUpdate = useFormik({
    initialValues: {
      hoTen: user?.hoTen || "",
      email: user?.email || "",
      soDT: user?.soDT || "",
    },
    validationSchema: Yup.object({
      hoTen: Yup.string().trim().required("Vui lòng nhập họ tên"),
      email: Yup.string().trim().email("Email không hợp lệ").required("Vui lòng nhập email"),
      soDT: Yup.string()
        .trim()
        .matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await capNhatThongTinTaiKhoanAPI(values);
        const updatedUser = { ...user, ...res.content };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch(setUser(updatedUser));
        onUpdated?.(updatedUser);
        alert("Cập nhật thông tin thành công");
        onClose?.();
      } catch (error) {
        alert(error?.response?.data?.message || "Cập nhật thất bại");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Cập nhật thông tin cá nhân</h3>

        <form onSubmit={frmUpdate.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Họ tên</label>
            <input
              id="hoTen"
              name="hoTen"
              type="text"
              value={frmUpdate.values.hoTen}
              onChange={frmUpdate.handleChange}
              onBlur={frmUpdate.handleBlur}
              className={`w-full border rounded-lg p-2 ${
                frmUpdate.touched.hoTen && frmUpdate.errors.hoTen
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
            {frmUpdate.touched.hoTen && frmUpdate.errors.hoTen && (
              <p className="text-red-500 text-sm mt-1">{frmUpdate.errors.hoTen}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={frmUpdate.values.email}
              onChange={frmUpdate.handleChange}
              onBlur={frmUpdate.handleBlur}
              className={`w-full border rounded-lg p-2 ${
                frmUpdate.touched.email && frmUpdate.errors.email
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
            {frmUpdate.touched.email && frmUpdate.errors.email && (
              <p className="text-red-500 text-sm mt-1">{frmUpdate.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Số điện thoại</label>
            <input
              id="soDT"
              name="soDT"
              type="text"
              value={frmUpdate.values.soDT}
              onChange={frmUpdate.handleChange}
              onBlur={frmUpdate.handleBlur}
              className={`w-full border rounded-lg p-2 ${
                frmUpdate.touched.soDT && frmUpdate.errors.soDT
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
            {frmUpdate.touched.soDT && frmUpdate.errors.soDT && (
              <p className="text-red-500 text-sm mt-1">{frmUpdate.errors.soDT}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={frmUpdate.isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-70"
            >
              {frmUpdate.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
