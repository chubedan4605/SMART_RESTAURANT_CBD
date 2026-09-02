# Giai đoạn 4: Implement (Hiện thực hóa viết code)

Giai đoạn này là lúc bạn tiến hành viết mã nguồn dựa trên thiết kế đã thống nhất. Hãy đảm bảo tính sạch sẽ, tối ưu và nhất quán của code.

## 1. Nguyên tắc viết code thiêng liêng (Sacred Principles)
* **YAGNI (You Aren't Gonna Need It)**: Không phát triển bất kỳ tính năng hoặc viết thêm đoạn code nào ngoài phạm vi của kế hoạch/ticket hiện tại.
* **KISS (Keep It Simple, Stupid)**: Giải pháp đơn giản nhất là giải pháp tốt nhất. Tránh viết code quá phức tạp, trừu tượng hóa quá mức.
* **DRY (Don't Repeat Yourself)**: Chỉ tiến hành trích xuất/viết hàm dùng chung (common abstraction) khi một đoạn code bị lặp lại từ **3 lần trở lên**. Lặp lại 2 lần vẫn tốt hơn việc tạo ra sự trừu tượng hóa non nớt (premature abstraction).

## 2. Quản lý File và Đặt tên
* **Giới hạn 200 dòng (200-line limit)**: Bắt buộc không để file code vượt quá 200 dòng. Nếu file vượt quá 200 dòng:
  - Tách thành các component nhỏ, tập trung.
  - Trích xuất các hàm utility ra file helper riêng.
  - Tạo các class service riêng cho logic nghiệp vụ.
* **Cập nhật trực tiếp, không sao chép**: Chỉnh sửa trực tiếp trên file hiện có. Tuyệt đối không tạo bản sao dạng "enhanced", "v2", hoặc "copy" của file cũ.
* **Quy chuẩn đặt tên (Naming Convention)**:
  - Sử dụng **kebab-case** cho tên tệp tin JS/TS/Python/Shell.
  - Sử dụng **PascalCase** cho tên component React.
  - Đảm bảo tên file tự giải thích mục đích của nó để dễ dàng tìm kiếm qua Grep/Glob.

## 3. Chất lượng Code
* **Không đi tắt (No shortcuts)**: Không tạo dữ liệu giả (fake data), stub, mock hoặc các giải pháp tạm thời chỉ để vượt qua CI/Test. Code viết ra phải là code chạy thật và hoàn chỉnh.
* **Xử lý lỗi tường minh (Error handling)**: Bắt buộc phải có khối try-catch hoặc cơ chế catch lỗi rõ ràng cho mọi hoạt động bất đồng bộ (async operation). Không để lỗi xảy ra trong âm lặng (no silent failures).
* **Kiểm tra dữ liệu đầu vào (Input validation)**: Thực hiện kiểm tra, xác thực dữ liệu tại ranh giới hệ thống (system boundaries) như API endpoint, input của user. Không cần validate ở các hàm gọi nội bộ.
* **An toàn kiểu dữ liệu (Type safety)**: Hạn chế tối đa sử dụng kiểu `any` trong TypeScript nếu không có lý do thực sự chính đáng. Sử dụng Pydantic models trong Python để định nghĩa dữ liệu.
* **Kiểm soát sửa đổi**: Sử dụng `replace_file_content` hoặc `multi_replace_file_content` cẩn thận để tránh thay đổi không mong muốn.
