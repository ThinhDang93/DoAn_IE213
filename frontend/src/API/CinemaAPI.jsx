import { http } from "../utils/interceptor";

const toFormData = (fields, fileKey) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (key === fileKey) {
      if (value instanceof File) {
        formData.append("File", value);
      } else {
        formData.append(key, value);
      }
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

// He thong rap
export const LayDanhSachHeThongRapAPI = async () => {
  const res = await http.get("/api/QuanLyHeThongRap/LayThongTinHeThongRap");
  return res.data.content;
};

export const ThemHeThongRapAPI = async (data) => {
  const formData = toFormData(data, "logo");
  const res = await http.post(
    "/api/QuanLyHeThongRap/ThemHeThongRap",
    formData
  );
  return res.data;
};

export const CapNhatHeThongRapAPI = async (maHeThongRap, data) => {
  const formData = toFormData({ maHeThongRap, ...data }, "logo");
  const res = await http.put(
    "/api/QuanLyHeThongRap/CapNhatHeThongRap",
    formData
  );
  return res.data;
};

export const XoaHeThongRapAPI = async (maHeThongRap) => {
  const res = await http.delete(
    `/api/QuanLyHeThongRap/XoaHeThongRap?MaHeThongRap=${maHeThongRap}`
  );
  return res.data;
};

// Cum rap
export const LayDanhSachCumRapAPI = async () => {
  const res = await http.get("/api/QuanLyCumRap/LayDanhSachCumRap");
  return res.data.content;
};

export const ThemCumRapAPI = async (data) => {
  const formData = toFormData(data, "hinhAnh");
  const res = await http.post("/api/QuanLyCumRap/ThemCumRap", formData);
  return res.data;
};

export const CapNhatCumRapAPI = async (maCumRap, data) => {
  const formData = toFormData({ maCumRap, ...data }, "hinhAnh");
  const res = await http.put("/api/QuanLyCumRap/CapNhatCumRap", formData);
  return res.data;
};

export const XoaCumRapAPI = async (maCumRap) => {
  const res = await http.delete(
    `/api/QuanLyCumRap/XoaCumRap?MaCumRap=${maCumRap}`
  );
  return res.data;
};

// Rap (phong chieu)
export const LayDanhSachRapAPI = async () => {
  const res = await http.get("/api/QuanLyRap/LayDanhSachRap");
  return res.data.content;
};

export const ThemRapAPI = async (data) => {
  const res = await http.post("/api/QuanLyRap/ThemRap", data);
  return res.data;
};

export const CapNhatRapAPI = async (maRap, data) => {
  const res = await http.put("/api/QuanLyRap/CapNhatRap", {
    maRap,
    ...data,
  });
  return res.data;
};

export const XoaRapAPI = async (maRap) => {
  const res = await http.delete(`/api/QuanLyRap/XoaRap?MaRap=${maRap}`);
  return res.data;
};
