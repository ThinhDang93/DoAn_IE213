import { http } from "../utils/interceptor";

export const DeleteFilmAPI = async (maphim) => {
  const res = await http.delete(`/api/QuanLyPhim/XoaPhim?MaPhim=${maphim}`);
};

export const AddnewFilmAPI = async (formData) => {
  const res = await http.post("/api/QuanLyPhim/ThemPhimUploadHinh", formData);
};

export const UpdateFilmAPI = async (formData) => {
  const res = await http.post("/api/QuanLyPhim/CapNhatPhimUpload", formData);
};
