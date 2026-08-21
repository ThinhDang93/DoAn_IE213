// Viet Nam khong ap dung gio mua he (DST) nen lech UTC luon co dinh +7,
// dung phep cong/tru gio don gian la du chinh xac - khong can plugin
// timezone (IANA tz-database) cua dayjs, tranh phu thuoc du lieu tz cai
// tren moi trong server (Render, v.v...).
export const VIETNAM_UTC_OFFSET_HOURS = 7;
