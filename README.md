# Melody FE

Frontend React + Vite cho Melody. Đã cấu hình để gọi API của backend trong thư mục `melody-be`.

## Chạy local

```bash
cp .env.example .env            # set VITE_API_URL nếu backend không chạy ở http://localhost:4000
npm install
npm run dev
```

## Deploy

- Cung cấp biến môi trường `VITE_API_URL` trỏ tới domain backend sau khi deploy (ví dụ `https://your-backend-domain.com`).
- Backend cần bật CORS với domain frontend (cấu hình `CLIENT_URL` trong `melody-be/.env`).
- Các form đăng ký/đăng nhập sẽ gọi `/api/auth/register` và `/api/auth/login`, lưu token vào `localStorage` và điều hướng sang trang Home.
