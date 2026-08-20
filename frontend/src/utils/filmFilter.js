// Tach chuoi theLoai (vd "Hành động, Viễn tưởng") thanh mang tag da trim
export const getTheLoaiTags = (theLoai) => {
  if (!theLoai) return [];
  return theLoai
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const DIACRITICS_REGEX = /[̀-ͯ]/g;

// Bo dau tieng Viet + lowercase, dung de so sanh tim kiem khong phan biet dau
export const normalizeText = (value) => {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
};
