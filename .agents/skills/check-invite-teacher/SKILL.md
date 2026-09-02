---
name: check-invite-teacher
description: "Kiểm tra toàn diện luồng mời giảng viên (invite teacher) trong phần onboarding tạo tenant/lớp học. Dùng khi có thay đổi liên quan đến feature mời giảng viên, hoặc khi cần debug/verify luồng này đang hoạt động đúng."
---

# Skill: Check Luồng Mời Giảng Viên (Invite Teacher)

Skill này kiểm tra **toàn bộ luồng mời giảng viên** từ FE → BE → SSO → Email, bao gồm cả flow khi tạo tenant mới (onboarding) và flow mời thêm giảng viên vào lớp đã có.

---

## Bối cảnh hệ thống

### Hai luồng mời giảng viên tồn tại song song:

| Luồng | Nơi kích hoạt | Endpoint |
|---|---|---|
| **Onboarding Wizard** (bước 1 - Invite Admin) | `first-login/OnboardingWizard` — Step 1 | Chỉ thêm vào local state, **không gọi API** |
| **Invite Teacher (Lớp đã tạo)** | HR page / Tenant Detail | `POST /:tenantID/teachers/invite` |

### Stack công nghệ liên quan:
- **FE**: React + MUI + `react-dropzone` (upload CSV sinh viên) + i18next
- **BE**: Express + Sequelize + SSO (Stack Auth) + SendGrid
- **SSO**: Stack Auth (`/api/v1/team-invitations/send-code`) — gửi email invitation
- **Email**: Gửi qua SendGrid channel (template `EmailTenantInvitation.html`)
- **Auth**: `firstLoginAuth` middleware cho accept invitation; `auth` cho invite

---

## Bước 1: Xác định phạm vi kiểm tra

Hỏi người dùng muốn kiểm tra điều gì:

- **A)** Luồng onboarding mới (tạo tenant → mời admin → import sinh viên)
- **B)** Luồng mời giảng viên vào lớp đã có (`/:tenantID/teachers/invite`)
- **C)** Cả hai luồng
- **D)** Một bug/issue cụ thể (người dùng mô tả thêm)

---

## Bước 2: Kiểm tra FE

### 2a. Onboarding Wizard (Luồng A)

Đọc file:
- `apps/fe/src/pages/first-login/components/OnboardingWizard/index.js`
- `apps/fe/src/pages/first-login/components/ImportUsersStep/index.js`

Kiểm tra:
1. **Step 1 - Invite Admin**: Bước invite trong wizard (activeStep === 1) có thực sự gọi API không?
   ⚠️ QUAN TRỌNG: Hiện tại chỉ thêm vào local `invitationList` state — **không gọi API sendInvitation**. Đây là intentional hay thiếu?
2. **Step 2 - Import Users**: `ImportUsersStep` gọi `importStudentList` từ `TenantService` — kiểm tra CSV/XLSX parsing với `parseCSVToRows`, file size limit (5MB), accepted types
3. **State flow**: `wizardData.tenantID` phải tồn tại khi vào Step 1 — kiểm tra nếu không có thì UX báo lỗi thế nào
4. **i18n keys**: Các label đang dùng fallback string hay có i18n key đầy đủ? (`first-login.invite.*`, `first-login.import.*`)

### 2b. HR / Tenant Invitation Page

Đọc files:
- `apps/fe/src/pages/hr/index.js`
- `apps/fe/src/pages/tenant/tenant-invitation/index.js`
- `apps/fe/src/service/TenantService.js` (tìm hàm gọi invite teacher)

Kiểm tra:
1. Hàm gọi `POST /:tenantID/teachers/invite` có được gọi đúng không?
2. Trang `tenant-invitation` nhận `?code=...` từ email — xử lý accept/decline có đúng không?
3. Role label: invitation `role === "TEACHER"` có hiển thị đúng label "Giảng viên" không?

---

## Bước 3: Kiểm tra BE

### 3a. Controller — `inviteTeacher`

File: `apps/be/src/components/tenant/tenant.controller.js` (line ~605)

Checklist:
```
[ ] Validation: tenantID + email đều bắt buộc
[ ] Email normalization: trim + toLowerCase
[ ] Email format validation: gọi validateEmail()
[ ] Authorization: chỉ FACULTY_ADMIN hoặc SYSTEM_ADMIN mới được invite (globalRoles)
[ ] Duplicate check: isTeacherExistInClass (CSService.findCSByEmailAndTenantID)
[ ] Pending invitation check: findInvitationByEmailAndTenant — trả CONFLICT nếu đã PENDING
[ ] SSO call: ssoService.sendEmailToInviteMember với teamID, email, callbackUrl
[ ] Fallback nếu SSO trả về không có id: trả BAD_GATEWAY
[ ] handleInvitationStatus: tạo invitation record với role = ROLE.TEACHER
[ ] completeMilestone: async (setImmediate) — không block response
```

### 3b. Invitation Service

File: `apps/be/src/components/invitation/invitation.service.js`

Kiểm tra:
1. `handleInvitationStatus`: logic 3 cases — (1) chưa có → tạo mới, (2) expired → extend, (3) pending → trả CONFLICT
2. `createInvitation`: có `status: PENDING` và `expiresAt` không?
3. `resendInvitation`: có xóa SSO invitation cũ trước khi tạo mới không?
4. `getInvitationRoleLabel`: label TEACHER hiển thị "Giảng viên" đúng không?

### 3c. SSO Service

File: `apps/be/src/components/auth/sso.service.js` (line ~273)

Kiểm tra:
1. `callbackUrl` lấy từ `process.env.FRONTEND_URL || process.env.BASE_URL` + `/tenant/invitation` — env vars có set đúng không?
2. Headers dùng `serverHeadersFormat` nếu có `ssoSecretServerKey`, fallback dùng access token
3. Endpoint Stack Auth: `POST /api/v1/team-invitations/send-code`
4. Nếu `ssoApiUrl` hoặc `ssoProjectId` trống → trả `null` — có gây silent fail không?

### 3d. Route

File: `apps/be/src/components/tenant/tenant.route.js`

Xác nhận các routes:
```
POST /tenant/:tenantID/teachers/invite          → auth + inviteTeacher
POST /tenant/:tenantID/students/import          → auth + studentListUpload + importStudentList
POST /tenant/:tenantID/teachers/send-onboarding → auth + sendTeacherOnboarding
POST /tenant/invitation/accept                  → firstLoginAuth + acceptTenantInvitation
POST /tenant/invitation/resend                  → auth + resendInvitation (ở invitation route)
```

---

## Bước 4: Kiểm tra Email Template

File: `apps/be/src/resource/EmailHTMLTemplate/EmailTenantInvitation.html`

Kiểm tra:
1. Template có đủ placeholders: `{{tenantName}}`, `{{inviteLink}}`, `{{invitedUserRole}}`
2. `inviteLink` format: `${FRONTEND_URL}/tenant/invitation/${invitationID}`
3. Logo attachment CID: `cid:logo` — có match với attachment config không?

---

## Bước 5: Kiểm tra Accept Flow

File: `apps/be/src/components/tenant/tenant.controller.js` (tìm `acceptTenantInvitation`)
File: `apps/fe/src/pages/tenant/tenant-invitation/index.js`

Flow khi giảng viên click link trong email:
1. FE nhận `?code=...` từ URL
2. Nếu chưa đăng nhập → redirect đến SSO signin với returnTo
3. Sau login → FE gọi `POST /tenant/invitation/accept` với `{ code }`
4. BE gọi `ssoService.getTeamInvitationDetails(code, token)` → lấy tenantID từ SSO
5. Tạo/update `CustomerSupport` record với role TEACHER
6. Update invitation status → ACCEPTED
7. FE redirect vào hệ thống

---

## Bước 6: Tổng hợp kết quả

Sau khi kiểm tra tất cả, đưa ra báo cáo:

```
## Báo cáo: Luồng Mời Giảng Viên

### ✅ Đang hoạt động đúng
- ...

### ⚠️ Điểm cần chú ý
- file:line — Mô tả. Gợi ý fix.

### ❌ Lỗi / Thiếu sót nghiêm trọng
- file:line — Mô tả lỗi. Cần fix: ...

### 💡 Gợi ý cải thiện
- ...
```

---

## Lưu ý quan trọng

- **Onboarding Wizard Step 1**: Chỉ lưu local state, **KHÔNG gọi API**. Xác nhận với team đây có phải ý định hay cần implement.
- **Role TEACHER vs ADMIN**: `inviteTeacher` dùng `ROLE.TEACHER`, `inviteTenant` (general) dùng role truyền vào. Không nhầm lẫn.
- **Authorization**: `inviteTeacher` yêu cầu `FACULTY_ADMIN` hoặc `SYSTEM_ADMIN` trong `globalRoles` (không phải `role` trong tenant).
- **SSO dependency**: Nếu `STACK_AUTH_API_URL` hoặc `STACK_AUTH_PROJECT_ID` không configured → mọi invitation fail silently (trả `null`).
