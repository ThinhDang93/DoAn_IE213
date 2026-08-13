# Hướng dẫn chạy dự án local (Backend + Frontend)

Repo gồm 2 phần độc lập, mỗi phần có `package.json` riêng:

```
CapStone_Film/
├── backend/     # Node.js + Express + MongoDB (Mongoose)
├── frontend/    # React + Vite + Redux Toolkit
└── huongdan.md  # file này
```

## 0. Yêu cầu trước khi bắt đầu

- **Node.js 18+** (khuyến nghị 20+). Kiểm tra: `node -v`
- **npm** (đi kèm Node) — dùng cho `backend/`
- **yarn** — dùng cho `frontend/`. Nếu chưa có: `npm install -g yarn`
- Git đã cấu hình, có quyền truy cập repo

## 1. Clone repo

```bash
git clone https://github.com/ThinhDang93/DoAn_IE213.git
cd DoAn_IE213
git checkout main
```

## 2. Cài đặt dependencies

Cài **từng thư mục riêng** — không chạy `npm install`/`yarn install` ở thư mục gốc vì gốc không có `package.json`.

```bash
# Backend
cd backend
npm install

# Frontend (mở terminal/tab khác, hoặc cd ra lại rồi vào frontend)
cd ../frontend
yarn install
```

`npm install` và `yarn install` sẽ tự cài đúng version các package theo `package-lock.json` (backend) / `yarn.lock` (frontend) đã có sẵn trong repo — không cần tự chọn version.

## 3. Cấu hình file `.env`

Mỗi thư mục cần **1 file `.env` riêng** (không dùng chung, không commit lên git — đã có trong `.gitignore`). **Thịnh sẽ gửi nội dung 2 file này riêng** (qua nhóm chat/Zalo), sau khi nhận thì tạo file như sau:

### `backend/.env`

```env
PORT=8080
MONGO_URI=<Thịnh gửi connection string MongoDB Atlas>
JWT_SECRET=<Thịnh gửi>
SEED_CATALOG_ON_START=true
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8080
```

(`VITE_API_URL` trỏ về backend đang chạy local trên máy bạn — port `8080` khớp với `PORT` ở `backend/.env`, không cần đổi trừ khi bạn đổi `PORT`.)

## 4. Chạy local

Cần **2 terminal riêng** chạy song song (backend không tự chạy frontend và ngược lại):

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Chạy đúng khi thấy log:
```
MongoDB connected
Backend is listening on http://localhost:8080
```

**Terminal 2 — Frontend:**
```bash
cd frontend
yarn dev
```
Chạy đúng khi thấy:
```
➜  Local:   http://localhost:5173/
```

Mở trình duyệt vào `http://localhost:5173` để test.

## 5. Tài khoản mẫu có sẵn (tự động seed khi backend chạy lần đầu)

| Tài khoản | Mật khẩu | Vai trò |
|---|---|---|
| `admin` | `Admin@123` | QuanTri (vào được `/admin/film`, `/admin/user`) |
| `khachhang1` | `KhachHang@123` | KhachHang |

Backend tự seed thêm vài phim, hệ thống rạp/cụm rạp/phòng/lịch chiếu/ghế mẫu ở lần chạy đầu tiên (DB rỗng). Muốn seed lại thủ công:
```bash
cd backend
npm run seed
```

## 6. Một số lệnh khác

| Việc cần làm | Lệnh | Chạy ở đâu |
|---|---|---|
| Build production frontend | `yarn build` | `frontend/` |
| Lint frontend | `yarn lint` | `frontend/` |
| Chạy backend không watch-mode | `npm start` | `backend/` |

## 7. Lỗi thường gặp

- **`vite: command not found` / `Cannot find module ...`** → chưa chạy `yarn install`/`npm install` đúng thư mục, hoặc chạy nhầm ở thư mục gốc.
- **Backend log `MongoDB connection failed`** → sai `MONGO_URI` trong `backend/.env`, hoặc IP máy bạn chưa được thêm vào Network Access của Atlas (báo Thịnh để thêm `0.0.0.0/0`).
- **Frontend gọi API bị lỗi/CORS/404** → kiểm tra backend đã chạy chưa (Terminal 1) và `VITE_API_URL` trong `frontend/.env` đúng cổng `8080`.
- **Đăng nhập xong gọi API vẫn báo 401** → thử đăng xuất (xoá `localStorage`) rồi đăng nhập lại; nếu vẫn lỗi, báo lại nhóm.
