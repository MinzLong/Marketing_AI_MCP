# Hướng dẫn thiết lập Google OAuth

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API (hiện tại là Google People API)

## 2. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Application type**: Web application
4. Thêm **Authorized JavaScript origins** (CHỈ frontend):
   ```
   http://localhost:5173
   ```
5. Thêm **Authorized redirect URIs** (CHỈ frontend):
   ```
   http://localhost:5173/auth/google/callback
   ```
6. **KHÔNG CẦN** thêm backend port 8000 - Google chỉ tương tác với frontend
7. Lưu và copy **Client ID** và **Client Secret**

## 3. Cấu hình Backend

1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Cập nhật file `.env` với thông tin Google OAuth:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
   ```

## 4. Cấu hình Frontend

1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Cập nhật file `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   VITE_API_URL=http://localhost:5000
   ```

## 5. Chạy ứng dụng

1. Khởi động backend:
   ```bash
   cd backend
   python run.py
   ```

2. Khởi động frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## 6. Kiểm tra tính năng

1. Truy cập `http://localhost:5173`
2. Click vào nút "Sign in with Google"
3. Hoàn thành quy trình xác thực Google
4. Kiểm tra xem user được tạo trong database MongoDB

## 7. Cấu trúc Database

Sau khi đăng nhập bằng Google, user sẽ được lưu với cấu trúc:

```json
{
  "_id": "ObjectId",
  "google_id": "google_user_id",
  "username": "email_prefix_or_unique_username",
  "email": "user@gmail.com",
  "name": "Full Name",
  "picture": "https://lh3.googleusercontent.com/...",
  "email_verified": true,
  "is_active": true,
  "auth_provider": "google",
  "created_at": "2026-02-02T...",
  "last_login": "2026-02-02T..."
}
```

## 8. API Endpoints mới

- `POST /api/auth/google` - Lấy Google auth URL
- `POST /api/auth/google/callback` - Xử lý callback với authorization code
- `POST /api/auth/google/verify-token` - Xác thực Google ID token trực tiếp

## 9. Troubleshooting

### Lỗi thường gặp:

1. **Invalid client_id**: Kiểm tra GOOGLE_CLIENT_ID trong .env
2. **Redirect URI mismatch**: Đảm bảo redirect URI trong Google Console khớp với config
3. **CORS errors**: Kiểm tra CORS_ORIGINS trong backend config
4. **Token verification failed**: Đảm bảo Google API đã được bật và credentials đúng

### Debug:

1. Kiểm tra browser console để xem lỗi JavaScript
2. Kiểm tra backend logs để xem lỗi API
3. Verify MongoDB connection và database name
4. Test API endpoints trực tiếp bằng Postman/curl

## 10. Production Deployment

Khi deploy production:

1. Cập nhật **Authorized JavaScript origins** và **Authorized redirect URIs** trong Google Console
2. Cập nhật các biến môi trường với domain thực
3. Sử dụng HTTPS cho production
4. Bảo mật JWT_SECRET_KEY và GOOGLE_CLIENT_SECRET
