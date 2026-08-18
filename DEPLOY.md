# Hướng dẫn Deploy (Backend → Render, Frontend → Vercel)

File này hướng dẫn deploy bản test cho cả nhóm cùng dùng. Các bước đăng nhập/bấm nút trên Render và Vercel cần làm thủ công trên trình duyệt (Claude không có quyền truy cập tài khoản Render/Vercel của bạn) — phần dưới đây liệt kê chính xác từng bước.

**Thứ tự bắt buộc: deploy Backend (Render) trước, lấy URL xong mới deploy Frontend (Vercel)** — vì Frontend cần biết URL Backend để gọi API.

Repo đã có sẵn 2 file cấu hình phục vụ việc này:
- `render.yaml` (ở root) — Render đọc file này để tự cấu hình service backend.
- `frontend/vercel.json` — cấu hình rewrite để React Router không bị lỗi 404 khi F5 ở các route con (`/admin/film`, `/detail/:id`...).

## Phần 1 — Deploy Backend lên Render

1. Vào https://render.com → đăng nhập/đăng ký (dùng GitHub cho nhanh).
2. **New** → **Blueprint**.
3. Chọn repo GitHub `DoAn_IE213` (cần authorize Render truy cập GitHub nếu lần đầu).
4. Render tự đọc `render.yaml` và hiện ra 1 service tên `capstone-film-backend`. Bấm **Apply**.
5. Render sẽ hỏi nhập giá trị cho các biến môi trường được đánh dấu `sync: false` — điền đúng theo `backend/.env` hiện tại của bạn:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Đợi build xong (vài phút). Khi log hiện `MongoDB connected` và `Backend is listening...` là thành công.
7. Copy URL Render cấp cho service (dạng `https://capstone-film-backend.onrender.com`) — **cần URL này cho bước deploy Frontend**.
8. Kiểm tra nhanh: mở URL đó trên trình duyệt, phải thấy JSON `{"statusCode":200,"message":"Catalog backend is running",...}`.

### Nếu không dùng Blueprint (deploy thủ công từng bước)

- **New** → **Web Service** → chọn repo.
- **Root Directory**: `backend`
- **Build Command**: `npm install --legacy-peer-deps`
- **Start Command**: `npm start`
- Thêm 5 biến môi trường như bước 5 ở trên (thêm `SEED_CATALOG_ON_START=true`).

### Lưu ý về Render Free Tier

- Sau ~15 phút không có request nào, service sẽ "ngủ" — request đầu tiên sau đó có thể mất 30-60s để backend khởi động lại (cold start). Đây là giới hạn của gói free, không phải lỗi.
- MongoDB Atlas **Network Access** phải cho phép `0.0.0.0/0` (đã cấu hình từ trước) vì IP của Render không cố định.

## Phần 2 — Deploy Frontend lên Vercel

1. Vào https://vercel.com → đăng nhập bằng GitHub.
2. **Add New** → **Project** → chọn repo `DoAn_IE213`.
3. Ở màn hình cấu hình:
   - **Root Directory**: bấm **Edit** → chọn `frontend`.
   - **Framework Preset**: Vercel tự nhận diện **Vite** (nếu không, tự chọn).
   - Build Command / Output Directory: để mặc định (`vite build` / `dist`).
4. Mở rộng **Environment Variables**, thêm:
   - `VITE_API_URL` = URL backend Render ở Phần 1 bước 7 (vd `https://capstone-film-backend.onrender.com`) — **không có dấu `/` ở cuối**.
5. Bấm **Deploy**. Đợi build xong, Vercel cấp URL dạng `https://<ten-project>.vercel.app`.

## Phần 3 — Kiểm tra sau khi deploy

1. Mở URL Vercel → trang chủ phải load được danh sách phim (gọi API Render thành công, không lỗi CORS/Network trong Console).
2. Đăng nhập thử tài khoản admin đã seed sẵn.
3. Thử luồng đặt vé end-to-end (chọn phim → chọn suất → chọn ghế → đặt vé).
4. Vào `/admin/film` bằng tài khoản admin, thử thêm 1 phim có upload ảnh — kiểm tra ảnh lên Cloudinary và hiển thị đúng.
5. Nếu có lỗi CORS trong Console trình duyệt: kiểm tra lại `VITE_API_URL` ở Vercel có đúng URL Render không (Vercel cần **redeploy** sau khi đổi biến môi trường — vào **Deployments** → **Redeploy**).

## Sau khi có URL thật

- Gửi URL Vercel cho cả nhóm để test.
- Mỗi lần push code mới lên nhánh `main`, cả Render và Vercel sẽ **tự động build lại và deploy** (đã bật theo mặc định khi kết nối GitHub).
- Muốn đổi domain/tên gọn hơn: đổi ở phần **Settings → Domains** của từng project (Vercel) hoặc **Settings → Name** (Render).

## Giới hạn/lưu ý đã biết

- Backend hiện cho phép CORS từ **mọi origin** (`cors()` mặc định) — phù hợp cho giai đoạn test, nên siết lại (`cors({ origin: "<url-vercel>" })`) trước khi dùng thật.
- Cả 2 nền tảng đều dùng gói Free — đủ cho test nhóm nhỏ, không nên dùng demo đông người dùng thật cùng lúc (Render free có giới hạn RAM/CPU và cold start).
