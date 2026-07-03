export const convertToFormData = (values, isEdit = false) => {
  const formData = new FormData();

  for (let key in values) {
    if (key === "hinhAnh") {
      if (values.hinhAnh instanceof File) {
        formData.append("File", values.hinhAnh); // 👈 đúng key
      }
    } else if (key === "ngayKhoiChieu") {
      if (values.ngayKhoiChieu) {
        const formattedDate = new Date(values.ngayKhoiChieu)
          .toLocaleDateString("en-GB"); // dd/MM/yyyy
        formData.append("ngayKhoiChieu", formattedDate);
      }
    } else if (key === "maPhim") {
      // Nếu là Add thì bỏ qua maPhim
      if (isEdit) {
        formData.append("maPhim", values.maPhim);
      }
    } else {
      formData.append(key, values[key]);
    }
  }

  // BE luôn yêu cầu maNhom
  if (!formData.has("maNhom")) {
    formData.append("maNhom", "GP01");
  }

  return formData;
};
