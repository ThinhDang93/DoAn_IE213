import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { http } from "../../../utils/interceptor";
import { AddnewFilmAPI, UpdateFilmAPI } from "../../../API/APIFilm";
import { convertToFormData } from "../../../utils/convertToFormData";

const FormFilm = () => {
  const match = useMatch("/admin/film/update/:maPhim");

  const params = useParams();

  const navigate = useNavigate();

  const isEdit = !!match;

  const frmFilm = useFormik({
    enableReinitialize: true,
    initialValues: {
      tenPhim: "",
      trailer: "",
      moTa: "",
      ngayKhoiChieu: "",
      dangChieu: false,
      sapChieu: false,
      hot: false,
      danhGia: 0,
      hinhAnh: null,
    },
    onSubmit: async (values) => {
      if (isEdit) {
        const formData = convertToFormData(
          { ...values, maPhim: params.maPhim },
          true
        );
        await UpdateFilmAPI(formData);
        alert("Update phim thành công");
      } else {
        const formData = convertToFormData(values, false);
        await AddnewFilmAPI(formData);
        alert("Add phim thành công");
      }
      navigate("/admin/film");
    },
  });

  const getFilmEdit = async () => {
    const res = await http.get(
      `/api/QuanLyPhim/LayThongTinPhim?MaPhim=${params.maPhim}`
    );
    const data = res.data.content;
    frmFilm.setValues(data);
  };

  useEffect(() => {
    if (isEdit && params.maPhim) {
      getFilmEdit();
    }
  }, [isEdit, params.maPhim]);

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {isEdit ? "Cập nhật" : "Thêm mới"} phim
        </h2>
      </div>
      <form className="space-y-4" onSubmit={frmFilm.handleSubmit}>
        {/* Tên phim */}
        <div>
          <label className="block mb-1 font-medium">Tên phim</label>
          <input
            id="tenPhim"
            type="text"
            name="tenPhim"
            value={frmFilm.values.tenPhim}
            onChange={frmFilm.handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Trailer */}
        <div>
          <label className="block mb-1 font-medium">Trailer</label>
          <input
            id="trailer"
            type="text"
            name="trailer"
            value={frmFilm.values.trailer}
            onChange={frmFilm.handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            name="moTa"
            id="moTa"
            value={frmFilm.values.moTa}
            onChange={frmFilm.handleChange}
            className="w-full border rounded-lg p-2"
            rows="3"
          ></textarea>
        </div>

        {/* Ngày khởi chiếu */}
        <div>
          <label className="block mb-1 font-medium">Ngày khởi chiếu</label>
          <input
            type="string"
            id="ngayKhoiChieu"
            name="ngayKhoiChieu"
            value={frmFilm.values.ngayKhoiChieu}
            onChange={frmFilm.handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Checkbox */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              id="dangChieu"
              type="checkbox"
              name="dangChieu"
              checked={frmFilm.values.dangChieu}
              onChange={frmFilm.handleChange}
            />
            Đang chiếu
          </label>
          <label className="flex items-center gap-2">
            <input
              id="sapChieu"
              type="checkbox"
              name="sapChieu"
              checked={frmFilm.values.sapChieu}
              onChange={frmFilm.handleChange}
            />
            Sắp chiếu
          </label>
          <label className="flex items-center gap-2">
            <input
              id="hot"
              type="checkbox"
              name="hot"
              checked={frmFilm.values.hot}
              onChange={frmFilm.handleChange}
            />
            Hot
          </label>
        </div>

        {/* Số rate */}
        <div>
          <label className="block mb-1 font-medium">Số rate</label>
          <input
            id="danhGia"
            type="number"
            name="danhGia"
            value={frmFilm.values.danhGia}
            onChange={frmFilm.handleChange}
            min="0"
            max="10"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Hình ảnh */}
        <div>
          <label className="block mb-1 font-medium">Hình ảnh</label>
          <input
            id="hinhAnh"
            type="file"
            name="hinhAnh"
            accept="image/*"
            onChange={(e) =>
              frmFilm.setFieldValue("hinhAnh", e.currentTarget.files[0])
            }
            className="w-full"
          />
          {frmFilm.values.hinhAnh &&
            (typeof frmFilm.values.hinhAnh === "string" ? (
              <img
                src={frmFilm.values.hinhAnh}
                alt="preview"
                className="w-32 h-40 mt-2 object-cover rounded-lg border"
              />
            ) : (
              <img
                src={URL.createObjectURL(frmFilm.values.hinhAnh)}
                alt="preview"
                className="w-32 h-40 mt-2 object-cover rounded-lg border"
              />
            ))}{" "}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            {isEdit ? "Cập nhật phim" : "Thêm phim"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormFilm;

// Note CV
/**
 * Phần Thịnh
 * CV chưa làm:
 * - chỉnh sửa lại hình ảnh rõ , không bị bể
 * - phần trang Home , render ra thông tin Cụm rạp + xuất chiếu
 * - CRUD phần lịch chiếu + xuất chiếu
 * - thêm phần trang đăng nhập (UI + API)
 *
 * Phần All
 * - Trang thông tin user
 * - CRUD user -> Trang UserManager
 * - khi hoàn thiện phần trên , chỉnh sửa lại điều hướng Home -> muốn đặt vé -> Login page, hiện thị tên user ở góc phải trên -> Detail Film -> đặt vé thành công -> Home -> thông tin tài khoản người dùng cập nhật với vé đã đặt
 */
