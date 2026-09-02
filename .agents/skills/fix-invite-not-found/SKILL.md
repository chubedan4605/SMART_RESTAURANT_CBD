---
name: fix-invite-not-found
description: "Hướng dẫn sửa lỗi 'Không tìm thấy' (Not Found) khi click vào email nhận lớp / tenant. Hướng dẫn sửa đồng bộ link format ở BE/FE và chuẩn hóa email case-sensitivity."
---

# Skill: Fix Lỗi "Không Tìm Thấy" Khi Nhấn Link Nhận Lớp / Tenant

Tài liệu này hướng dẫn cách sửa lỗi **"Không tìm thấy" (Not Found)** xảy ra khi giảng viên hoặc CS Agent nhận được email mời nhận lớp/tenant, click vào link nhưng hệ thống báo lỗi không tìm thấy lời mời.

---

## 🔍 Nguyên Nhân Gốc Rễ

Lỗi này xuất phát từ hai nguyên nhân chính:

### 1. Sai lệch định dạng URL (URL Mismatch) trong Resend Flow
* **Hiện tại ở Backend (resend flow):** Khi gửi lại lời mời qua email, backend tạo link dưới dạng:
  `${getInvitationCallbackUrl()}/${invitationID}` -> Kết quả: `http://localhost:3006/tenant/invitation/some-id`
* **Hiện tại ở Frontend:** Route `/tenant/invitation` chỉ được định nghĩa dạng tĩnh (static):
  `path="/tenant/invitation"` và component `TenantInvitationPage` mong đợi code được truyền qua query parameter:
  `const [code] = useState(searchParams.get("code"));` (tức là URL phải có dạng `http://localhost:3006/tenant/invitation?code=some-id`).
* **Hậu quả:** Khi click vào link dạng path-based (`/tenant/invitation/some-id`), React Router không tìm thấy route khớp nên chuyển hướng đến trang 404 (Không tìm thấy).

### 2. Phân biệt chữ hoa/chữ thường ở Email (Case-Sensitivity Mismatch)
* **Hiện tại ở Backend (invite flow):** Khi lưu lời mời, email được chuyển về chữ thường:
  `const normalizedEmail = String(email).trim().toLowerCase();`
* **Hiện tại ở Backend (accept/decline/info flow):** Khi giảng viên click link và đăng nhập, backend lấy email từ tài khoản SSO hiện tại (`req.user.email`) và tìm kiếm trực tiếp trong database mà **không chuyển về lowercase**:
  ```javascript
  const invitation = await InvitationService.findAnyInvitationByEmailAndTenant({
      email, // req.user.email
      tenantID: teamInvitation.team_id,
  });
  ```
* **Hậu quả:** Nếu tài khoản đăng nhập chứa chữ viết hoa (ví dụ: `GiaoVien@gmail.com`), cơ sở dữ liệu PostgreSQL/MySQL (case-sensitive) sẽ trả về `null` -> Trả về lỗi `NOT_FOUND` (Không tìm thấy lời mời).

---

## 🛠️ Hướng Dẫn Sửa Lỗi Chi Tiết

Thực hiện các bước sửa đổi dưới đây để khắc phục cả hai nguyên nhân trên một cách an toàn nhất.

### Bước 1: Sửa định dạng link gửi lại ở Backend

Mở file [invitation.service.js](file:///home/pognova/projects/FIT-AI/apps/be/src/components/invitation/invitation.service.js) và thay đổi cách tạo `inviteLink` ở dòng 259.

```diff
-    const inviteLink = `${getInvitationCallbackUrl()}/${invitationID}`;
+    const inviteLink = `${getInvitationCallbackUrl()}?code=${invitationID}`;
```

### Bước 2: Chuẩn hóa email trong các API xử lý Invitation ở Backend

Mở file [tenant.controller.js](file:///home/pognova/projects/FIT-AI/apps/be/src/components/tenant/tenant.controller.js) và thực hiện các cập nhật sau:

#### 1. Sửa hàm `acceptTenantInvitation` (khoảng dòng 750)
```diff
        const { code } = req.body;
        const { email } = req.user;
        const teamInvitation = await ssoService.getTeamInvitationDetails(
            code,
            getToken(req.headers),
        );
+       const normalizedEmail = String(email).trim().toLowerCase();
        const invitation =
            await InvitationService.findAnyInvitationByEmailAndTenant({
-               email,
+               email: normalizedEmail,
                tenantID: teamInvitation.team_id,
            });
```

#### 2. Sửa hàm `declineTenantInvitation` (khoảng dòng 853)
```diff
        const { code } = req.body;
        const { email } = req.user;
        const teamInvitation = await ssoService.getTeamInvitationDetails(
            code,
            getToken(req.headers),
        );
+       const normalizedEmail = String(email).trim().toLowerCase();
        const invitation =
            await InvitationService.findAnyInvitationByEmailAndTenant({
-               email,
+               email: normalizedEmail,
                tenantID: teamInvitation.team_id,
            });
```

#### 3. Sửa hàm `getTenantJoinInfo` (khoảng dòng 900)
```diff
        const { code } = req.query;
        const { email } = req.user;

        const teamInvitation = await ssoService.getTeamInvitationDetails(
            code,
            getToken(req.headers),
        );
+       const normalizedEmail = String(email).trim().toLowerCase();
        const invitation =
            await InvitationService.findAnyInvitationByEmailAndTenant({
-               email,
+               email: normalizedEmail,
                tenantID: teamInvitation.team_id,
            });
```

---

## 🧪 Quy Trình Thử Nghiệm & Xác Minh (Verification)

Sau khi sửa xong code, hãy tiến hành kiểm tra theo quy trình sau:

1. **Test Gửi Lời Mời Mới:**
   * Vào giao diện Admin, thực hiện gửi lời mời đến một email bất kỳ (ví dụ: `test.gv@gmail.com`).
   * Kiểm tra email nhận được, click vào link mời và đảm bảo chuyển hướng đến trang `/tenant/invitation?code=...` thành công (không bị lỗi 404).

2. **Test Gửi Lại Lời Mới (Resend):**
   * Vào danh sách lời mời chờ duyệt, nhấn nút **Gửi lại**.
   * Kiểm tra email nhận được, click vào link mời dạng `?code=...` và xem có hiển thị form xác nhận nhận lớp không.

3. **Test Trường Hợp Email Viết Hoa (Case-Sensitivity):**
   * Mời một tài khoản có email viết hoa/thường lẫn lộn (ví dụ: `GiaoVien.Test@Fit.Edu.Vn`).
   * Đăng nhập tài khoản đó và bấm chấp nhận lời mời để đảm bảo database so khớp thành công và không báo lỗi "Không tìm thấy lời mời".
