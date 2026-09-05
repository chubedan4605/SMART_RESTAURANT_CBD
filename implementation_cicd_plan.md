# Kế hoạch Triển khai Tích hợp & Giao hàng Liên tục (CI/CD) Chuyên nghiệp

Với kiến trúc AWS hiện tại (Frontend trên S3 + CloudFront, Backend trên EC2, Database trên RDS), công cụ CI/CD phù hợp và phổ biến nhất hiện nay là **GitHub Actions**.

Dưới đây là thiết kế kiến trúc CI/CD chuẩn mực (Professional Pipeline) mà chúng ta sẽ xây dựng.

## 🎯 Mục tiêu
Tự động hóa hoàn toàn quy trình: **Viết code -> Push lên GitHub nhánh `main` -> Hệ thống tự động Build -> Tự động Đẩy Frontend lên S3 -> Tự động Restart Backend trên EC2 -> Người dùng thấy bản cập nhật mới nhất trong vòng 2 phút.**

---

## 🏗️ Kiến trúc Pipeline đề xuất

Chúng ta sẽ tạo một luồng duy nhất (Workflow) chạy mỗi khi có code mới được đẩy lên nhánh `main`. Luồng này chia làm 2 Job chạy song song:

### Job 1: Deploy Frontend (S3 + CloudFront)
1. **Checkout Code:** Kéo code mới nhất từ GitHub.
2. **Cài đặt Node.js & Dependencies:** Chạy `npm install` cho thư mục `apps/fe`.
3. **Build:** Chạy `npm run build` để đóng gói React/Vite ra thư mục `dist`.
4. **Cấu hình AWS CLI:** Xác thực với AWS thông qua `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY`.
5. **Upload lên S3:** Dùng lệnh `aws s3 sync` để đồng bộ thư mục `dist` lên Bucket S3 chứa Frontend của bạn.
6. **Xóa Cache CloudFront (Invalidation):** Dùng lệnh `aws cloudfront create-invalidation` để ép CloudFront xóa bộ nhớ tạm, giúp người dùng nhận được code mới ngay lập tức mà không cần Ctrl+F5.

### Job 2: Deploy Backend (EC2)
1. **Checkout Code:** Kéo code mới nhất.
2. **Kết nối SSH vào EC2:** Sử dụng công cụ `appleboy/ssh-action` và khóa bí mật `smart-restaurant-key.pem` (được lưu an toàn trong GitHub Secrets) để kết nối từ xa vào máy chủ EC2.
3. **Thực thi lệnh Cập nhật trên EC2:**
   - Đi vào thư mục dự án: `cd ~/SMART_RESTAURANT_CBD`
   - Cập nhật code mới: `git pull origin main`
   - Đi vào backend: `cd apps/be`
   - Cài đặt thư viện mới (nếu có): `npm install`
   - Khởi động lại Server: `pm2 restart smart-restaurant-backend`

---

## 🔒 Quản lý Bảo mật (GitHub Secrets)

> [!IMPORTANT]
> Tuyệt đối **không** được đưa các thông tin nhạy cảm vào code. Chúng ta sẽ lưu chúng an toàn trong phần **Settings -> Secrets and variables -> Actions** của kho lưu trữ GitHub.

Bạn sẽ cần chuẩn bị và nhập các thông tin sau vào GitHub Secrets:
1. `AWS_ACCESS_KEY_ID`: Mã kết nối tài khoản AWS.
2. `AWS_SECRET_ACCESS_KEY`: Khóa bí mật tài khoản AWS.
3. `AWS_S3_BUCKET_NAME`: Tên bucket S3 của bạn (ví dụ: `smart-restaurant-frontend-xyz`).
4. `AWS_CLOUDFRONT_DISTRIBUTION_ID`: Mã ID của CloudFront (ví dụ: `E1XXXXXXX`).
5. `EC2_HOST`: Địa chỉ IP của EC2 (`51.21.240.2`).
6. `EC2_SSH_KEY`: Toàn bộ nội dung chữ bên trong file `smart-restaurant-key.pem`.

---

## ❓ Câu hỏi xác nhận

> [!TIP]
> Bạn đã sẵn sàng để cấu hình hệ thống này chưa? Nếu bạn đồng ý, tôi sẽ tạo file cấu hình `.github/workflows/deploy.yml` và hướng dẫn bạn cách lấy các mã Secret trên AWS để nhập vào GitHub. Vui lòng bấm **Proceed / Phê duyệt** để bắt đầu!
