export interface FilmFormData {
  maPhim: number;
  tenPhim: string;
  trailer: string;
  moTa: string;
  maNhom: string;
  ngayKhoiChieu: string;
  SapChieu: boolean;
  DangChieu: boolean;
  Hot: boolean;
  danhGia: number;
  hinhAnh?: File | null;
}
