import Icon2D from "../assets/cinema-format-badges/2d.svg";
import Icon3D from "../assets/cinema-format-badges/3d.svg";
import Icon4DX from "../assets/cinema-format-badges/4dx.svg";
import IconIMAX from "../assets/cinema-format-badges/imax.svg";
import IconScreenX from "../assets/cinema-format-badges/screenx.svg";

const FORMAT_BADGES = {
  "2D": { src: Icon2D, label: "2D" },
  "3D": { src: Icon3D, label: "3D" },
  "4DX": { src: Icon4DX, label: "4DX" },
  IMAX: { src: IconIMAX, label: "IMAX" },
  SCREENX: { src: IconScreenX, label: "ScreenX" },
};

const normalizeFormatKey = (raw) => raw.trim().toUpperCase().replace(/\s+/g, "");

// Tach chuoi dinhDang (vd "2D, 3D, IMAX") thanh danh sach badge tuong ung,
// bo qua cac dinh dang khong khop bo icon co san.
export const getFormatBadges = (dinhDang) => {
  if (!dinhDang) return [];

  return dinhDang
    .split(",")
    .map((part) => normalizeFormatKey(part))
    .filter(Boolean)
    .map((key) => FORMAT_BADGES[key])
    .filter(Boolean);
};
