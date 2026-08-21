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
