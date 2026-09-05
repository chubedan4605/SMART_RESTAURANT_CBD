# Hướng Dẫn Truy Cập Máy Chủ Backend (AWS EC2)

Tài liệu này chứa các lệnh cần thiết để kết nối (SSH) vào máy chủ EC2 đang chạy Backend của hệ thống Smart Restaurant.

## 1. Thông Tin Máy Chủ
- **Hệ điều hành:** Ubuntu
- **Địa chỉ IP:** `51.21.240.2`
- **Tài khoản mặc định:** `ubuntu`
- **Khóa bảo mật (Private Key):** `smart-restaurant-key.pem`

## 2. Cách Kết Nối (SSH)

Để truy cập vào màn hình quản trị của máy chủ EC2, bạn hãy mở Terminal (trên Mac/Linux) hoặc **Git Bash / PowerShell** (trên Windows) tại thư mục chứa file `smart-restaurant-key.pem` (thư mục gốc của dự án) và gõ lệnh sau:

```bash
ssh -i "smart-restaurant-key.pem" ubuntu@51.21.240.2
```

> **Lưu ý dành cho người dùng Windows:** 
> Nếu bạn dùng PowerShell/CMD và gặp lỗi *Permission denied (publickey)* hoặc cảnh báo *WARNING: UNPROTECTED PRIVATE KEY FILE!*, nguyên nhân là do file `.pem` của bạn đang có quyền truy cập quá rộng. Để khắc phục nhanh nhất, bạn nên mở bằng công cụ **Git Bash** thay vì PowerShell, hoặc làm theo hướng dẫn [cấp quyền giới hạn cho file PEM trên Windows](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/TroubleshootingInstancesConnecting.html#troubleshoot-unprotected-key).

## 3. Các Lệnh Quản Trị Backend Thường Dùng (Sau khi đã SSH thành công)

Sau khi màn hình đen hiện ra chữ `ubuntu@ip-...:`, bạn đã ở bên trong máy chủ. Dưới đây là các lệnh quản trị cơ bản:

**Đi tới thư mục chứa code Backend:**
```bash
cd ~/SMART_RESTAURANT_CBD/apps/be
```

**Mở file cấu hình biến môi trường (.env):**
```bash
nano ~/SMART_RESTAURANT_CBD/apps/be/.env
```
*(Bấm `Ctrl + X`, bấm `Y`, rồi `Enter` để lưu file sau khi sửa).*

**Khởi động lại Backend (PM2):**
Sau khi sửa code hoặc `.env`, bắt buộc phải chạy lệnh này để cập nhật:
```bash
pm2 restart smart-restaurant-backend
```

**Xem trạng thái của Backend:**
```bash
pm2 status
```

**Xem Log (Lịch sử lỗi) của Backend:**
```bash
pm2 logs smart-restaurant-backend
```

**Khởi động lại máy chủ Web Nginx:**
```bash
sudo systemctl restart nginx
```
