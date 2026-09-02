# Giai đoạn 2: Clarify (Làm rõ các điểm mơ hồ)

Giai đoạn này giúp bạn đảm bảo rằng bạn và người dùng hoàn toàn đồng thuận về cách hoạt động của tính năng trước khi tiến hành thiết kế và lập trình.

## Quy trình làm việc:
1. **Tìm kiếm các điểm chưa rõ ràng**:
   - Các trường hợp biên (edge cases).
   - Thiết kế UI/UX mong muốn (màu sắc, cấu trúc hiển thị).
   - Xử lý lỗi (error handling) khi API thất bại hoặc dữ liệu không hợp lệ.
   - Các ràng buộc về quyền truy cập (RBAC - Role-Based Access Control).
2. **Gom nhóm câu hỏi**:
   - Tránh hỏi lặt vặt nhiều lần. Hãy tổng hợp toàn bộ các thắc mắc thành một danh sách ngắn gọn, rõ ràng.
   - Sắp xếp câu hỏi theo thứ tự quan trọng từ cao xuống thấp.
3. **Sử dụng công cụ tương tác**:
   - Ưu tiên sử dụng công cụ `ask_question` để tạo giao diện trọn gói trắc nghiệm hoặc nhập câu trả lời cho người dùng.
4. **Không giả định**: Tuyệt đối không tự ý quyết định các vấn đề nghiệp vụ quan trọng mà không có sự xác nhận của người dùng.
