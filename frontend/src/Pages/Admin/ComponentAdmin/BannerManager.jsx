import React, { useEffect, useState } from "react";
import {
  CapNhatBannerAPI,
  LayDanhSachBannerAPI,
  ThemBannerAPI,
  XoaBannerAPI,
} from "../../../API/BannerAPI";

const emptyForm = { hinhAnh: null, thuTu: 0 };

const getPreviewUrl = (value) => {
  if (!value) return "";
  if (value instanceof File) return URL.createObjectURL(value);
  return value;
};

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadBanners = async () => {
    const data = await LayDanhSachBannerAPI();
    setBanners(data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (form.hinhAnh instanceof File) {
        formData.append("File", form.hinhAnh);
      }
      formData.append("thuTu", form.thuTu);

      if (editingId) {
        formData.append("maBanner", editingId);
        await CapNhatBannerAPI(formData);
      } else {
        if (!(form.hinhAnh instanceof File)) {
          alert("Vui lòng chọn ảnh banner");
          return;
        }
        await ThemBannerAPI(formData);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadBanners();
    } catch (error) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const editBanner = (banner) => {
    setEditingId(banner.maBanner);
    setForm({ hinhAnh: banner.hinhAnh, thuTu: banner.thuTu });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (maBanner) => {
    if (!window.confirm("Xoá banner này?")) return;
    try {
      await XoaBannerAPI(maBanner);
      await loadBanners();
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể xoá");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý banner trang chủ</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, hinhAnh: e.target.files[0] })
          }
          className="border rounded-lg p-2"
        />
        {form.hinhAnh && (
          <img
            src={getPreviewUrl(form.hinhAnh)}
            alt="preview"
            className="w-24 h-14 object-cover border rounded"
          />
        )}
        <input
          type="number"
          value={form.thuTu}
          onChange={(e) => setForm({ ...form, thuTu: e.target.value })}
          placeholder="Thứ tự"
          className="border rounded-lg p-2 w-28"
        />
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {editingId ? "Cập nhật" : "+ Thêm banner"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-gray-600 underline"
          >
            Huỷ sửa
          </button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Ảnh</th>
              <th className="px-4 py-2">Thứ tự</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.maBanner} className="border-b">
                <td className="px-4 py-2">
                  <img
                    src={b.hinhAnh}
                    alt="banner"
                    className="w-32 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{b.thuTu}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-green-700 hover:text-white border-2 border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5"
                    onClick={() => editBanner(b)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5"
                    onClick={() => handleDelete(b.maBanner)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {banners.length === 0 && (
          <p className="text-gray-500 mt-4">Chưa có banner nào.</p>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
