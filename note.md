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

## 5. Phase 2 — Rà soát/hoàn thiện Schema Mongoose theo từng collection

Đối chiếu code hiện có với bảng field dưới đây. Field nào thiếu → bổ sung. Field nào sai kiểu/sai
tên → sửa lại đúng theo đây (đây là "nguồn sự thật" duy nhất, ưu tiên hơn code cũ nếu có mâu thuẫn).

### 5.1 `users` (Người 1)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `taiKhoan` | String | có, unique | định danh đăng nhập |
| `matKhau` | String | có | hash bcrypt, không bao giờ trả về trong response |
| `hoTen` | String | có | |
| `email` | String | có, unique | |
| `soDT` | String | không | |
| `maLoaiNguoiDung` | String enum | có | `"QuanTri"` \| `"KhachHang"`, default `"KhachHang"` |
| `ngayTao` | Date | auto | `timestamps: true` |

### 5.2 `movies` (Người 2)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maPhim` |
| `tenPhim` | String | có | |
| `trailer` | String | không | link Youtube |
| `moTa` | String | không | |
| `ngayKhoiChieu` | Date | có | trả **ISO 8601** khi GET |
| `dangChieu` | Boolean | có | default `false` |
| `sapChieu` | Boolean | có | default `false` |
| `hot` | Boolean | có | default `false` |
| `danhGia` | Number | không | 0-10, default 0 |
| `hinhAnh` | String | có | URL ảnh đầy đủ sau upload |

### 5.3 `cinemaSystems` (Người 2)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maHeThongRap` |
| `tenHeThongRap` | String | có | vd "CGV", "Lotte Cinema" |
| `logo` | String | có | URL ảnh logo |

### 5.4 `cinemaComplexes` (Người 2)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maCumRap` |
| `tenCumRap` | String | có | |
| `diaChi` | String | có | |
| `hinhAnh` | String | không | |
| `maHeThongRap` | ObjectId (ref `cinemaSystems`) | có | |

### 5.5 `rooms` (Người 2)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maRap` |
| `tenRap` | String | có | vd "Rạp 1" |
| `maCumRap` | ObjectId (ref `cinemaComplexes`) | có | |
| `soLuongGhe` | Number | có | dùng để Người 3 seed `seats` mẫu |

### 5.6 `showtimes` (Người 2)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maLichChieu` |
| `maPhim` | ObjectId (ref `movies`) | có | |
| `maRap` | ObjectId (ref `rooms`) | có | |
| `ngayChieuGioChieu` | Date | có | chuỗi ISO datetime |
| `giaVe` | Number | có | giá mặc định, có thể bị override ở `seats` |

### 5.7 `seats` (Người 3)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maGhe` |
| `tenGhe` | String | có | vd "A1" |
| `loaiGhe` | String enum | có | chỉ `"Thuong"` hoặc `"Vip"` |
| `maRap` | ObjectId (ref `rooms`) | có | |
| `giaVe` | Number | có | override theo loại ghế nếu cần |

> ⚠️ `daDat` **không phải field lưu sẵn** trong `seats` — phải tính động mỗi lần gọi API bằng cách
> kiểm tra `bookings` xem đã có booking nào chứa `maGhe` này ứng với đúng `maLichChieu` đang hỏi.

### 5.8 `bookings` (Người 3)

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `_id` | ObjectId | auto | map với `maVe` |
| `taiKhoan` | ObjectId (ref `users`) | có | |
| `maLichChieu` | ObjectId (ref `showtimes`) | có | |
| `danhSachGhe` | Array<{`maGhe`, `giaVe`}> | có | snapshot giá tại thời điểm đặt |
| `tongTien` | Number | có | = tổng `giaVe` các ghế |
| `trangThai` | String enum | có | `"pending"` \| `"paid"` \| `"cancelled"` |
| `ngayDat` | Date | auto | `createdAt` |

Checklist Phase 2:

- [ ] Tất cả 8 collection trên đã có model Mongoose tương ứng, đúng tên field.
- [ ] Toàn bộ `ref` giữa các model trỏ đúng tên model (lỗi phổ biến nhất khi ghép code 3 người —
      populate sai tên sẽ trả `null` âm thầm, không báo lỗi rõ).
- [ ] Đã thêm index `unique` cho `taiKhoan`, `email` trong `users`.

## 6. Phase 3 — Rà soát/hoàn thiện API endpoints

Với mỗi endpoint dưới đây: kiểm tra đã tồn tại chưa, nếu có rồi thì đối chiếu đúng điều kiện, nếu
chưa có (đánh dấu **MỚI**) thì cần code bổ sung.

### 6.1 Auth & User

- `POST /api/QuanLyNguoiDung/DangNhap` — body `{taiKhoan, matKhau}`; response `content` **bắt buộc**
  có `accessToken` (JWT) và `maLoaiNguoiDung` đúng `"QuanTri"`/`"KhachHang"`.
- `POST /api/QuanLyNguoiDung/DangKy` — **MỚI**. Body: `{taiKhoan, matKhau, hoTen, email, soDT}`.
- `GET`/`PUT /api/QuanLyNguoiDung/ThongTinTaiKhoan` — **MỚI**, cần `Authorization: Bearer <token>`.
- Admin: `GET DanhSachNguoiDung`, `PUT`/`DELETE` theo `?TaiKhoan=` — **MỚI**.
- Middleware `verifyToken`, `checkAdmin` — dùng chung cho toàn bộ route admin và route đặt vé.

### 6.2 Catalog

- `GET /api/QuanLyPhim/LayDanhSachPhim`
- `GET /api/QuanLyPhim/LayThongTinPhim?MaPhim=xx` — query key **viết hoa** `MaPhim`; `ngayKhoiChieu`
  phải là ISO 8601 hợp lệ để `new Date()` parse đúng.
- `GET /api/QuanLyPhim/LayDanhSachBanner`
- `POST /api/QuanLyPhim/ThemPhimUploadHinh` (multipart) — field ảnh tên `"File"`; ngày gửi lên dạng
  `dd/MM/yyyy` (FE tự format) — BE cần parse đúng định dạng này bằng `dayjs`.
- `POST /api/QuanLyPhim/CapNhatPhimUpload` (multipart) — `maPhim` nằm **trong body**, không phải URL.
- `DELETE /api/QuanLyPhim/XoaPhim?MaPhim=xx` — query key viết hoa.
- `GET /api/QuanLyRap/LayThongTinHeThongRap` — trả mảng phẳng `{maHeThongRap, tenHeThongRap, logo}`.
- `GET /api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=xx` — **endpoint phức tạp nhất**, `content`
  bắt buộc đúng cấu trúc lồng 3 cấp:
  ```json
  {
    "heThongRapChieu": [
      {
        "maHeThongRap": "...", "tenHeThongRap": "...", "logo": "...",
        "cumRapChieu": [
          {
            "maCumRap": "...", "tenCumRap": "...", "diaChi": "...", "hinhAnh": "...",
            "lichChieuPhim": [
              { "maLichChieu": "...", "ngayChieuGioChieu": "2026-07-10T19:30:00" }
            ]
          }
        ]
      }
    ]
  }
  ```
  Sai cấu trúc lồng này sẽ crash trang Detail của FE ngay lập tức.
- Admin CRUD `cinemaComplexes`/`rooms`/`showtimes` — **MỚI hoàn toàn**.

### 6.3 Booking & Ghế

- `GET /api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=xx` — query key viết hoa; `content`:
  ```json
  {
    "thongTinPhim": { "tenPhim": "...", "tenCumRap": "...", "tenRap": "...", "diaChi": "...", "ngayChieu": "10/07/2026", "gioChieu": "19:30" },
    "danhSachGhe": [ { "maGhe": "A1", "tenGhe": "A1", "loaiGhe": "Vip", "daDat": false, "giaVe": 90000 } ]
  }
  ```
  `ngayChieu`/`gioChieu` phải **tách 2 field riêng**; `loaiGhe` phải đúng chuỗi `"Vip"` (hoa chữ V).
- `POST /api/QuanLyDatVe/DatVe` — **MỚI, quan trọng nhất**. Đề xuất body:
  `{ maLichChieu, danhSachGhe: ["A1", "A2"] }`. Logic bắt buộc: kiểm tra từng ghế chưa bị đặt trùng
  trước khi lưu, snapshot `giaVe`, tự tính `tongTien`.
- `GET /api/QuanLyDatVe/LayLichSuDatVe` — **MỚI**, cần token, trả booking đã join sẵn thông tin phim.

## 7. Phase 4 — Seed dữ liệu mẫu

Viết 1 script `seed.js` chạy 1 lần để tạo dữ liệu mẫu tối thiểu, đủ để test toàn bộ luồng:

- [ ] 1 user admin (`maLoaiNguoiDung: "QuanTri"`) + 1 user khách hàng, mật khẩu đã hash sẵn.
- [ ] Ít nhất 3-5 phim (`movies`), có phim `dangChieu: true`.
- [ ] 1-2 hệ thống rạp, mỗi hệ thống 1-2 cụm rạp, mỗi cụm rạp 1-2 phòng chiếu.
- [ ] Với mỗi phòng, tự sinh `soLuongGhe` ghế trong `seats` (vd 40 ghế, hàng cuối là `"Vip"`).
- [ ] 2-3 lịch chiếu (`showtimes`) gán vào các phim/phòng ở trên, có ngày giờ trong tương lai gần.
- [ ] Chạy `node seed.js`, xác nhận dữ liệu xuất hiện trong Atlas → Browse Collections.

## 8. Phase 5 — Merge nhánh của 3 người (nếu chưa merge xong)

Theo đúng thứ tự phụ thuộc: **Auth trước → Catalog → Booking** (vì Catalog/Booking cần middleware
của Auth; Booking cần dữ liệu Catalog để test).

```bash
git checkout -b integration-test main
git merge origin/feature/auth      # xử lý conflict nếu có, commit
git merge origin/feature/catalog   # tương tự
git merge origin/feature/booking   # tương tự
```

2 chỗ hay conflict nhất, xử lý theo cách sau:
- File mount route (`app.js`): giữ lại **cả 3 dòng** `app.use(...)`, không xoá của ai.
- `package.json`: gộp union tất cả dependency; **không merge tay** `package-lock.json` — xoá
  `node_modules` + `package-lock.json` rồi `npm install` lại từ đầu sau khi gộp `package.json`.

## 9. Phase 6 — Test end-to-end (chỉ coi là xong khi cả 5 bước này pass)

1. `POST DangKy` → `POST DangNhap` → nhận `accessToken`.
2. Dùng token gọi API admin: thêm 1 phim mới, thêm 1 lịch chiếu mới.
3. Gọi `LayDanhSachPhim` / `LayThongTinLichChieuPhim` (không cần token) → xác nhận data vừa thêm
   hiện đúng, đúng cấu trúc lồng.
4. Gọi `LayDanhSachPhongVe` theo lịch chiếu vừa tạo → thấy đủ ghế, `daDat: false` hết.
5. Gọi `DatVe` với 1-2 ghế → gọi lại bước 4 → các ghế đó phải chuyển `daDat: true`; gọi `DatVe` lần
   nữa với đúng ghế đó → phải báo lỗi "ghế đã được đặt", không cho đặt trùng.

Nếu có bước nào fail, sửa trực tiếp trong `integration-test`, không quay lại các nhánh riêng của
từng người.

## 10. Phase 7 — Báo cáo lại cho Thịnh

Sau khi hoàn tất, tổng hợp lại:
- Danh sách endpoint đã hoạt động / còn lỗi (nếu có).
- Danh sách field/API đã phải chỉnh sửa so với những gì 3 bạn code ban đầu, kèm lý do (đối chiếu
  mục 5-6).
- Connection string/cấu hình `.env` cuối cùng (không leak password thật ra ngoài, chỉ mô tả cấu
  trúc) để Thịnh cấu hình `VITE_API_URL` ở phía FE.
- Đề xuất bước tiếp theo (deploy thử, viết Postman collection hoàn chỉnh, v.v.) nếu còn thời gian.
