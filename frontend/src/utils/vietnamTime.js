// Moi gio chieu/ngay chieu tra ve tu backend la chuoi UTC (ISO). Phai luon
// format tuong minh theo timeZone "Asia/Ho_Chi_Minh" thay vi dung
// toLocaleString mac dinh (phu thuoc timezone cua trinh duyet nguoi xem),
// de dam bao moi nguoi deu thay dung gio Viet Nam.
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

const getPartsMap = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: VIETNAM_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const parts = {};
    formatter.formatToParts(date).forEach(({ type, value: partValue }) => {
        parts[type] = partValue;
    });
    return parts;
};

export const formatVietnamDate = (value) => {
    const parts = getPartsMap(value);
    if (!parts) return "";
    return `${parts.day}/${parts.month}/${parts.year}`;
};

export const formatVietnamTime = (value) => {
    const parts = getPartsMap(value);
    if (!parts) return "";
    return `${parts.hour}:${parts.minute}`;
};

export const formatVietnamDateTime = (value) => {
    const parts = getPartsMap(value);
    if (!parts) return "";
    return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
};

// Gia tri cho <input type="datetime-local"> (dinh dang "YYYY-MM-DDTHH:mm"),
// theo dung gio Viet Nam thay vi gio dia phuong cua trinh duyet.
export const toVietnamDatetimeLocalValue = (value) => {
    const parts = getPartsMap(value);
    if (!parts) return "";
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};
