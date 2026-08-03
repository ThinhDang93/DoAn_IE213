# Hướng dẫn chạy thử Catalog - Người 2

Tài liệu này dùng để chạy thử toàn bộ phần Catalog trong workspace hiện tại, phù hợp với cấu trúc frontend và backend của dự án.

## 1. Mục tiêu

Sau khi chạy đúng, bạn có thể kiểm tra các chức năng sau:
- Quản lý phim
- Quản lý hệ thống rạp
- Quản lý cụm rạp
- Quản lý phòng chiếu
- Quản lý lịch chiếu
- Xem dữ liệu ở giao diện người dùng và trang quản trị

## 2. Yêu cầu trước khi chạy

- Cài đặt Node.js 18+ và npm
- Cài đặt MongoDB và đảm bảo MongoDB đang chạy
- Mở terminal tại thư mục gốc của dự án

> Nếu đang chạy trên Windows, nên mở 2 terminal riêng: 1 terminal cho frontend, 1 terminal cho backend.

## 3. Cài đặt dependencies

Chạy các lệnh sau ở thư mục gốc của dự án:

```bash
cd backend
npm install
cd ..
npm install
```

## 4. Cấu hình môi trường backend

Tạo hoặc chỉnh sửa file backend/.env với nội dung tối thiểu như sau:

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/doan_ie213
SEED_CATALOG_ON_START=true
```

Nếu file backend/.env chưa tồn tại, hãy tạo mới. Nếu MongoDB chưa chạy, hãy khởi động trước.

### Khởi động MongoDB trên Windows

Nếu đã cài MongoDB service, có thể dùng:

```bash
mongod
```

Nếu MongoDB đã được cài dưới dạng service, có thể dùng:

```bash
net start MongoDB
```

## 5. Chạy backend

Mở terminal ở thư mục backend và chạy:

```bash
cd backend
npm run dev
```

Hoặc:

```bash
cd backend
npm start
```

Backend sẽ khởi động tại:
- http://localhost:8080

### Kiểm tra backend

Mở trình duyệt hoặc dùng curl để kiểm tra:

```bash
curl http://localhost:8080/
```

Nếu thành công, bạn sẽ thấy phản hồi JSON với thông báo backend đang chạy.

## 6. Chạy frontend

Mở terminal khác ở thư mục gốc và chạy:

```bash
npm run dev
```

Frontend sẽ khởi động tại:
- http://localhost:5173

## 7. Các màn hình cần kiểm tra

### 7.1 Trang chủ và danh sách phim

Truy cập:
- http://localhost:5173/

Kiểm tra xem:
- Danh sách phim có load được không
- Carousel banner có hiển thị không
- Click vào phim có chuyển sang trang chi tiết không

### 7.2 Trang chi tiết phim

Truy cập từ trang chủ bằng cách chọn một phim.

Kiểm tra xem:
- Thông tin phim hiển thị đúng
- Lịch chiếu có xuất hiện đúng theo phim

### 7.3 Trang quản trị phim

Truy cập:
- http://localhost:5173/admin/film

Kiểm tra xem:
- Danh sách phim hiện lên đúng
- Có thể xem, thêm, sửa, xóa phim

### 7.4 Trang thêm phim mới

Truy cập:
- http://localhost:5173/admin/film/addnew

Kiểm tra xem:
- Form thêm phim mở đúng
- Có thể nhập dữ liệu và submit

## 8. Chạy và test backend bằng Thunder Client

Sau khi backend đã chạy trên http://localhost:8080, bạn có thể dùng Thunder Client trong VS Code để test API một cách trực quan.

### 8.1 Cài đặt Thunder Client

- Mở Extensions trong VS Code
- Tìm kiếm "Thunder Client"
- Cài đặt extension này

### 8.2 Test API cơ bản

1. Mở Thunder Client
2. Nhấn New Request
3. Chọn method GET
4. Dán URL:
   - http://localhost:8080/
5. Nhấn Send

Kết quả mong đợi:
- Status: 200
- Body JSON trả về thông báo backend đang chạy

### 8.3 Test các API Catalog quan trọng

#### Test lấy danh sách phim
- Method: GET
- URL: http://localhost:8080/api/QuanLyPhim/LayDanhSachPhim

#### Test lấy thông tin hệ thống rạp
- Method: GET
- URL: http://localhost:8080/api/QuanLyHeThongRap/LayThongTinHeThongRap

#### Test lấy thông tin cụm rạp
- Method: GET
- URL: http://localhost:8080/api/QuanLyCumRap/LayThongTinCumRapTheoHeThong

#### Test lấy thông tin phòng chiếu
- Method: GET
- URL: http://localhost:8080/api/QuanLyRap/LayThongTinPhongChieu x

#### Test lấy thông tin lịch chiếu
- Method: GET
- URL: http://localhost:8080/api/QuanLyLichChieu/LayThongTinLichChieu x

### 8.4 Gợi ý khi test bằng Thunder Client

- Nếu thấy lỗi 404, hãy kiểm tra đúng endpoint và method
- Nếu thấy lỗi 500, thường là do MongoDB chưa kết nối hoặc dữ liệu không đúng
- Nếu API cần body, hãy chọn Body và điền đúng JSON theo format backend yêu cầu

## 9. Các API Catalog quan trọng

Backend đang expose các route chính sau:

- Quản lý phim:
  - /api/QuanLyPhim
- Quản lý hệ thống rạp:
  - /api/QuanLyHeThongRap
- Quản lý cụm rạp:
  - /api/QuanLyCumRap
- Quản lý phòng chiếu:
  - /api/QuanLyRap
- Quản lý lịch chiếu:
  - /api/QuanLyLichChieu

### Ví dụ kiểm tra nhanh

```bash
curl http://localhost:8080/api/QuanLyPhim/LayDanhSachPhim
curl http://localhost:8080/api/QuanLyHeThongRap/LayThongTinHeThongRap
curl http://localhost:8080/api/QuanLyCumRap/LayThongTinCumRapTheoHeThong
```

## 10. Ghi chú quan trọng

- Nếu backend không chạy đúng do lỗi kết nối MongoDB, hãy kiểm tra lại URL trong backend/.env.
- Nếu API vẫn trả dữ liệu cũ sau khi chỉnh sửa, có thể do tiến trình Node cũ đang giữ port 8080. Hãy đóng tiến trình cũ trước khi chạy lại.
- Nếu frontend không nhận dữ liệu, hãy kiểm tra xem backend đã chạy và port 8080 có đang mở không.
- Nếu muốn dữ liệu Catalog được seed tự động khi khởi động, giữ SEED_CATALOG_ON_START=true.

## 11. Luồng chạy thử tối thiểu

1. Khởi động MongoDB
2. Chạy backend ở terminal 1
3. Chạy frontend ở terminal 2
4. Mở http://localhost:5173
5. Kiểm tra các màn hình quản trị và người dùng liên quan đến Catalog

## 12. Nếu cần hỗ trợ

Nếu có lỗi trong quá trình chạy, hãy kiểm tra:
- Terminal backend để xem log lỗi
- Terminal frontend để xem lỗi Vite
- File backend/.env và kết nối MongoDB
