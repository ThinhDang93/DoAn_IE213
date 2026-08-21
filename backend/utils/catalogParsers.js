import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";
import { VIETNAM_UTC_OFFSET_HOURS } from "./vietnamTime.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// Cac dinh dang KHONG kem thong tin timezone (nguoi dung/FE nhap gio theo
// dong ho Viet Nam) - phai +/- lech gio VN khi doi qua lai UTC de luu DB,
// khong duoc de dayjs tu doan theo timezone cua server dang chay (Render
// mac dinh la UTC, khac VN 7 tieng, gay lech gio hien thi).
const NAIVE_LOCAL_FORMATS = [
    "DD/MM/YYYY",
    "DD/MM/YYYY HH:mm",
    "YYYY-MM-DD",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DDTHH:mm",
    "YYYY-MM-DDTHH:mm:ss",
];

// Dinh dang co "Z" - da la UTC tuong minh (vd tu Date.toISOString()),
// khong duoc cong/tru lech gio nua.
const UTC_TAGGED_FORMATS = ["YYYY-MM-DDTHH:mm:ss.SSS[Z]"];

export const parseBoolean = (value, fallback = false) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();

        if (normalized === "true" || normalized === "1") {
            return true;
        }

        if (normalized === "false" || normalized === "0") {
            return false;
        }
    }

    return fallback;
};

export const parseNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseDateInput = (value) => {
    if (!value) {
        return null;
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    const text = String(value).trim();

    for (const format of NAIVE_LOCAL_FORMATS) {
        const parsed = dayjs.utc(text, format, true);
        if (parsed.isValid()) {
            return parsed.subtract(VIETNAM_UTC_OFFSET_HOURS, "hour").toDate();
        }
    }

    for (const format of UTC_TAGGED_FORMATS) {
        const parsed = dayjs.utc(text, format, true);
        if (parsed.isValid()) {
            return parsed.toDate();
        }
    }

    const fallback = dayjs(text);
    return fallback.isValid() ? fallback.toDate() : null;
};
