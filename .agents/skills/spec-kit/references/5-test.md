# Giai đoạn 5: Test (Kiểm thử mã nguồn)

Mọi thay đổi code bắt buộc phải vượt qua các cổng kiểm soát chất lượng (Quality Gates) của dự án trước khi có thể commit.

## 1. Chạy Quality Gates theo từng Repository/App
Tùy thuộc vào ứng dụng bạn vừa chỉnh sửa, bạn phải chạy lệnh Quality Gate tương ứng để tự động Format ➔ Lint ➔ Test:

| Ứng dụng | Đường dẫn | Lệnh chạy Quality Gate | Lệnh chạy Dev |
| :--- | :--- | :--- | :--- |
| **Frontend (FE)** | `apps/fe` | `pnpm quality:fe` | `pnpm dev:fe` |
| **Backend (BE)** | `apps/be` | `pnpm quality:be` | `pnpm dev:be` |
| **AI-Services** | `apps/ai-services` | `pnpm quality:ai-services` | `pnpm dev:ai-services` |
| **Agentic Service** | `apps/agentic` | `pnpm quality:agentic` | `pnpm dev:agentic` |

*Lưu ý:* Bắt buộc chạy Quality Gate ngay sau khi chỉnh sửa xong code của ứng dụng đó.

## 2. Quy trình tự sửa lỗi (Self-Fix Loop)
Nếu lệnh Quality Gate báo lỗi (lỗi cú pháp, lỗi lint, test failed):
1. Đọc và phân tích kỹ log lỗi/stack trace.
2. Sửa trực tiếp trên file code bị ảnh hưởng.
3. Chạy lại lệnh Quality Gate.
4. Lặp lại quá trình này cho đến khi cổng kiểm soát chất lượng báo thành công 100%. Không bao giờ bàn giao code bị lỗi build hoặc lỗi test cho người dùng.
