# NOTE — Kế hoạch hoàn thiện Backend & Database (Website đặt vé xem phim)

> Note này viết cho **Claude** (phiên làm việc sau, có quyền truy cập repo qua bash/git) dùng để tự
> rà soát, hoàn thiện và kiểm thử toàn bộ phần Backend + Database còn thiếu của dự án. Đọc hết mục
> 0-2 trước khi bắt đầu bất kỳ thao tác nào.

## 0. Việc cần hỏi lại người dùng TRƯỚC khi thực thi (blocking)

Không tự suy đoán các mục sau — dừng lại và hỏi Thịnh nếu chưa có:

- [ ] **Link repo Backend thật** trên GitHub (repo này chỉ mới có FE tại
      `https://github.com/ThinhDang93/DoAn_IE213.git`, chưa rõ tên/link repo BE của 3 bạn còn lại).
- [ ] **Connection string MongoDB Atlas** (`MONGODB_URI`) — Claude không tự tạo được tài khoản/cluster
      Atlas thay người dùng. Nếu chưa có, hướng dẫn Thịnh tạo theo mục 4 rồi cung cấp lại.
- [ ] Tên các **nhánh git** của 3 người (nghi ngờ dạng `feature/auth`, `feature/catalog`,
      `feature/booking` theo kế hoạch đã thống nhất — cần xác nhận tên thật).
- [ ] Các biến môi trường khác nếu có (`JWT_SECRET`, `PORT`, thư mục lưu ảnh upload...).

## 1. Bối cảnh dự án (đọc để không hỏi lại những gì đã biết)

- Frontend đã có sẵn: React + Redux Toolkit + Vite, hiện đang gọi API demo của CyberSoft
  (`movienew.cybersoft.edu.vn`). Mục tiêu là thay bằng Backend + Database tự xây, **không sửa lại
  field/casing mà FE đã hardcode** trừ khi thực sự cần và đã có xác nhận.
- Stack Backend: **Node.js (Express) + MongoDB (Mongoose)**.
- Team 4 người: 1 người (Thịnh) làm toàn bộ Frontend; 3 người còn lại chia nhau:
  - **Người 1** — Auth & User (`users`, middleware JWT)
  - **Người 2** — Catalog (`movies`, `cinemaSystems`, `cinemaComplexes`, `rooms`, `showtimes`)
  - **Người 3** — Booking & Ghế (`seats`, `bookings`)
- Đã có 2 tài liệu tham khảo trước đó (nếu tìm thấy trong repo hoặc do Thịnh cung cấp, ưu tiên đọc
  lại để đối chiếu):
  - `PhanCongCongViec_BE_DB.docx` — bảng phân công tổng quan.
  - `ChiTietKyThuat_TungNguoi.docx` — chi tiết field từng collection + điều kiện map với FE.
  Toàn bộ nội dung cốt lõi của 2 file này đã được chép lại đầy đủ ở mục 5 và 6 bên dưới, nên **không
  bắt buộc phải có 2 file đó mới làm được** — note này tự đủ thông tin.

## 2. Quy ước bắt buộc — áp dụng cho MỌI endpoint

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Query string param | PascalCase | `?MaPhim=`, `?MaLichChieu=` |
| Field trong JSON body/response | camelCase, không dấu | `maPhim`, `tenPhim`, `danhSachGhe` |
| Field ảnh trong multipart form | giữ tên `"File"` trừ khi đã thống nhất đổi với Thịnh | `formData.append("File", ...)` |
| Response wrapper | luôn bọc trong `content` | `{ statusCode, message, content }` |
| Enum loại người dùng | `"QuanTri"` hoặc `"KhachHang"` | `maLoaiNguoiDung` |
| Enum loại ghế | `"Vip"` (chỉ viết hoa chữ V) hoặc `"Thuong"` | `loaiGhe` |

Vi phạm các quy ước này sẽ khiến FE lỗi/trắng trang mà không cần sửa code FE để phát hiện ra —
luôn kiểm tra lại theo bảng này trước khi coi 1 endpoint là "xong".

## 3. Audit trạng thái hiện tại — làm đầu tiên

1. `git clone` repo BE, đọc `package.json`, cấu trúc thư mục, xem đã có những gì.
2. `git fetch --all && git branch -r` — liệt kê toàn bộ nhánh đang có.
3. Với từng nhánh, `git log --oneline` để hiểu ai đã làm tới đâu.
4. Kiểm tra đã có `.env.example`, đã có kết nối Mongoose (`mongoose.connect`) trong code chưa —
   theo giả định ban đầu, **MongoDB thật sự chưa từng được kết nối/test**, nên nhiều khả năng code
   viết ra chưa từng chạy được.
5. Ghi lại kết quả audit thành checklist thực tế (những gì đã có / thiếu) trước khi làm tiếp — đừng
   giả định lại từ đầu.

## 4. Phase 1 — Kết nối MongoDB Atlas (cả nhóm dùng chung 1 cluster)

Nếu Thịnh chưa có connection string, hướng dẫn theo các bước sau (thực hiện thủ công trên trình
duyệt, Claude không thể tự làm thay):

1. Vào https://www.mongodb.com/cloud/atlas/register, tạo tài khoản (có thể dùng Google).
2. Tạo **Free Cluster** (M0), chọn region gần VN (Singapore).
3. **Database Access** → tạo 1 database user (username/password) dùng chung cho cả nhóm test, hoặc
   mỗi người 1 user riêng nếu muốn tách quyền.
4. **Network Access** → thêm IP `0.0.0.0/0` (Allow access from anywhere) để cả nhóm nhiều mạng khác
   nhau đều kết nối được — lưu ý đây là cấu hình cho môi trường học tập, không dùng cho production
   thật.
5. **Connect → Drivers → Node.js** → copy connection string dạng:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<tenDB>?retryWrites=true&w=majority
   ```
6. Đặt `<tenDB>` cụ thể, ví dụ `datvexemphim`, để không bị tạo nhầm vào DB mặc định `test`.

Sau khi có connection string:

- [ ] Thêm vào `.env`: `MONGODB_URI=...`
- [ ] Trong file kết nối DB (`config/db.js` hoặc tương đương), dùng `mongoose.connect(process.env.MONGODB_URI)`.
- [ ] Chạy thử `npm run dev`, xác nhận log hiện "Connected to MongoDB" (hoặc tương đương), không có
      lỗi timeout/auth.
- [ ] Vào Atlas → **Browse Collections** để xác nhận DB `datvexemphim` đã xuất hiện sau khi có dữ
      liệu đầu tiên được ghi vào.

## 5. Schema Mongoose hiện tại (cập nhật theo code thật trong `backend/models/`)

> **Cập nhật 2026-08-21.** Mục 5-10 bên dưới KHÔNG còn là "kế hoạch cần làm" như bản gốc nữa — dự
> án đã đi xa hơn phạm vi note gốc rất nhiều (đã có admin panel đầy đủ, upload ảnh Cloudinary, xử lý
> timezone, cập nhật hồ sơ cá nhân...). Nội dung dưới đây là **tài liệu tham chiếu phản ánh đúng
> code hiện có**, dùng để tra cứu field/endpoint thật thay vì bản thiết kế ban đầu. Chỗ nào field
> khác với bản gốc phía trên đều được ghi chú rõ **(MỚI)** hoặc **(ĐÃ ĐỔI)**.

Toàn bộ model nằm ở `backend/models/*.js`, có **9 collection** (bản gốc chỉ có 8 — thiếu `banners`).

### 5.1 `users` (`User.js`)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `taiKhoan` | String | có, unique, trim | định danh đăng nhập |
| `matKhau` | String | có | hash bcrypt qua `pre("save")` hook, không bao giờ trả về (`.select("-matKhau")`) |
| `hoTen` | String | có | |
| `email` | String | có, unique, trim, lowercase | |
| `soDT` | String | không | |
| `maLoaiNguoiDung` | String enum | có | `"QuanTri"` \| `"KhachHang"`, default `"KhachHang"` |
| `ngayTao` | Date | auto | `timestamps: { createdAt: "ngayTao", updatedAt: false }` |

**(MỚI)** Model có method `comparePassword(candidatePassword)` (dùng cho đăng nhập và đổi mật khẩu).
**(MỚI)** Đã có đủ luồng tự-cập-nhật hồ sơ: `capNhatThongTinTaiKhoan` (chỉ cho sửa `hoTen`/`email`/
`soDT`, check trùng email) và `doiMatKhau` (verify mật khẩu cũ qua `comparePassword` trước khi đổi).

### 5.2 `movies` (`movies.js`) — **(ĐÃ ĐỔI)** mở rộng nhiều so với bản gốc (9 field → 15 field)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maPhim` |
| `tenPhim` | String | có, trim | |
| `trailer` | String | không, default `""` | link Youtube |
| `moTa` | String | không, default `""` | |
| `ngayKhoiChieu` | Date | có | trả **ISO 8601** khi GET — xem mục 6.4 về timezone |
| `dangChieu` | Boolean | không, default `false` | |
| `sapChieu` | Boolean | không, default `false` | |
| `hot` | Boolean | không, default `false` | |
| `danhGia` | Number | không, default `0` | `min 0, max 10` |
| `hinhAnh` | String | có | URL Cloudinary đầy đủ (xem mục 6.5) |
| `theLoai` | String | không, default `""` | **(MỚI)** danh sách thể loại, phân tách bằng dấu phẩy (vd `"Hành động, Viễn tưởng"`) |
| `daoDien` | String | không, default `""` | **(MỚI)** |
| `dienVien` | String | không, default `""` | **(MỚI)** |
| `thoiLuong` | Number | không, default `0` | **(MỚI)** phút |
| `doTuoi` | String | không, default `""` | **(MỚI)** vd `"T18"` |
| `dinhDang` | String | không, default `""` | **(MỚI)** định dạng chiếu, phân tách dấu phẩy (vd `"2D, 3D, IMAX"`); FE parse ra badge SVG qua `frontend/src/utils/formatBadges.js` (khớp theo tên đã chuẩn hoá hoa/thường + bỏ khoảng trắng, hỗ trợ `2D`/`3D`/`4DX`/`IMAX`/`SCREENX`) |

`timestamps: true` (đầy đủ `createdAt`/`updatedAt`, khác với `users` chỉ có `ngayTao`).

### 5.3 `cinemaSystems` (`cinemaSystems.js`) — **(ĐÃ ĐỔI 2026-08-21)** thêm 3 field cho trang "Rạp"

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maHeThongRap` |
| `tenHeThongRap` | String | có, trim | vd "CGV", "Lotte Cinema" |
| `logo` | String | có | **(ĐÃ ĐỔI)** giờ luôn là URL Cloudinary (`datvexemphim/cinema-systems/...`) thay vì ảnh lưu local — dùng làm icon nhỏ (Navbar, bảng admin, card danh sách) |
| `gioiThieu` | String | không, default `""` | **(MỚI)** mô tả giới thiệu hệ thống rạp |
| `namThanhLap` | Number | không, default `null` | **(MỚI)** |
| `danhSachHinhAnh` | `[String]` | không, default `[]` | **(MỚI)** gallery nhiều ảnh (khác với `logo`), URL Cloudinary |

### 5.4 `cinemaComplexes` (`cinemaComplexes.js`) — **(ĐÃ ĐỔI 2026-08-21)** thêm gallery nhiều ảnh

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maCumRap` |
| `tenCumRap` | String | có, trim | |
| `diaChi` | String | có, trim | dùng trực tiếp làm query cho Google Maps embed (mục 6.2) |
| `hinhAnh` | String | không, default `""` | URL Cloudinary (`cinema-complexes/...`) nếu có — ảnh thumbnail chính |
| `danhSachHinhAnh` | `[String]` | không, default `[]` | **(MỚI)** gallery nhiều ảnh, URL Cloudinary |
| `maHeThongRap` | ObjectId (ref `CinemaSystem`) | có | |

### 5.5 `rooms` (`rooms.js`) — field không đổi, nhưng có thêm hành vi mới

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maRap` |
| `tenRap` | String | có, trim | vd "Phòng 01" |
| `maCumRap` | ObjectId (ref `CinemaComplex`) | có | |
| `soLuongGhe` | Number | có, `min 1` | |

**(MỚI)** Mỗi lần `ThemRap`/`CapNhatRap` thay đổi `soLuongGhe`, backend tự gọi
`syncSeatsForRoom()` (`utils/seedSeatsData.js`) để **upsert** lại đúng số ghế trong `seats` theo quy
tắc 10 ghế/hàng, hàng cuối luôn `"Vip"` — hàm này chỉ thêm/cập nhật, **không bao giờ xoá** ghế cũ để
tránh phá tham chiếu `maGhe` trong các booking đã tạo trước đó.

### 5.6 `showtimes` (`showtimes.js`) — field không đổi, nhưng **quy ước timezone đã đổi hẳn**

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maLichChieu` |
| `maPhim` | ObjectId (ref `Movie`) | có | |
| `maRap` | ObjectId (ref `Room`) | có | |
| `ngayChieuGioChieu` | Date | có | lưu **UTC thật** trong DB — xem mục 6.4 |
| `giaVe` | Number | có, `min 0` | giá mặc định, bị override bởi `giaVe` riêng của từng `seats` |

### 5.7 `seats` (`seats.js`) — field không đổi, có thêm unique index

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maGhe` |
| `tenGhe` | String | có, trim | vd "A1" |
| `loaiGhe` | String enum | có | chỉ `"Thuong"` hoặc `"Vip"` |
| `maRap` | ObjectId (ref `Room`) | có | |
| `giaVe` | Number | có, `min 0` | override theo loại ghế |

**(MỚI)** Unique compound index `{ maRap: 1, tenGhe: 1 }` — chặn trùng tên ghế trong cùng 1 phòng,
đồng thời là điều kiện `filter` mà `syncSeatsForRoom()` dùng để upsert.

> ⚠️ `daDat` vẫn **không phải field lưu sẵn** — tính động mỗi lần gọi `LayDanhSachPhongVe` bằng cách
> đối chiếu `bookings` (giữ nguyên từ bản gốc, không đổi).

### 5.8 `bookings` (`bookings.js`) — field không đổi, nhưng response giờ trả thêm `tenGhe`

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maVe` |
| `taiKhoan` | ObjectId (ref `User`) | có | |
| `maLichChieu` | ObjectId (ref `Showtime`) | có | |
| `danhSachGhe` | `Array<{maGhe, giaVe}>` (subdoc `_id: false`) | có, không rỗng | snapshot giá tại thời điểm đặt — **chỉ lưu `maGhe` + `giaVe`, không lưu `tenGhe`** |
| `tongTien` | Number | có, `min 0` | = tổng `giaVe` các ghế |
| `trangThai` | String enum | có | `"pending"` \| `"paid"` \| `"cancelled"`, default `"pending"` |
| `ngayDat` | Date | auto | `timestamps: { createdAt: "ngayDat", updatedAt: false }` |

**(MỚI)** Vì DB không lưu sẵn `tenGhe` trong `danhSachGhe`, `BookingService.js` giờ luôn
`.populate("danhSachGhe.maGhe")` khi lấy lịch sử/danh sách vé đã bán, để `bookingMapper.js` (hàm
`mapBookingHistory`) có thể trả thêm `tenGhe` (vd `"A2"`) cho FE hiển thị thay vì chỉ đếm số ghế —
FE (`Profile.jsx`, `BookingManager.jsx`) hiện hiển thị đúng tên ghế đã đặt.

### 5.9 `banners` (`banners.js`) — **(MỚI HOÀN TOÀN, chưa từng có trong bản note gốc)**

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maBanner` |
| `hinhAnh` | String | có | URL Cloudinary, tự resize/crop `2048x877` (`crop: "fill", gravity: "auto"`) để đồng bộ tỉ lệ mọi banner |
| `thuTu` | Number | không, default `0` | thứ tự hiển thị trên carousel trang chủ |

`timestamps: true`.

Checklist Phase 2 (đã hoàn tất — giữ lại để đối chiếu):

- [x] Cả 9 collection (kể cả `banners` mới) đã có model Mongoose, đúng tên field.
- [x] Toàn bộ `ref` giữa các model trỏ đúng tên model — đã dùng suốt các phiên làm việc, chưa phát
      hiện lỗi populate trả `null` âm thầm.
- [x] Index `unique` cho `taiKhoan`, `email` trong `users`; thêm cả `{maRap, tenGhe}` trong `seats`.

## 6. API endpoints hiện tại (cập nhật theo code thật trong `backend/routes/` + `controllers/`)

> Toàn bộ endpoint dưới đây đã tồn tại và hoạt động — không còn đánh dấu **MỚI** như bản gốc (vì tất
> cả đều đã "mới" xong từ lâu). Response wrapper vẫn giữ đúng `{statusCode, message, content}`.

### 6.1 Auth & User — mount `/api/QuanLyNguoiDung` (gộp `auth.routes.js` + `users.routes.js`)

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| POST | `/DangKy` | không | body `{taiKhoan, matKhau, hoTen, email, soDT}` |
| POST | `/DangNhap` | không | body `{taiKhoan, matKhau}`; `content` có `accessToken` (JWT, hết hạn sau **7 ngày**) + `maLoaiNguoiDung` |
| GET | `/ThongTinTaiKhoan` | token | trả thông tin tài khoản đang đăng nhập (không có `matKhau`) |
| PUT | `/ThongTinTaiKhoan` | token | **(MỚI)** tự cập nhật hồ sơ, chỉ nhận `hoTen`/`email`/`soDT`, trả `409` nếu email đã bị tài khoản khác dùng |
| PUT | `/DoiMatKhau` | token | **(MỚI)** body `{matKhauCu, matKhauMoi, xacNhanMatKhau}` |
| POST | `/ThemNguoiDung` | admin | tạo tài khoản (kể cả tạo admin khác) |
| GET | `/DanhSachNguoiDung` | admin | |
| PUT | `/CapNhatNguoiDung` | admin | `?TaiKhoan=xx`, sửa tài khoản người khác |
| DELETE | `/XoaNguoiDung` | admin | `?TaiKhoan=xx` |

⚠️ `JWT_SECRET` có fallback cứng `"dev-secret-key"` trong code nếu biến môi trường không được set —
**bắt buộc phải set `JWT_SECRET` thật trong `.env` production** (Render), không được để rơi vào
fallback này.

### 6.2 Catalog

**Phim** — mount `/api/QuanLyPhim`:

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| GET | `/LayDanhSachPhim` | không | |
| GET | `/LayThongTinPhim?MaPhim=` | không | |
| POST | `/ThemPhimUploadHinh` (multipart, field `"File"`) | admin | bắt buộc `tenPhim`, `ngayKhoiChieu`, `hinhAnh` |
| POST/PUT | `/CapNhatPhimUpload` (multipart, field `"File"`) | admin | `maPhim` nằm **trong body**, không phải query — route đăng ký cả 2 method để tương thích |
| DELETE | `/XoaPhim?MaPhim=` | admin | chặn xoá nếu phim đang có lịch chiếu |

**Banner** — mount `/api/QuanLyBanner`: `GET LayDanhSachBanner` (không cần token), `POST ThemBanner`
/ `PUT CapNhatBanner` (multipart field `"File"`) / `DELETE XoaBanner?MaBanner=` (đều cần admin).

**Hệ thống rạp** — mount `/api/QuanLyHeThongRap` (CRUD đầy đủ cho admin, dùng bởi trang quản trị):
`GET LayThongTinHeThongRap` (có `?MaHeThongRap=` để lấy 1 hệ thống, không truyền thì trả danh sách),
`POST`/`PUT` (multipart, field `"File"` cho `logo` + field `"Gallery"` cho `danhSachHinhAnh`, xem chi
tiết upload nhiều ảnh ở mục 6.5), `DELETE ...?MaHeThongRap=` (chặn xoá nếu còn cụm rạp con).

**Cụm rạp** — mount `/api/QuanLyCumRap`: `GET LayDanhSachCumRap` (lọc theo `?MaHeThongRap=`),
`GET LayThongTinCumRap?MaCumRap=`, `POST`/`PUT ThemCumRap`/`CapNhatCumRap` (multipart, field `"File"`
cho `hinhAnh` + field `"Gallery"` cho `danhSachHinhAnh`), `DELETE XoaCumRap?MaCumRap=` (chặn xoá nếu
còn phòng chiếu con).

**Phòng chiếu** — mount `/api/QuanLyRap`: `GET LayDanhSachRap` (lọc `?MaCumRap=`),
`GET LayThongTinRap?MaRap=`, `POST ThemRap` / `PUT CapNhatRap` (body JSON thường, không multipart),
`DELETE XoaRap?MaRap=` (chặn xoá nếu còn lịch chiếu).

**Lịch chiếu** — mount `/api/QuanLyLichChieu`: `GET LayDanhSachLichChieu` (lọc `?MaPhim=`),
`GET LayThongTinLichChieu?MaLichChieu=`, `POST ThemLichChieu` / `PUT CapNhatLichChieu`,
`DELETE XoaLichChieu?MaLichChieu=` (chặn xoá nếu còn vé chưa huỷ ứng với lịch chiếu đó).

`GET .../LayThongTinLichChieuPhim?MaPhim=xx` — endpoint phức tạp nhất, `content` vẫn đúng cấu trúc
lồng 3 cấp như bản gốc:
```json
{
  "maPhim": "...", "tenPhim": "...",
  "heThongRapChieu": [
    {
      "maHeThongRap": "...", "tenHeThongRap": "...", "logo": "...",
      "cumRapChieu": [
        {
          "maCumRap": "...", "tenCumRap": "...", "diaChi": "...", "hinhAnh": "...",
          "lichChieuPhim": [
            {
              "maLichChieu": "...", "maRap": "...", "tenRap": "...",
              "ngayChieuGioChieu": "2026-07-10T12:30:00.000Z",
              "giaVe": 75000, "giaVeMin": 75000, "giaVeMax": 95000
            }
          ]
        }
      ]
    }
  ]
}
```
**(MỚI)** so với bản gốc: mỗi suất chiếu giờ có thêm `giaVeMin`/`giaVeMax` (khoảng giá thật của ghế
trong phòng, không chỉ `giaVe` mặc định) — FE Detail page dùng để hiển thị "70k ~ 90k".

> ⚠️ **Trùng lặp đã biết, chưa dọn:** `LayThongTinLichChieuPhim` tồn tại ở **cả 2 nơi** —
> `roomsController.js` (mount `/api/QuanLyRap/LayThongTinLichChieuPhim`) và
> `showtimesController.js` (mount `/api/QuanLyLichChieu/LayThongTinLichChieuPhim`) — 2 implementation
> riêng biệt nhưng logic giống hệt nhau (đều gọi `buildShowtimeTreeByMovie`). **FE hiện chỉ gọi bản
> dưới `/api/QuanLyRap`** (xem `frontend/src/redux/reducers/CinemaSystemReducer.jsx`) — bản dưới
> `/api/QuanLyLichChieu` đang là dead code, chưa bị xoá vì chưa xác nhận có FE nào khác cần. Tương tự
> `LayThongTinHeThongRap` cũng có 2 bản (`roomsController.js` mount ở `/api/QuanLyRap`, dùng bởi
> trang Detail public; `cinemaSystemsController.js` mount ở `/api/QuanLyHeThongRap`, dùng bởi trang
> Admin) — trường hợp này KHÔNG phải trùng thừa, vì bản Admin hỗ trợ thêm `?MaHeThongRap=` để lấy 1
> hệ thống, cần giữ cả 2.

### 6.3 Booking & Ghế — mount `/api/QuanLyDatVe`

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| GET | `/LayDanhSachPhongVe?MaLichChieu=` | không | xem cấu trúc response bên dưới |
| POST | `/DatVe` | token | body `{maLichChieu, danhSachGhe: [maGhe1, maGhe2, ...]}` (mảng ObjectId, không phải tên ghế); trả `409` nếu ghế đã bị đặt, `400` nếu ghế không thuộc đúng phòng của lịch chiếu |
| GET | `/LayLichSuDatVe` | token | lịch sử đặt vé của chính user đang đăng nhập |
| PUT | `/HuyVe?MaVe=` | token | chỉ huỷ được vé của chính mình, trả `403` nếu không phải chủ vé, `400` nếu đã huỷ trước đó |
| GET | `/LayDanhSachVeDaBan` | admin | lọc theo `?MaPhim=`, `?TuNgay=`, `?DenNgay=`; trả kèm `taiKhoan`/`hoTenKhachHang`/`emailKhachHang` |
| GET | `/ThongKeDoanhThu` | admin | lọc theo `?TuNgay=`, `?DenNgay=`; trả `{tongDoanhThu, soVe}` (không tính vé đã huỷ) |

`LayDanhSachPhongVe` — `content`:
```json
{
  "thongTinPhim": {
    "tenPhim": "...", "tenCumRap": "...", "tenRap": "...", "diaChi": "...",
    "ngayChieu": "10/07/2026", "gioChieu": "19:30"
  },
  "danhSachGhe": [
    { "maGhe": "...", "tenGhe": "A1", "loaiGhe": "Vip", "daDat": false, "giaVe": 95000 }
  ]
}
```
`LayLichSuDatVe` / `LayDanhSachVeDaBan` — mỗi phần tử **(MỚI)** có `danhSachGhe` dạng
`[{maGhe, tenGhe, giaVe}]` (đã populate `tenGhe`, xem mục 5.8) thay vì chỉ `{maGhe, giaVe}`.

### 6.4 Quy ước timezone — **(MỚI, sửa 1 bug hiển thị lệch giờ nghiêm trọng)**

Việt Nam không có giờ mùa hè (DST) nên lệch UTC luôn cố định `+7`. Quy ước áp dụng xuyên suốt:

- **Backend ghi (parse)** — `backend/utils/catalogParsers.js` (`parseDateInput`): chuỗi datetime
  **không kèm timezone** (vd từ `<input type="datetime-local">` hoặc `dd/MM/yyyy`) được hiểu là giờ
  **Việt Nam**, trừ đi 7 tiếng rồi mới lưu vào Mongo dưới dạng UTC thật. Chuỗi ISO có hậu tố `Z` (đã
  là UTC tường minh, vd `Date.toISOString()`) thì giữ nguyên, không cộng/trừ gì thêm.
- **Backend đọc (format)** — nơi duy nhất backend tự format ngày/giờ thành chuỗi hiển thị sẵn là
  `mapPhongVe` (`backend/utils/bookingMapper.js`, dùng cho `LayDanhSachPhongVe`): cộng `+7` giờ vào
  giá trị UTC trước khi `.format("DD/MM/YYYY")`/`.format("HH:mm")`. Các endpoint khác (catalog,
  showtimes, booking history...) đều trả **chuỗi ISO UTC thô** qua `toIsoString()` và để **client tự
  format** — không được tự ý thêm format string ở backend cho các endpoint này.
- **Frontend đọc (format)** — `frontend/src/utils/vietnamTime.js`: `formatVietnamDate`/
  `formatVietnamTime`/`formatVietnamDateTime` dùng `Intl.DateTimeFormat` với
  `timeZone: "Asia/Ho_Chi_Minh"` tường minh (không dựa vào `toLocaleString()` mặc định — phụ thuộc
  timezone máy người xem, không đáng tin). Áp dụng ở mọi nơi hiển thị `ngayChieuGioChieu`/
  `ngayKhoiChieu`/`ngayDat`: `ShowTimeByID.jsx`, `FilmInfo.jsx`, `Profile.jsx`,
  `ShowtimeManager.jsx`, `BookingManager.jsx`.
- **Frontend ghi (form admin)** — `toVietnamDatetimeLocalValue()` trong cùng file, dùng để đổ giá
  trị đúng giờ Việt Nam vào `<input type="datetime-local">` khi sửa lịch chiếu (`FormShowtime.jsx`)
  — trước đây bug do `.slice(0, 16)` chuỗi ISO UTC thô, hiện đã sửa.

**Nguyên nhân gốc đã fix:** server chạy trên Render mặc định ở timezone UTC (không phải giờ Việt
Nam), nên trước khi có util này, code dùng `dayjs().format()` trần sẽ format theo giờ UTC của server
thay vì giờ VN, gây lệch hiển thị 7 tiếng cho người dùng thật.

### 6.5 Upload ảnh — **(ĐÃ ĐỔI hẳn so với giả định ban đầu)**

Bản note gốc giả định lưu ảnh trên đĩa local server. Thực tế hiện tại dùng **Cloudinary**
(`multer-storage-cloudinary`, `backend/middlewares/multer.js`):

- Cần 3 biến môi trường: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Mỗi loại ảnh có 1 uploader riêng, lưu vào folder Cloudinary tương ứng:
  `datvexemphim/movies`, `datvexemphim/cinema-systems`, `datvexemphim/cinema-complexes`,
  `datvexemphim/banners`.
  - Riêng banner: tự resize/crop cứng về `2048x877` (`crop: "fill", gravity: "auto"`) ngay lúc
    upload để đồng bộ tỉ lệ carousel trang chủ, bất kể ảnh gốc kích thước gì.
- Field tên `"File"` trong multipart giữ nguyên đúng quy ước cũ (mục 2).
- `req.file.path` sau khi multer xử lý chính là **URL Cloudinary đầy đủ** (`https://res.cloudinary.com/...`),
  gán thẳng vào field `hinhAnh`/`logo` — không cần nối domain server như ảnh local.
- ⚠️ Gói `cloudinary` phải giữ ở `^2.10.1` — bản `1.41.3` từng bị hạ nhầm có lỗ hổng bảo mật đã biết
  (GHSA-g4mf-96x5-5m2c), đã revert lại và không được hạ version lần nữa.

**(MỚI 2026-08-21) Upload nhiều ảnh (gallery) cho hệ thống rạp/cụm rạp:** route
`ThemHeThongRap`/`CapNhatHeThongRap`/`ThemCumRap`/`CapNhatCumRap` dùng
`uploader.fields([{name:"File",maxCount:1},{name:"Gallery",maxCount:8}])` thay vì `.single("File")`
— cùng 1 request multipart vừa gửi ảnh đại diện (`File`) vừa gửi tối đa 8 ảnh gallery (`Gallery`),
tất cả cùng lưu vào chung 1 folder Cloudinary như ảnh đại diện. Khi cập nhật, muốn **xoá bớt** ảnh
gallery cũ thì FE gửi kèm field `danhSachHinhAnhGiuLai` (chuỗi JSON mảng URL muốn giữ lại) — backend
lấy `keptImages` từ đó rồi nối thêm ảnh mới upload; nếu không gửi field này thì mặc định giữ nguyên
gallery cũ và chỉ nối thêm ảnh mới (không xoá gì). FE (`CinemaManager.jsx`) hiện thực UX này bằng nút
"×" trên từng ảnh cũ để bỏ khỏi danh sách giữ lại trước khi bấm Cập nhật.

### 6.6 Trang công khai "Rạp" và "Tin tức" — **(MỚI 2026-08-21)**

- `/rap` (`frontend/src/Pages/Cinema/CinemaListPage.jsx`): danh sách card hệ thống rạp — ảnh preview
  (ưu tiên `danhSachHinhAnh[0]`, fallback `logo`), tên, `gioiThieu` (rút gọn), `namThanhLap`, và số
  cụm rạp (tính client-side bằng cách đếm `complexes` cùng `maHeThongRap`, không cần endpoint riêng).
  Click 1 card → `/rap/:maHeThongRap`.
- `/rap/:maHeThongRap` (`CinemaSystemDetailPage.jsx`, **MỚI**): thông tin chi tiết 1 hệ thống rạp +
  danh sách cụm rạp thuộc hệ thống đó (gọi `LayDanhSachCumRapAPI(maHeThongRap)` với filter
  `?MaHeThongRap=`). Mỗi cụm rạp hiển thị gallery ảnh riêng, tên, địa chỉ, và **1 khung Google Maps
  nhúng riêng theo địa chỉ** — dùng iframe `https://www.google.com/maps?q=<địa chỉ>&output=embed`,
  **không cần Google Maps API key** (khác với phương án 1 bản đồ chung nhiều ghim, vốn cần
  JavaScript API key). Component gallery dùng chung `ImageGallery.jsx` (ảnh lớn + dải thumbnail).
- `/tin-tuc` (`frontend/src/Pages/News/NewsPage.jsx`, **MỚI**): danh sách tin tức — **cố ý là mảng
  tĩnh hard-code trong component**, không có collection/API riêng (quyết định có chủ đích: chưa có
  link/nội dung thật, khi có thì sửa trực tiếp mảng `TIN_TUC` trong file rồi deploy lại — không cần
  sửa backend). Nếu sau này muốn tự quản lý qua admin (thêm/sửa/xoá tin không cần sửa code), cần làm
  thêm 1 collection `TinTuc` + CRUD giống `Banner` (mục 6.2), hiện **chưa làm**.
- Navbar mục "Tin tức" trước đây là link chết (`<a href="#">`), đã nối vào route `/tin-tuc` thật.
- `FormShowtime.jsx` (thêm/sửa lịch chiếu): trước đây chỉ có 1 dropdown "Phòng chiếu" liệt kê phẳng
  toàn bộ phòng, không phân biệt thuộc cụm rạp/hệ thống nào. Đã đổi thành 3 dropdown lồng nhau
  **Hệ thống rạp → Cụm rạp → Phòng chiếu**, mỗi cấp lọc theo cấp trên (danh sách tải hết 1 lần, lọc
  client-side — cùng cách tiếp cận với `CinemaManager.jsx`). Khi sửa 1 lịch chiếu có sẵn, tự suy
  ngược từ `maRap` đã lưu ra đúng cụm rạp + hệ thống rạp để đổ sẵn cả 3 dropdown.

## 7. Seed dữ liệu mẫu — **(ĐÃ ĐỔI cách làm so với kế hoạch gốc)**

Kế hoạch gốc đề xuất viết `seed.js` chạy tay 1 lần. Thực tế hiện tại: seed chạy **tự động mỗi lần
backend khởi động** (`bootstrap()` trong `backend/index.js`), qua 3 hàm:

- `seedCatalogData()` (`utils/seedCatalogData.js`) — phim, hệ thống rạp, cụm rạp, phòng chiếu, lịch
  chiếu mẫu.
- `seedSeats(rooms)` (`utils/seedSeatsData.js`) — sinh ghế cho từng phòng vừa seed (10 ghế/hàng,
  hàng cuối `"Vip"`, giá mặc định `75.000đ` thường / `95.000đ` Vip).
- `seedUsers()` (`utils/seedUsersData.js`) — 1 admin (`admin` / `Admin@123`) + 1 khách hàng mẫu
  (`khachhang1` / `KhachHang@123`).

Cả 3 hàm đều **idempotent** — tự kiểm tra `countDocuments() > 0` trước khi tạo, chỉ seed khi collection
đang trống, không tạo trùng dữ liệu ở những lần khởi động sau. Tắt seed bằng biến môi trường
`SEED_CATALOG_ON_START=false`.

⚠️ **Lưu ý quan trọng khi thao tác trên DB Atlas chung của nhóm:** bảng tài khoản mẫu ở trên chỉ
đúng nếu collection `users` đang **trống** lúc backend khởi động lần đầu. DB Atlas dùng chung hiện
tại đã có dữ liệu thật từ lâu, nên `seedUsers()` không còn chạy lại — xác nhận thực tế lúc kiểm thử
(2026-08-21): đăng nhập `admin`/`Admin@123` trả về `401 Mật khẩu không chính xác`, tức tài khoản
`admin` thật đã bị đổi mật khẩu khác từ trước (không xác định là ai/khi nào). **Không dùng bảng seed
này để suy đoán mật khẩu admin hiện tại** — cần hỏi trực tiếp người đang giữ tài khoản.

## 8. Merge nhánh của 3 người — **ĐÃ HOÀN TẤT, không còn là việc cần làm**

Repo hiện chỉ còn 1 nhánh `main` duy nhất trên GitHub (`https://github.com/ThinhDang93/DoAn_IE213.git`),
không còn 3 nhánh `feature/*` tách riêng như kế hoạch gốc — cả nhóm đã merge xong và tiếp tục push
thẳng vào `main`. Quy trình vẫn cần giữ khi làm việc tiếp:

- Luôn `git fetch origin` rồi kiểm tra `git status -sb` trước khi commit/push, vì các thành viên
  khác có thể đã push code mới lên `main` trong lúc mình đang làm.
- Ưu tiên fast-forward merge khi có commit mới từ nhánh `origin/main`.
- Không còn tình huống conflict route mount 3 dòng như bản gốc mô tả — `backend/index.js` hiện là
  1 file duy nhất, đã ổn định.

## 9. Test end-to-end — checklist cập nhật theo tính năng thực tế hiện có

Bản gốc chỉ có 5 bước (đăng ký → đăng nhập → thêm phim/lịch chiếu → xem ghế → đặt vé). Danh sách đầy
đủ hơn, phản ánh đúng phạm vi hiện tại của sản phẩm:

**Luồng khách hàng:**
1. `POST DangKy` → `POST DangNhap` → nhận `accessToken`.
2. Trang chủ: lọc phim qua 2 dropdown ("Chọn thể loại phim" + "Trạng thái chiếu") → danh sách phim
   lọc đúng; mỗi thẻ phim hiển thị đúng số sao/điểm theo `danhGia` thật và badge định dạng theo
   `dinhDang`.
3. Trang Detail: xem đủ thông tin phim (đạo diễn/diễn viên/định dạng dạng badge SVG/độ tuổi/thời
   lượng), xem trailer popup, chọn lịch chiếu theo từng cụm rạp/ngày — giờ chiếu hiển thị đúng giờ
   Việt Nam.
4. Trang Booking: chọn ghế, bấm "Đặt vé" → thành công, ghế chuyển `daDat: true`; đặt trùng ghế đã có
   người đặt → báo lỗi, không cho đặt trùng.
5. Trang Profile: xem lại lịch sử đặt vé — hiển thị đúng **tên ghế** đã đặt (không phải số lượng),
   giờ chiếu đúng giờ VN; huỷ vé thành công đổi đúng trạng thái. Bấm "Cập nhật thông tin cá nhân" →
   sửa họ tên/email/SĐT → lưu thành công, tên hiển thị ở Navbar cập nhật ngay không cần tải lại trang.

**Luồng admin** (đăng nhập tài khoản `maLoaiNguoiDung: "QuanTri"`):
6. `/admin/film` — thêm/sửa/xoá phim kèm upload ảnh Cloudinary, các field mới (đạo diễn/diễn viên/
   định dạng/độ tuổi/thời lượng) lưu và hiển thị lại đúng.
7. `/admin/user` — xem danh sách người dùng, thêm/sửa/xoá tài khoản.
8. `/admin/cinema` — quản lý hệ thống rạp/cụm rạp/phòng chiếu, upload logo/ảnh.
9. `/admin/showtime` — thêm/sửa lịch chiếu; khi sửa, ô ngày giờ phải đổ đúng giờ Việt Nam đã lưu
   trước đó (không lệch giờ khi mở form sửa).
10. `/admin/booking` — xem danh sách vé đã bán (hiển thị đúng tên ghế), thống kê doanh thu theo
    khoảng ngày.
11. `/admin/banner` — thêm/sửa/xoá banner trang chủ, xác nhận ảnh tự crop đúng tỉ lệ carousel.

Nếu có bước nào fail, ưu tiên sửa trực tiếp trên `main` sau khi `git fetch` để chắc chắn không đè
code của thành viên khác (không còn nhánh `integration-test` riêng như bản gốc).

## 10. Tổng kết trạng thái dự án (tính đến 2026-08-21)

So với phạm vi note gốc (chỉ dự kiến hoàn thiện Backend + Database cơ bản), dự án hiện đã vượt xa:

- **Đã xong và vượt phạm vi gốc:** toàn bộ 8 collection gốc + `banners` mới; toàn bộ endpoint Auth/
  Catalog/Booking gốc + các API admin CRUD đầy đủ cho mọi collection; upload ảnh thật qua Cloudinary
  (gốc chỉ giả định lưu local); trang quản trị (admin panel) hoàn chỉnh với phân quyền theo
  `maLoaiNguoiDung`; tự cập nhật hồ sơ cá nhân + đổi mật khẩu; sửa triệt để bug lệch giờ hiển thị
  xuyên suốt hệ thống (mục 6.4); hiển thị tên ghế thay vì số lượng ghế trong lịch sử đặt vé.
- **Nợ kỹ thuật đã biết, chưa xử lý:** endpoint `LayThongTinLichChieuPhim` bị trùng lặp code ở 2
  route khác nhau (mục 6.2) — an toàn vì FE chỉ gọi 1 bản, nhưng nên dọn nếu có thời gian.
- **Chưa làm (nằm ngoài yêu cầu đã nhận):** UI đổi mật khẩu ở FE (backend đã sẵn sàng qua
  `PUT /DoiMatKhau`, chỉ chưa có form phía Profile vì chưa được yêu cầu); Postman collection hoàn
  chỉnh; viết test tự động (hiện toàn bộ kiểm thử đều làm thủ công qua Playwright/curl mỗi lần có
  thay đổi, chưa có test suite lưu lại trong repo).
- **Đề xuất bước tiếp theo nếu còn thời gian:** dọn endpoint trùng lặp ở mục 6.2; viết Postman
  collection hoặc test tự động cho các luồng chính (đặt vé, huỷ vé, admin CRUD) để không phải test
  tay lại từ đầu mỗi lần có thay đổi; cân nhắc thêm UI đổi mật khẩu nếu người dùng có nhu cầu.

## 11. Bổ sung cho báo cáo (2026-08-21)

> Toàn bộ nội dung mục này được chạy thử **thật** (không suy đoán) vào ngày kiểm thử, dùng dữ liệu
> đang có sẵn trong MongoDB Atlas dùng chung của nhóm. Test ghi/xoá dùng tài khoản admin tạm thời
> (`__temp_test_admin__`) và các bản ghi test tự tạo — **tất cả đã được xoá sạch ngay sau khi test**,
> không để lại rác trong DB chung. Các endpoint GET (đọc) dùng thẳng dữ liệu thật đang có, không tạo
> thêm gì.

### 11.1 Ví dụ request/response thật cho từng endpoint — Catalog (mục 6.2) & Booking (mục 6.3)

Test chạy qua backend dev local (`http://localhost:8080`) — **kết nối cùng 1 cluster MongoDB Atlas**
với backend production trên Render (xem mục 11.2), nên dữ liệu và hành vi hoàn toàn giống hệt việc
gọi trực tiếp vào production. Định dạng giống mục 6.1 (Auth & User): mỗi endpoint có ví dụ request
thật + response thật, rút gọn phần `content` dài (mảng nhiều phần tử) chỉ giữ 1-2 phần tử đại diện.

#### Phim — `/api/QuanLyPhim`

**GET `/LayThongTinPhim?MaPhim=6a82cd53684ff0a3456d9d22`**
```json
{
    "statusCode": 200,
    "message": "Lay thong tin phim thanh cong",
    "content": {
        "maPhim": "6a82cd53684ff0a3456d9d22",
        "tenPhim": "Zero Hour",
        "trailer": "https://www.youtube.com/watch?v=devseed013",
        "moTa": "Adventure movie directed by Olivia Hayes...",
        "ngayKhoiChieu": "2026-07-18T17:00:00.000Z",
        "dangChieu": true,
        "sapChieu": false,
        "hot": false,
        "danhGia": 8,
        "hinhAnh": "https://res.cloudinary.com/ilmsqrsb/image/upload/.../o5mvkjeiaycsclxf3ogh.jpg",
        "theLoai": "",
        "daoDien": "",
        "dienVien": "",
        "thoiLuong": 0,
        "doTuoi": "",
        "dinhDang": "4DX"
    }
}
```

**POST `/ThemPhimUploadHinh`** (multipart: `tenPhim=Phim Test Bao Cao`, `ngayKhoiChieu=15/09/2026`,
`danhGia=7`, `File=<ảnh>`)
```json
{
    "statusCode": 201,
    "message": "Them phim thanh cong",
    "content": {
        "maPhim": "6a88f465e190c5fd4107203c",
        "tenPhim": "Phim Test Bao Cao",
        "ngayKhoiChieu": "2026-09-14T17:00:00.000Z",
        "danhGia": 7,
        "hinhAnh": "https://res.cloudinary.com/ilmsqrsb/image/upload/.../csklwndqmzng0bejci5r.png",
        "...": "(các field còn lại về default rỗng/false vì không truyền)"
    }
}
```

**PUT `/CapNhatPhimUpload`** (multipart: `maPhim=6a88f465e190c5fd4107203c`, `danhGia=9`) → `danhGia`
đổi thành `9`, `statusCode: 200`.

**DELETE `/XoaPhim?MaPhim=6a88f465e190c5fd4107203c`** → `{"statusCode":200,"message":"Xoa phim thanh cong","content":null}`.

#### Banner — `/api/QuanLyBanner`

**GET `/LayDanhSachBanner`**
```json
{
  "statusCode": 200,
  "message": "Lay danh sach banner thanh cong",
  "content": [
    { "maBanner": "6a83e5912685e72744d8948c", "hinhAnh": "https://res.cloudinary.com/.../ndxeaq2o416fgynslta3.jpg", "thuTu": 1 }
  ]
}
```

**POST `/ThemBanner`** (multipart: `File=<ảnh>`, `thuTu=50`) → `201`, trả `maBanner` mới +
`hinhAnh` là URL Cloudinary thật (`.../banners/p5xt5n9t1ljexskk8ur7.png`).

**PUT `/CapNhatBanner`** (multipart: `maBanner=...`, `thuTu=51`) → `200`, `thuTu` đổi thành `51`.

**DELETE `/XoaBanner?MaBanner=...`** → `200`, `content: null`.

#### Hệ thống rạp — `/api/QuanLyHeThongRap`

**GET `/LayThongTinHeThongRap`** (danh sách, không truyền `?MaHeThongRap=`)
```json
{
  "statusCode": 200,
  "content": [
    {
      "maHeThongRap": "6a885fc086c8fc1ae6b43485",
      "tenHeThongRap": "Empire Cinema",
      "logo": "https://res.cloudinary.com/.../kr1jtgmtcwi3ttwwi0qp.png",
      "gioiThieu": "Hệ thống Empire Cinema được trang bị ....",
      "namThanhLap": 2022,
      "danhSachHinhAnh": [
        "https://res.cloudinary.com/.../wxzxe4ywxyftseqq4ria.webp",
        "https://res.cloudinary.com/.../lnkjhentx8sufi5onwve.jpg"
      ]
    }
  ]
}
```

**GET `/LayThongTinHeThongRap?MaHeThongRap=...`** — cùng object trên nhưng `content` là **1 object**
đơn (không phải mảng) khi có filter theo 1 hệ thống cụ thể.

**POST `/ThemHeThongRap`** (multipart: `tenHeThongRap=He Thong Test CapNhat`, `File=<logo>`) → `201`,
trả về đủ field kể cả `gioiThieu: ""`, `namThanhLap: null`, `danhSachHinhAnh: []` (default vì không
truyền).

**PUT `/CapNhatHeThongRap`** (multipart: `maHeThongRap=...`, `tenHeThongRap=He Thong Da Sua`,
`gioiThieu=Da cap nhat gioi thieu`) → `200`, 2 field đổi đúng, các field khác giữ nguyên.

**DELETE `/XoaHeThongRap?MaHeThongRap=...`** → `200` (test trên hệ thống không có cụm rạp con nên
xoá được; nếu còn cụm rạp con sẽ trả `400` theo logic đã mô tả ở mục 6.2, không test lại case này).

#### Cụm rạp — `/api/QuanLyCumRap`

**GET `/LayDanhSachCumRap?MaHeThongRap=6a885fc086c8fc1ae6b43485`**
```json
{
    "statusCode": 200,
    "content": [
        {
            "maCumRap": "6a886e2986c8fc1ae6b43488",
            "tenCumRap": "Empire Cinema Bắc Giang",
            "diaChi": "Tầng 4, TTTM Bắc Giang Center, 45 Nguyễn Văn Cừ, Phường Ngô Quyền, TP. Bắc Giang",
            "hinhAnh": "https://res.cloudinary.com/.../wlrkgdmprfhemsdublg5.jpg",
            "danhSachHinhAnh": [],
            "maHeThongRap": "6a885fc086c8fc1ae6b43485"
        }
    ]
}
```

**GET `/LayThongTinCumRap?MaCumRap=6a8871dc6dc4fdc0ac5aed8a`** → 1 object, có thêm
`danhSachHinhAnh: ["...a36pzezcri7ztvv3dcy9.jpg"]`.

**POST `/ThemCumRap`** (multipart: `tenCumRap`, `diaChi`, `maHeThongRap`, `File=<ảnh>`) → `201`,
trả `maCumRap` mới.

**PUT `/CapNhatCumRap`** (multipart: `maCumRap=...`, `diaChi=2 Duong XYZ, Q3, TPHCM`) → `200`, `diaChi`
đổi đúng, các field khác giữ nguyên (kể cả `hinhAnh` không đổi vì không gửi `File` mới).

**DELETE `/XoaCumRap?MaCumRap=...`** → `200`.

#### Phòng chiếu — `/api/QuanLyRap`

**GET `/LayDanhSachRap?MaCumRap=6a8871dc6dc4fdc0ac5aed8a`**
```json
{
    "statusCode": 200,
    "content": [
        { "maRap": "6a88722a6dc4fdc0ac5aed8d", "tenRap": "Phong 2", "maCumRap": "6a8871dc6dc4fdc0ac5aed8a", "soLuongGhe": 40 },
        { "maRap": "6a88721e6dc4fdc0ac5aed8c", "tenRap": "Phong 1", "maCumRap": "6a8871dc6dc4fdc0ac5aed8a", "soLuongGhe": 30 }
    ]
}
```

**GET `/LayThongTinRap?MaRap=...`** → 1 object tương ứng.

**POST `/ThemRap`** (JSON: `{"tenRap":"Phong Test Bao Cao","maCumRap":"...","soLuongGhe":20}`) →
`201`, `maRap` mới; đồng thời **đã xác nhận** `syncSeatsForRoom()` chạy đúng — gọi tiếp
`PUT /CapNhatRap` đổi `soLuongGhe` từ 20 → 25 thì `LayDanhSachPhongVe` cho lịch chiếu gán vào phòng
này trả đủ 25 ghế (không test riêng ở đây, đã verify logic này khi build tính năng, xem mục 5.5).

**DELETE `/XoaRap?MaRap=...`** → `200` (phòng test không có lịch chiếu nên xoá được).

#### Lịch chiếu — `/api/QuanLyLichChieu`

**GET `/LayDanhSachLichChieu?MaPhim=6a82cd53684ff0a3456d9d22`** — mảng lịch chiếu đã join sẵn tên
phim/rạp/cụm rạp/hệ thống rạp, vd:
```json
{
  "maLichChieu": "6a82cd53684ff0a3456d9e5e",
  "maPhim": "6a82cd53684ff0a3456d9d22", "tenPhim": "Zero Hour",
  "maRap": "6a82cd53684ff0a3456d98b9", "tenRap": "Phong 04",
  "maCumRap": "6a82cd53684ff0a3456d98b5", "tenCumRap": "BHD Star Cineplex Diamond Plaza 07",
  "maHeThongRap": "6a82cd52684ff0a3456d98ad", "tenHeThongRap": "BHD Star Cineplex",
  "ngayChieuGioChieu": "2026-08-10T02:00:00.000Z", "giaVe": 80000
}
```

**GET `/LayThongTinLichChieu?MaLichChieu=...`** → 1 object cùng cấu trúc trên.

**POST `/ThemLichChieu`** (JSON: `{"maPhim":"...","maRap":"...","ngayChieuGioChieu":"2027-03-01T20:00","giaVe":85000}`)
→ `201`, `ngayChieuGioChieu` lưu UTC đúng `-7h` so với giờ nhập (`13:00:00.000Z` cho input `20:00`,
xem mục 6.4).

**PUT `/CapNhatLichChieu`**, **DELETE `/XoaLichChieu?MaLichChieu=...`** → hoạt động đúng, đã test kèm
mục 6.2's "chặn trùng phòng+giờ" ở phiên làm việc trước đó (mục 8 checklist — vẫn còn hiệu lực, xác
nhận lại lần này: tạo trùng phòng+giờ → `409`, khác phòng cùng giờ → `201`).

**GET `.../LayThongTinLichChieuPhim?MaPhim=...`** → cấu trúc lồng 3 cấp đúng như mục 6.2 đã mô tả,
đã verify với phim thật có 12 suất chiếu trải nhiều ngày/phòng, mỗi suất có đủ `giaVeMin`/`giaVeMax`.

#### Booking & Ghế — `/api/QuanLyDatVe`

**GET `/LayDanhSachPhongVe?MaLichChieu=...`** (lịch chiếu test tạo riêng để không ảnh hưởng dữ liệu
thật)
```json
{
  "statusCode": 200,
  "content": {
    "thongTinPhim": {
      "tenPhim": "Zero Hour", "tenCumRap": "Lotte Cinema Cantavil", "tenRap": "Phong 2",
      "diaChi": "Tầng 7, Cantavil Premier, 1 Song Hành, An Phú, Quận 2 (TP. Thủ Đức), TP.HCM",
      "ngayChieu": "10/04/2027", "gioChieu": "20:00"
    },
    "danhSachGhe": [
      { "maGhe": "6a88722a49141a4f8b00f96d", "tenGhe": "A1", "loaiGhe": "Thuong", "daDat": false, "giaVe": 75000 }
    ]
  }
}
```

**POST `/DatVe`** — request `{"maLichChieu":"...","danhSachGhe":["6a88722a...96d","6a88722a...976"]}`
(mảng **`maGhe`**, không phải `tenGhe`) →
```json
{
    "statusCode": 201,
    "message": "Dat ve thanh cong",
    "content": {
        "maVe": "6a88f49de190c5fd41072044",
        "tongTien": 150000,
        "trangThai": "pending",
        "danhSachGhe": [
            { "maGhe": "6a88722a49141a4f8b00f96d", "giaVe": 75000 },
            { "maGhe": "6a88722a49141a4f8b00f976", "giaVe": 75000 }
        ]
    }
}
```
Gọi lại `POST /DatVe` với **đúng ghế vừa đặt** → `409 {"message":"Ghe da duoc dat, vui long chon ghe khac"}`
— xác nhận cơ chế chống đặt trùng ghế hoạt động đúng.

**GET `/LayLichSuDatVe`** (token của khách vừa đặt) → mảng có `danhSachGhe: [{maGhe, tenGhe, giaVe}]`
(đã populate `tenGhe: "A1"` đúng như mục 5.8 mô tả) và `thongTinPhim` đầy đủ tên phim/rạp/cụm rạp/hệ
thống rạp + `ngayChieuGioChieu` dạng ISO UTC.

**PUT `/HuyVe?MaVe=...`** → `200`, `trangThai` đổi thành `"cancelled"`.

**GET `/LayDanhSachVeDaBan`** (admin, không filter) → trả mảng vé thật (621-622 vé tại thời điểm
test, tuỳ dữ liệu nhóm), mỗi phần tử có thêm `taiKhoan`/`hoTenKhachHang`/`emailKhachHang`.

**GET `/ThongKeDoanhThu`** (admin, không filter) → `{"tongDoanhThu": 115180000, "soVe": 567}` (số
thật tại thời điểm test, không tính vé đã huỷ).

> ⚠️ **Bug thật phát hiện khi test `LayDanhSachVeDaBan?MaPhim=`:** filter theo `?MaPhim=` **luôn trả
> mảng rỗng**, kể cả khi chắc chắn có vé của đúng phim đó (đã tái hiện: đặt vé cho phim X xong gọi
> `LayDanhSachVeDaBan?MaPhim=<id phim X>` → trả `[]`). Nguyên nhân: `mapBookingHistory`
> (`backend/utils/bookingMapper.js`) xây object `thongTinPhim` nhưng **không có field `maPhim`**
> trong đó (chỉ có `tenPhim`, `hinhAnh`, `ngayChieuGioChieu`, `tenHeThongRap`, `tenCumRap`, `tenRap`)
> — trong khi `bookingController.js` lại lọc theo đúng `booking.thongTinPhim.maPhim === MaPhim`, so
> sánh với `undefined` nên luôn `false`. **Ảnh hưởng thực tế: không nghiêm trọng** — trang admin
> `/admin/booking` (`BookingManager.jsx`) hiện chỉ lọc theo `?TuNgay=`/`?DenNgay=` (hoạt động đúng),
> **không có ô lọc theo phim trên UI** nên người dùng thật chưa từng gặp lỗi này. Vẫn là 1 bug thật
> trong API cần sửa nếu sau này có ai dùng trực tiếp filter này (Postman, tích hợp khác...). Chưa sửa
> trong lần cập nhật note này (nằm ngoài phạm vi yêu cầu — chỉ update tài liệu), cần xác nhận với
> Thịnh trước khi sửa code.

### 11.2 Trạng thái deploy thật (xác nhận trực tiếp qua HTTP request, không suy đoán)

**Backend — Render:**
- ✅ **Đã deploy**, URL: `https://doan-ie213.onrender.com` (service `capstone-film-backend` theo
  `render.yaml`, region `singapore`, plan free).
- ✅ Endpoint gốc `GET /` trả `{"statusCode":200,"message":"Catalog backend is running"}`.
- ✅ **`MONGO_URI` đã set đúng và hoạt động**: gọi thật `GET /api/QuanLyPhim/LayDanhSachPhim` trên
  URL Render (không phải local) trả về 16 phim thật từ Atlas; `GET /api/QuanLyBanner/LayDanhSachBanner`
  trả 7 banner thật.
- ✅ **`JWT_SECRET` đã set và hoạt động đúng vòng đời token**: đăng ký tài khoản test thật qua
  `POST https://doan-ie213.onrender.com/api/QuanLyNguoiDung/DangKy`, đăng nhập lấy `accessToken`, gọi
  `GET ThongTinTaiKhoan` kèm token đó → `200`, xác thực đúng. *Lưu ý:* không thể xác minh **giá trị**
  `JWT_SECRET` có phải secret thật khác `"dev-secret-key"` (fallback cứng trong code, xem mục 6.1) hay
  không từ bên ngoài — cần Thịnh tự kiểm tra trực tiếp trong Render Dashboard → Environment để chắc
  chắn `JWT_SECRET` đã được set tường minh (không rơi vào fallback).
- ✅ **`CLOUDINARY_*` đã set đúng và hoạt động**: dùng tài khoản admin tạm, gọi thật
  `POST https://doan-ie213.onrender.com/api/QuanLyBanner/ThemBanner` với 1 ảnh test → nhận về URL
  Cloudinary thật (`https://res.cloudinary.com/ilmsqrsb/...`), sau đó đã xoá banner test này ngay.
- Tài khoản test đã tạo trên Render (`__render_test_...`) đã bị xoá khỏi DB sau khi test xong.

**Frontend — Vercel:**
- ✅ **Đã deploy**, URL: `https://do-an-ie-213.vercel.app`.
- ✅ Đã xác nhận qua Playwright thật (không chỉ mở tay): trang tải thành công, `<title>` là
  "CyberFilm" (đúng branding mới nhất), render được 32 thẻ phim, **không có lỗi console**, và toàn bộ
  request `/api/...` của trang đều gọi đúng về `https://doan-ie213.onrender.com` — xác nhận biến môi
  trường build-time (`VITE_API_URL`) trên Vercel đã trỏ đúng backend production, không phải
  `localhost`.

**Kết luận mục 11.2:** cả Backend và Frontend **đều đã deploy thành công và hoạt động đúng** tại thời
điểm kiểm thử (2026-08-22). Việc duy nhất không tự xác minh được từ bên ngoài là giá trị cụ thể của
`JWT_SECRET` — cần Thịnh xác nhận thủ công trong Render Dashboard.

### 11.3 Kết quả chạy thật checklist end-to-end (mục 9) — không phải liệt kê kế hoạch, là kết quả thật

Chạy bằng Playwright thật trên `localhost` (dev server) ngay sau khi build lại toàn bộ tính năng mới
nhất, dùng tài khoản test tự tạo rồi xoá sạch sau khi xong. **Toàn bộ 13 bước dưới đây đều PASS**,
không có console error nào trong suốt quá trình chạy:

| # | Bước | Kết quả | Ghi chú thật |
|---|---|---|---|
| 1 | `DangKy` → `DangNhap` | ✅ PASS | Đăng ký + đăng nhập tài khoản test mới, nhận `accessToken`, redirect về trang chủ đúng |
| 2 | Trang chủ: 2 dropdown lọc thể loại/trạng thái | ✅ PASS | 16 phim → còn 10 phim khi lọc "Hot" |
| 3 | Trang Detail: metadata + trailer + lịch chiếu | ✅ PASS | Nút "Xem trailer" tồn tại, đầy đủ thông tin phim |
| 4 | Booking: chọn ghế + đặt vé | ✅ PASS | Đặt vé thành công, redirect về trang chủ, dialog xác nhận đúng |
| 4b | Chống đặt trùng ghế (test riêng, phiên trước) | ✅ PASS | Đặt lại đúng ghế vừa đặt → `409`, ghế hiện `disabled` + màu xám trên UI, không bấm chọn lại được |
| 5a | Profile: hiển thị tên ghế trong lịch sử | ✅ PASS | Hiện đúng `Ghế: A1, A10` (tên ghế thật, không phải số lượng) |
| 5b | Profile: cập nhật thông tin cá nhân | ✅ PASS | Sửa họ tên → lưu thành công → Navbar cập nhật tên mới ngay, không cần tải lại trang |
| 5c | Profile: huỷ vé | ✅ PASS | Bấm huỷ, xác nhận dialog, trạng thái đổi đúng |
| 6 | `/admin/film` danh sách phim | ✅ PASS | 16 dòng hiển thị đúng |
| 7 | `/admin/user` danh sách người dùng | ✅ PASS | 43 dòng hiển thị đúng |
| 8 | `/admin/cinema` quản lý hệ thống/cụm/phòng | ✅ PASS | Đủ 3 khu vực quản lý (Hệ thống rạp/Cụm rạp/Phòng chiếu) |
| 9a | `/admin/showtime` danh sách lịch chiếu | ✅ PASS | 744 dòng hiển thị đúng |
| 9b | Sửa lịch chiếu: giờ VN đồng bộ list ↔ form sửa | ✅ PASS | List hiện `10/08/2026 09:00`, mở form sửa ra đúng `2026-08-10T09:00` — không lệch giờ |
| 10 | `/admin/booking` danh sách vé + doanh thu | ✅ PASS | 622 dòng vé + khối thống kê doanh thu hiển thị đúng |
| 11 | `/admin/banner` danh sách banner | ✅ PASS | 9 ảnh banner hiển thị đúng |

**Không có bước nào FAIL trong checklist UI.** Bug duy nhất phát hiện được trong lần kiểm thử này nằm
ở tầng API thuần (mục 11.1, `LayDanhSachVeDaBan?MaPhim=`), không lộ ra qua giao diện vì FE không dùng
filter này.

### 11.4 Xác nhận trạng thái Postman collection thật

Đã kiểm tra trực tiếp:
- `find . -iname "*postman*"` trên toàn bộ repo (cả backend lẫn frontend) → **không tìm thấy file
  nào** (không có `.postman_collection.json` hay thư mục `postman/` nào được commit).
- `git log --all` toàn repo → không có commit nào nhắc tới "Postman" hay "Nhật Minh"/"Tăng Nhật Minh".
- File `.docx` duy nhất hiện có trong repo (`DanY_Chuong3_Chuong4.docx`, chưa được commit vào git) chỉ
  là **dàn ý hướng dẫn viết chương 3-4 của báo cáo** — có nhắc tới việc dùng Postman để kiểm thử thủ
  công (mục 4.3 trong dàn ý), nhưng **không chứa bảng phân công công việc** và **không nhắc tên "Tăng
  Nhật Minh"** ở đâu cả. Đây không phải là file `PhanCongCongViec_BE_DB.docx` được nhắc tới ở mục 1 —
  file đó không có trong repo này, có thể Thịnh đang giữ riêng.

**Kết luận:** dựa trên toàn bộ những gì có trong repo, **không có bằng chứng nào cho thấy đã tồn tại
1 bộ Postman collection hoàn chỉnh cho toàn hệ thống** — khớp với mục 10 của note này (đã liệt kê
"Postman collection hoàn chỉnh" vào nhóm **chưa làm**). Nếu bảng phân công công việc trong báo cáo
đang ghi mục này là "100% hoàn thành (Tăng Nhật Minh)", **cần trao đổi trực tiếp với bạn Tăng Nhật
Minh và Thịnh** để xác nhận: (a) file Postman collection có tồn tại ở đâu đó ngoài repo này không
(máy cá nhân, Postman Cloud workspace riêng...), và nếu có thì xin file/link để đưa vào repo trước
khi nộp báo cáo; (b) nếu thực sự chưa làm, cần cập nhật lại bảng phân công cho đúng thực tế trước khi
nộp, tránh báo cáo sai sự thật với giảng viên.
