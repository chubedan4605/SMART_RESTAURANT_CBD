# Kế hoạch Triển khai Smart Restaurant lên AWS (Professional, $0 Cost)

Kế hoạch này kết hợp **kiến trúc hiện tại của Smart Restaurant** (Express, Socket.io, Prisma) với **các ý tưởng triển khai chuyên nghiệp, bảo mật từ đề bài `PROJECT2_VI.md`** để tạo ra một hệ thống chạy trên AWS tối ưu nhất, tuân thủ giới hạn **Free Tier (0$)**.

Vì Smart Restaurant có sử dụng **Socket.io** (kết nối thời gian thực 24/7), chúng ta **KHÔNG THỂ** dùng AWS Lambda (Serverless) cho Backend như đề bài. Thay vào đó, chúng ta sẽ dùng **Amazon EC2**, kết hợp với Serverless cho Frontend và RDS cho Database.

---

## 1. Kiến trúc Hạ tầng Lai (Hybrid Architecture)

1. **Frontend (Serverless)**: 
   - Tận dụng ý tưởng bảo mật từ đề bài: Lưu trữ tĩnh trên **Amazon S3 (Private)** và chỉ cho phép truy cập qua mạng CDN toàn cầu **Amazon CloudFront** thông qua **OAC** (Origin Access Control). 
2. **Compute / Backend (EC2)**: 
   - Thay vì dùng Lambda, chúng ta thuê 1 máy chủ ảo **Amazon EC2 (t2.micro hoặc t3.micro)** chạy Ubuntu. EC2 hoạt động 24/7, cực kỳ hoàn hảo để chạy Node.js (Express) và duy trì kết nối WebSocket (Socket.io).
3. **Database (RDS)**: 
   - Mượn ý tưởng "Cô lập mạng" từ đề bài: Khởi tạo **Amazon RDS PostgreSQL (db.t3.micro)** đặt trong **Private Subnet** của VPC. Không mở ra Internet.
4. **Cache (Redis)**:
   - Cài đặt Redis trực tiếp bằng Docker trên con EC2 của Backend để tiết kiệm tài nguyên và giữ chi phí ở mức $0.
5. **Giám sát & Chi phí**:
   - Vẫn áp dụng **AWS CloudWatch** để theo dõi RAM/CPU của EC2 và **AWS Budget (Giới hạn 0.01$)** để cảnh báo sớm nếu lố tiền.

---

## 2. Các bước triển khai chi tiết

### Giai đoạn 1: Mạng (VPC) & Database (Amazon RDS)
1. Tạo **Custom VPC** (`10.0.0.0/16`) với Public Subnet (cho EC2) và Private Subnet (cho RDS).
2. Tạo **Amazon RDS (PostgreSQL)** nằm sâu trong Private Subnet.
3. Cấu hình **Security Group** cho RDS: Chỉ cho phép kết nối Port 5432 từ Security Group của EC2.
4. Setup dữ liệu: Dùng `prisma migrate deploy` và `prisma db seed` để nạp dữ liệu mẫu vào RDS (thực hiện từ bên trong EC2).

### Giai đoạn 2: Triển khai Backend (Amazon EC2)
1. Tạo instance **EC2 (Ubuntu)**, gắn Elastic IP (IP tĩnh miễn phí) để IP không đổi khi reset máy.
2. Cấu hình Security Group cho EC2: Mở Port 22 (SSH), 80 (HTTP) và 443 (HTTPS).
3. SSH vào EC2, cài đặt: Node.js, PM2 (quản lý tiến trình) và Nginx (Reverse Proxy).
4. Cài đặt Redis-server trực tiếp trên EC2.
5. Clone code backend từ Github về, chạy lệnh `npm install`, cấu hình file `.env` trỏ tới RDS và Redis cục bộ.
6. Dùng **PM2** để chạy server (`pm2 start src/server.js`), đảm bảo server tự chạy lại nếu bị crash.
7. Cấu hình Nginx chuyển tiếp request từ Port 80 sang Port 3000 của Node.js.

### Giai đoạn 3: Triển khai Frontend (S3 + CloudFront)
1. Cấu hình biến môi trường Frontend trỏ tới IP của EC2 (hoặc Domain của Backend).
2. Build code React/Vite (`pnpm build` trong thư mục `apps/fe`).
3. Tạo **S3 Bucket (Private)**. Chặn toàn bộ public access (Block all public access).
4. Upload thư mục `dist` lên S3.
5. Tạo **CloudFront Distribution**, cấu hình **OAC (Origin Access Control)** cấp quyền cho CloudFront đọc file từ S3. 
6. Thiết lập SSL miễn phí cho Frontend thông qua AWS Certificate Manager (ACM).

### Giai đoạn 4: Monitoring (Giám sát & Cảnh báo chi phí)
1. Cài đặt **CloudWatch Agent** trên EC2 để thu thập log lỗi và mức sử dụng RAM.
2. Thiết lập **AWS Budget** với hạn mức 0.01$, gửi email cảnh báo khi chạm 80% hạn mức.

---

## User Review Required

> [!TIP]
> Việc dùng **EC2 (Backend)** kết hợp **S3/CloudFront (Frontend)** và **RDS (Database)** là kiến trúc "tiêu chuẩn vàng" cho mọi Startup khi mới bắt đầu. Nó vừa có tính bảo mật cao (nhờ chia VPC và Private Subnets như yêu cầu đồ án của bạn), vừa chạy được Socket.io mượt mà, lại hoàn toàn miễn phí trong năm đầu tiên.

## Open Questions

1. Hệ thống Backend có cần sử dụng HTTPS ngay bây giờ không? (Lưu ý: Nếu Frontend dùng HTTPS trên CloudFront thì Backend cũng BẮT BUỘC phải có HTTPS, nếu không trình duyệt sẽ chặn kết nối Mixed Content. Để có HTTPS cho Backend, bạn bắt buộc phải mua 1 **Domain (Tên miền)**, tầm 30k-50k VNĐ).
2. Bạn muốn tôi làm mẫu thao tác bằng cách liệt kê danh sách lệnh, hay muốn tôi kết nối thẳng vào môi trường để tạo tự động (nếu bạn có cung cấp AWS Access Key)?
