# Giai đoạn 3: Analyze (Phân tích kỹ thuật & Thiết kế giải pháp)

Trong giai đoạn này, bạn phải biến các yêu cầu nghiệp vụ đã được làm rõ thành thiết kế kiến trúc kỹ thuật chi tiết.

## Quy trình làm việc:
1. **Khảo sát mã nguồn**:
   - Sử dụng công cụ grep hoặc tìm kiếm file để xác định chính xác các tệp tin hiện tại cần sửa đổi.
   - Hiểu rõ các pattern thiết kế, kiến trúc hiện tại của dự án (ví dụ: Controller-Service-Model ở backend, Component-Service ở frontend).
   - **⚠️ Kiểm tra giới hạn file (200-line limit)**: Kiểm tra xem các file đích cần chỉnh sửa có vượt quá hoặc sắp vượt quá 200 dòng hay không. Nếu có, hãy lên phương án modularize (tách module, tạo helper hoặc service chuyên biệt) thay vì nhồi nhét thêm code.

2. **Xác định thứ tự phát triển (Dependency Order)**:
   Nếu tính năng yêu cầu thay đổi ở nhiều tầng công nghệ (cross-repo/cross-app), bạn **phải** phát triển theo đúng thứ tự phụ thuộc từ dưới lên:
   ```
   Agentic (FastAPI) ➔ AI-Services (NestJS) ➔ BE (Express) ➔ FE (React)
   ```
   *Lưu ý:* Khi thay đổi API DTO, hãy đảm bảo cập nhật đồng bộ cấu trúc dữ liệu ở cả 4 repository.

3. **Thiết kế cơ sở dữ liệu (nếu có)**:
   - Xác định các thay đổi về bảng, cột, kiểu dữ liệu.
   - Lập kế hoạch viết file Migration (Sequelize) để đảm bảo tính đồng bộ dữ liệu.

4. **Thiết kế API**:
   - Xác định rõ Endpoint, Method (GET, POST, PUT, DELETE).
   - Định nghĩa cấu trúc Request Body, Query Parameters và Response JSON mẫu.

5. **Trình bày giải pháp**:
   - Trình bày giải pháp kỹ thuật của bạn cho người dùng một cách rõ ràng và khoa học.
   - Nhận phản hồi của người dùng và điều chỉnh nếu cần thiết. Chỉ chuyển sang giai đoạn **Implement** khi giải pháp đã được người dùng thông qua.
