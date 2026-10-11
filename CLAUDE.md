Hãy đóng vai một Senior System Analyst đang làm việc trong dự án "smart-restaurant". Nhiệm vụ của bạn là viết một bản đặc tả tính năng (feature specification) dài 1 trang cho tính năng "chia hóa đơn tại bàn" (splitting the bill at a table).

Dưới đây là bối cảnh:
- Một bàn có một order đang mở với nhiều món ăn, đã có giá và bao gồm VAT.
- Khách hàng muốn thanh toán riêng (chia tiền), mỗi người thanh toán trên điện thoại của họ.
- Phía nhà bếp không bị ảnh hưởng; order vẫn mở cho đến khi mọi phần tiền (share) đều được thanh toán xong.
- Bản đặc tả BẮT BUỘC phải theo chính xác template sau (bằng tiếng Anh):
  # Split the bill
  Status: draft · Owner: [Tên của bạn] · Feature of: smart-restaurant
  ## Goal
  ## Out of scope
  ## Flow
  ## Contract
  ## Data
  ## Errors
  ## Acceptance
  ## Constraints

Trước khi viết toàn bộ bản spec, hãy cho tôi một dàn ý chi tiết (dạng gạch đầu dòng) về những gì bạn sẽ viết cho từng phần. Hãy đặc biệt chú ý đến phần "Out of scope", "Contract" và "Acceptance" để đảm bảo chúng ta xử lý được các trường hợp ngoại lệ (edge cases) như: vấn đề làm tròn số (ai trả phần tiền lẻ dư ra?), xử lý đồng thời (hai người cùng bấm thanh toán một lúc), và lỗi thanh toán một phần. 

Đừng viết bản spec hoàn chỉnh vội, chỉ đưa ra dàn ý để chúng ta chốt trước. (Lưu ý: Dàn ý hãy viết bằng tiếng Anh).







Dàn ý rất ổn. Bây giờ, hãy viết bản nháp đầu tiên bằng tiếng Anh cho các phần sau của file `spec.md`:
1. Header, Goal, Out of scope
2. Flow
3. Data
4. Constraints

Yêu cầu bắt buộc dựa trên rubric chấm điểm của tôi:
- Phần "Out of scope" (Non-goals) phải cực kỳ rõ ràng để chặn việc phình to phạm vi (scope creep). Phải nói rõ rằng tính năng này KHÔNG hỗ trợ chia tiền theo từng món ăn (split by item), KHÔNG hoàn tiền (no refunds) cho các phần thanh toán bị lỗi, v.v.
- Xử lý vấn đề quyền hạn (Permissions): ai có quyền chia bill (bất kỳ ai tại bàn hay chỉ người tạo)?
- Hành văn ngắn gọn, đi thẳng vào vấn đề.






Tiếp theo, hãy viết phần `## Contract` và `## Errors` bằng tiếng Anh.

Yêu cầu dựa trên rubric (25 điểm cho phần Contract):
- Đưa ra endpoints cụ thể (ví dụ: POST /api/tables/:id/bill/split).
- Viết chính xác JSON payloads cho Request và Response.
- Bắt buộc phải có trường `idempotencyKey` trong request để xử lý thanh toán đồng thời/gọi lại (retries).
- Liệt kê các HTTP status codes cụ thể (201, 409, 422, v.v.).
- Lỗi trả về (Error responses) PHẢI có cấu trúc được định nghĩa tên rõ ràng (ví dụ: { "error": "split_exists", "splitId": 42 }).
- Trong phần `## Errors`, phải map các điều kiện lỗi với "những gì user nhìn thấy" và "những gì hệ thống xử lý bên dưới". Bao gồm các trường hợp: giới hạn (limits), trạng thái rỗng (empty states), và lỗi một phần (partial failures).





Bây giờ, hãy viết phần `## Acceptance` bằng tiếng Anh. 

Yêu cầu dựa trên rubric (25 điểm cho Acceptance Criteria):
- TUYỆT ĐỐI KHÔNG viết các tiêu chí mang tính mong muốn chung chung như "splitting works correctly".
- MỖI tiêu chí (criterion) phải sử dụng các con số/giá trị thực tế và có thể chuyển trực tiếp thành 1 test case.
- Phải cover ít nhất 3 trường hợp sau:
  1. Bài toán số học khi chia tiền (Ví dụ: chia hóa đơn 400.000đ cho 3 người - phần tiền lẻ 1 đồng xử lý thế nào?).
  2. Một luồng thất bại (Ví dụ: một phần share bị lỗi thanh toán thì các phần khác ra sao).
  3. Một trường hợp xử lý đồng thời (Ví dụ: 2 request cùng thanh toán cho 1 phần share gửi đến cùng 1 mili-giây).
Sử dụng format: "✓ AC1: [Condition] produces [Expected Concrete Result]"






Hãy ghép tất cả các phần trên lại thành một file markdown duy nhất (`spec.md`) bằng tiếng Anh. Đảm bảo độ dài khoảng 1 trang (ngắn gọn, mật độ thông tin cao).

Trước khi chốt file, hãy rà soát lại theo tiêu chí "The 5 thin places" (5 điểm mù của spec). Bản spec này phải giải quyết rõ ràng ít nhất 4 trong 5 điểm sau:
1. Empty and first-run states (Trạng thái rỗng/lần chạy đầu)
2. Partial failure (Lỗi một phần)
3. Permissions (Quyền hạn)
4. Concurrency and duplicates (Xử lý đồng thời và trùng lặp)
5. Limits (Giới hạn, ví dụ: tối đa chia được cho bao nhiêu người)

Nếu phần nào còn thiếu hoặc chưa rõ ràng, hãy tự động điều chỉnh lại `spec.md` để bổ sung. Sau đó hãy in ra toàn bộ nội dung file `spec.md` cuối cùng.






Dựa vào file `spec.md` chúng ta vừa tạo, hãy sinh ra file `SELF_ASSESSMENT_REPORT.md` (bằng tiếng Anh) để tôi nộp bài. 
Mục tiêu của tôi là đạt 100/100 điểm (ngoại trừ phần Revision tôi sẽ làm sau). 

Hãy format nó dưới dạng Markdown table với các cột: `#`, `Criterion`, `Points Claimed`, và `Evidence`.

- Đối với Contract (25/25): Trích dẫn chính xác các dòng/phần hiển thị concrete endpoints, JSON payloads, status codes, và error shapes.
- Đối với Acceptance criteria (25/25): Trích dẫn các ACs có sử dụng concrete values, phép toán chia, failure path, và concurrency.
- Đối với Edge cases and non-goals (20/20): Trích dẫn xem phần "Out of scope" nằm ở đâu, và chỉ ra vị trí giải quyết được 4/5 "thin places".
- Đối với Implementability (20/20): Tạm thời tự chấm 20/20.
- Đối với Revision (0/10): Tạm thời để 0 điểm (vì đây là lần nộp đầu tiên trước khi tráo bài với bạn khác). Thêm một note: "Will be completed in the final submission".
- Cuối file thêm một câu ngắn về "what I did not manage" (ví dụ: chưa làm phần revision).

Hãy in ra toàn bộ nội dung file `SELF_ASSESSMENT_REPORT.md`.



