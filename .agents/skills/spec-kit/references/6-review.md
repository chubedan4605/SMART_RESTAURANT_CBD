# Giai đoạn 6: Review (Đánh giá và Hoàn tất)

Đây là bước kiểm tra chất lượng cuối cùng trước khi bàn giao công việc cho người dùng và chuẩn bị commit code.

## 1. Quy chuẩn chuẩn bị Commit (Pre-Commit Protocol)
Khi chạy các công cụ format tự động trong monorepo, định dạng có thể bị thay đổi trên các file khác mà bạn không hề chỉnh sửa. Hãy tuân thủ quy trình sau:
1. Chạy lệnh `git diff --stat` để kiểm tra toàn bộ danh sách các file bị thay đổi.
2. Chỉ tiến hành stage (`git add`) những file mà bạn **thực sự chỉnh sửa logic**.
3. Đối với các file bị formatter thay đổi ngoài ý muốn ở các module khác, hãy khôi phục lại trạng thái cũ bằng lệnh:
   ```bash
   git checkout -- <tên_file>
   ```
4. **Tuyệt đối không commit** các file nhạy cảm như `.env`, API keys, thông tin đăng nhập hoặc file khóa giải mã `.env.key`.

## 2. Quy chuẩn đặt tên Commit & PR
Hệ thống sử dụng Conventional Commits. Hãy viết commit message và tiêu đề PR theo đúng định dạng:
* **Commit Message**: `type(scope): summary`
  - Các loại type được dùng: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
  - **Scope**: Phải là tên module hoặc component bị ảnh hưởng (ví dụ: `be/tenant`, `fe/chat`), **tuyệt đối không dùng Jira Ticket ID làm scope**.
  - Ví dụ đúng: `feat(be/tenant): add bulk import endpoint`
  - Ví dụ sai: `feat(TICKET-123): fix error`
* **PR Title**: Phải có dạng `[TICKET-ID] Ticket name` (ví dụ: `[FIT-102] Implement teacher invitation accept flow`).
* **Squash Merge**: Khi PR được merge vào nhánh chính (main), commit duy nhất được tạo ra sẽ trùng với tiêu đề PR.

## 3. Bản báo cáo bàn giao
Viết báo cáo ngắn gọn tóm tắt:
1. Danh sách các file đã thay đổi (kèm link click được).
2. Kết quả kiểm tra chất lượng (Quality Gate pass).
3. Hướng dẫn chạy thử nghiệm hoặc kiểm tra kết quả dành cho người dùng.
