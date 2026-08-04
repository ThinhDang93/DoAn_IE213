import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

const DATE_FORMATS = [
    "DD/MM/YYYY",
    "DD/MM/YYYY HH:mm",
    "YYYY-MM-DD",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DDTHH:mm",
    "YYYY-MM-DDTHH:mm:ss",
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
];

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

    for (const format of DATE_FORMATS) {
        const parsed = dayjs(text, format, true);
        if (parsed.isValid()) {
            return parsed.toDate();
        }
    }

    const fallback = dayjs(text);
    return fallback.isValid() ? fallback.toDate() : null;
};
