# Giai đoạn 1: Spec (Đặc tả yêu cầu ban đầu)

Khi nhận được yêu cầu phát triển hoặc chỉnh sửa từ người dùng, bạn (AI Agent) phải thực hiện phân tích yêu cầu đó một cách có hệ thống trước khi bắt đầu bất kỳ hành động code nào.

## Quy trình làm việc:
1. **Đọc kỹ đề bài**: Hiểu rõ mục tiêu cốt lõi của tính năng hoặc lỗi cần sửa.
2. **Xác định các thành phần ảnh hưởng**:
   - Phía Frontend (UI, các page, components, store/state, i18n,...).
   - Phía Backend (Routes, Controllers, Services, Models, Migrations,...).
   - Cơ sở dữ liệu (Bảng mới, cột mới, kiểu dữ liệu, các ràng buộc).
   - Tích hợp ngoại vi (SSO Stack Auth, SendGrid, Redis, v.v.).
3. **Viết tài liệu Spec sơ bộ**:
   - Ghi lại các phát hiện ban đầu của bạn vào một file Spec tạm thời.
   - Trình bày rõ ràng phạm vi công việc dự kiến (Scope of Work).
4. **Chuyển sang Giai đoạn 2 (Clarify)**:
   - Sử dụng Spec vừa lập để làm cơ sở đặt câu hỏi làm rõ các điểm mơ hồ với người dùng.
