---
name: feature-test-and-fix
description: "Sau khi implement một feature, tự động chạy test, nếu có lỗi thì phân tích và tự sửa, rồi chạy lại cho đến khi pass. Dùng sau mỗi lần viết code mới hoặc sửa bug."
---

# Skill: Test → Lỗi → Sửa → Test lại (tự động)

Skill này chạy sau mỗi lần implement feature. Vòng lặp: **chạy test → phân tích lỗi → tự sửa → chạy lại** cho đến khi pass hoặc xác định cần can thiệp thủ công.

---

## Bước 1: Xác định repo và test command

Dựa vào file vừa thay đổi, xác định repo:

| Repo | Test command | Cwd |
|---|---|---|
| `apps/fe` | `cd apps/fe && npm test -- --watchAll=false --passWithNoTests 2>&1` | root |
| `apps/be` | `cd apps/be && npm test 2>&1` | root |
| `apps/ai-services` | `cd apps/ai-services && yarn test 2>&1` | root |
| `apps/agentic` | `cd apps/agentic && poetry run pytest -x 2>&1` | root |

Nếu không rõ repo → hỏi người dùng hoặc dùng `git diff --name-only HEAD` để detect.

---

## Bước 2: Chạy test lần đầu

```bash
# Ví dụ với BE
cd apps/be && npm test 2>&1 | tail -50
```

Nếu **tất cả pass** → báo cáo ✅ và dừng.

Nếu **có lỗi** → tiếp tục Bước 3.

---

## Bước 3: Phân tích lỗi

Đọc kỹ output lỗi. Phân loại:

### A. Lỗi có thể tự sửa (safe to auto-fix):
- **Import không tồn tại** — file bị đổi tên hoặc xóa
- **Undefined variable/function** — thiếu export hoặc typo
- **Type mismatch** — sai kiểu dữ liệu rõ ràng
- **Snapshot outdated** — chạy `--updateSnapshot`
- **Test expect sai** — test đang test behavior cũ, cần update theo code mới
- **Missing mock** — thêm mock cho dependency mới

### B. Lỗi CẦN hỏi trước khi sửa:
- **Logic test sai** — không chắc expected behavior là gì
- **Test fail vì business logic thay đổi** — cần xác nhận từ người dùng
- **Database/migration error** — có thể ảnh hưởng data
- **Nhiều hơn 5 file test fail** — scope quá lớn, cần review

---

## Bước 4: Tự sửa (với loại A)

Với mỗi lỗi loại A:
1. Đọc file test bị fail
2. Đọc file source liên quan
3. Xác định root cause
4. Áp dụng fix nhỏ, nhắm mục tiêu
5. **KHÔNG sửa logic nghiệp vụ** — chỉ sửa để test match với implementation mới

**Giới hạn an toàn:**
- Tối đa **3 vòng lặp** tự sửa
- Nếu sau 3 vòng vẫn fail → dừng, báo cáo chi tiết để người dùng can thiệp
- Nếu fix của một lỗi có thể ảnh hưởng >3 file → hỏi trước

---

## Bước 5: Chạy lại test

```bash
cd apps/be && npm test 2>&1 | tail -50
```

Lặp lại Bước 3-5 cho đến khi:
- ✅ Tất cả pass → tiếp tục Bước 6
- ❌ Sau 3 vòng vẫn fail → dừng, báo cáo (Bước 7B)

---

## Bước 6: Khi tất cả test pass

Chạy thêm lint để đảm bảo code sạch:

```bash
# FE/BE: lint chỉ file đã thay đổi
CHANGED=$(git diff --name-only HEAD -- '*.js' '*.jsx')
if [ -n "$CHANGED" ]; then
  echo "$CHANGED" | xargs npx eslint --fix 2>&1
fi
```

Sau đó báo cáo kết quả (Bước 7A).

---

## Bước 7A: Báo cáo khi PASS

```
## ✅ Test Pass

**Repo**: apps/be
**Vòng lặp**: 2 (1 lần fix)
**Test**: 47 passed, 0 failed

### Đã tự sửa:
- `tests/tenant.test.js:23` — Cập nhật mock response theo API mới
- `tests/invitation.test.js:58` — Thêm field `role` vào expected object

### Sẵn sàng commit.
```

---

## Bước 7B: Báo cáo khi FAIL (cần can thiệp)

```
## ❌ Cần can thiệp thủ công

**Repo**: apps/be
**Vòng lặp**: 3 (đã thử tự sửa, vẫn fail)

### Lỗi còn lại:
- `tests/auth.test.js:112`
  ```
  Expected: { status: "OK", data: {...} }
  Received: { status: "UNAUTHORIZED" }
  ```
  **Nguyên nhân có thể**: Middleware `firstLoginAuth` trả về 401, test chưa mock đúng token.
  **Gợi ý fix**: Thêm mock `passport.authenticate` hoặc dùng `auth` middleware thay thế.

### Không tự động commit.
```

---

## Lưu ý quan trọng

- **KHÔNG bao giờ xóa test** để test pass — đó là che giấu lỗi
- **KHÔNG sửa logic source** chỉ để test không fail — test phản ánh behavior thật
- **Nếu không chắc** behavior đúng là gì → hỏi người dùng
- **Snapshot tests**: update snapshot chỉ khi UI thay đổi có chủ ý
