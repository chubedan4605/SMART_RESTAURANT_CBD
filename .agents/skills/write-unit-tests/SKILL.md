---
name: write-unit-tests
description: "Sau khi implement một feature, tự động viết unit test bao gồm happy path, edge case, và error case. Dùng ngay sau khi code xong trước khi commit."
---

# Skill: Viết Unit Test cho Feature mới

Skill này viết test **sát với codebase thực tế** của FIT-AI/Jarvis. Áp dụng ngay sau khi implement xong, trước khi chạy `feature-test-and-fix`.

---

## Framework theo từng repo

| Repo | Framework | File pattern | Run command |
|---|---|---|---|
| `apps/be` | Node.js built-in `node:test` + `node:assert/strict` | `tests/<domain>/<name>.test.cjs` | `npm test` (build trước) |
| `apps/fe` | Vitest + `@testing-library/react` | `src/pages/<page>/__tests__/<name>.test.js` | `npm test` |
| `apps/ai-services` | Jest | `src/**/*.spec.ts` | `yarn test` |
| `apps/agentic` | pytest | `tests/test_<name>.py` | `poetry run pytest` |

---

## Bước 1: Đọc code cần test

Trước khi viết bất cứ dòng test nào, đọc kỹ:

1. **File source chính** vừa implement
2. **Các dependency** nó gọi đến (service, model, util)
3. **Test file tương tự** đã có trong cùng thư mục để học pattern

```bash
# Tìm test file gần nhất để học pattern
find apps/be/tests -name "*.test.cjs" | head -5
find apps/fe/src -name "*.test.js" -path "*__tests__*" | head -5
```

---

## Bước 2: Liệt kê các case cần test

Với mỗi function/controller/component, phân tích ra các nhóm:

### 2a. Happy path (flow bình thường)
- Input hợp lệ → output đúng
- Mỗi branch logic chính được cover
- Side effects xảy ra đúng (email gửi, DB update, ...)

### 2b. Edge case (trường hợp biên)
- Input rỗng / null / undefined
- Giá trị biên: empty string, 0, array rỗng, số âm
- Giá trị trùng lặp (duplicate)
- Input quá dài / quá ngắn
- Timezone / date boundary
- Concurrent request (nếu liên quan đến lock/race condition)

### 2c. Error case (lỗi có chủ ý)
- Input sai format → validation reject
- Resource không tồn tại → 404 / NotFoundException
- Unauthorized → 401 / 403
- Conflict (duplicate, expired) → 409
- Dependency thất bại (DB down, SSO lỗi) → 500

### 2d. Security case (nếu có auth logic)
- Token thiếu / hết hạn
- Role không đủ quyền
- Tenant isolation (không được access data của tenant khác)

---

## Bước 3: Viết test — Pattern BE (`node:test`)

Dựa trên pattern thực tế của codebase:

```js
// tests/<domain>/<feature>.test.cjs
const assert = require('node:assert/strict');
const test = require('node:test');

process.env.NODE_ENV = 'test';

// Import từ dist/ (phải build trước)
const db = require('../../dist/db/index.js');
const { models } = db;
const featureController = require('../../dist/components/<domain>/<file>.js');

// Helper: reset tất cả mock về state mặc định
const resetMocks = () => {
    models.SomeModel.findOne = async () => null;
    models.SomeModel.create = async (data) => ({ id: 'mock-id', ...data });
    models.SomeModel.update = async () => [1];
    models.SomeModel.destroy = async () => 1;
};

// Helper: tạo req/res mock chuẩn
const makeMockRes = () => {
    const res = {};
    res.status = (code) => { res._status = code; return res; };
    res.json = (body) => { res._body = body; return res; };
    return res;
};

test.beforeEach(() => resetMocks());

// ─── Happy path ───────────────────────────────────────
test('<feature> - happy path: <mô tả>', async () => {
    // Arrange
    models.SomeModel.findOne = async () => ({ id: 'existing-id', name: 'Test' });
    const req = { body: { field: 'value' }, params: {}, user: { tenantID: 't-123', role: 'ADMIN' } };
    const res = makeMockRes();

    // Act
    await featureController.someAction(req, res);

    // Assert
    assert.equal(res._status, 200);
    assert.equal(res._body.status, 'OK');
});

// ─── Edge cases ───────────────────────────────────────
test('<feature> - edge case: missing required field', async () => {
    const req = { body: {}, params: {}, user: { tenantID: 't-123' } };
    const res = makeMockRes();

    await featureController.someAction(req, res);

    assert.equal(res._status, 400);
    assert.equal(res._body.status, 'INVALID_INPUT');
});

// ─── Error cases ──────────────────────────────────────
test('<feature> - error: not found', async () => {
    models.SomeModel.findOne = async () => null;
    const req = { params: { id: 'nonexistent' }, user: { tenantID: 't-123' } };
    const res = makeMockRes();

    await featureController.someAction(req, res);

    assert.equal(res._status, 404);
});

test('<feature> - error: permission denied (wrong role)', async () => {
    const req = { body: { field: 'value' }, user: { tenantID: 't-123', role: 'CUSTOMER_STUDENT' } };
    const res = makeMockRes();

    await featureController.someAction(req, res);

    assert.equal(res._status, 403);
    assert.equal(res._body.status, 'PERMISSION_DENIED');
});

test('<feature> - error: DB throws → 500', async () => {
    models.SomeModel.create = async () => { throw new Error('DB connection failed'); };
    const req = { body: { field: 'value' }, user: { tenantID: 't-123', role: 'ADMIN' } };
    const res = makeMockRes();

    await featureController.someAction(req, res);

    assert.equal(res._status, 500);
});
```

---

## Bước 4: Viết test — Pattern FE (`vitest`)

Dựa trên pattern thực tế:

```js
/* @vitest-environment jsdom */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ComponentToTest from "../ComponentToTest";

// Mock i18next (bắt buộc)
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { language: "vi" },
    }),
}));

// Mock service calls
vi.mock("../../../../service/SomeService", () => ({
    someApiCall: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// ─── Happy path ───────────────────────────────────────
it("renders component with valid props", () => {
    render(<ComponentToTest data={[{ id: "1", name: "Test" }]} />);
    expect(screen.getByText("Test")).toBeTruthy();
});

// ─── Edge cases ───────────────────────────────────────
it("renders empty state when data is empty array", () => {
    render(<ComponentToTest data={[]} />);
    expect(screen.getByTestId("empty-state")).toBeTruthy();
});

it("handles null data gracefully", () => {
    render(<ComponentToTest data={null} />);
    // Should not crash
    expect(screen.getByRole("main")).toBeTruthy();
});

// ─── User interactions ────────────────────────────────
it("calls onSubmit when form is submitted with valid data", async () => {
    const onSubmit = vi.fn();
    render(<ComponentToTest onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
    }));
});

// ─── Error states ─────────────────────────────────────
it("shows error toast when API fails", async () => {
    const { someApiCall } = await import("../../../../service/SomeService");
    someApiCall.mockRejectedValueOnce(new Error("Network error"));

    render(<ComponentToTest />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => expect(screen.getByText(/error/i)).toBeTruthy());
});
```

---

## Bước 5: Checklist trước khi giao nộp test

```
[ ] Mỗi function public có ít nhất 1 happy path test
[ ] Mỗi validation logic có test với input invalid
[ ] Mỗi auth check có test với role không đủ quyền
[ ] Mỗi external call (DB, SSO, email) được mock — không call thật
[ ] Không có hardcoded sleep/setTimeout trong test
[ ] Test độc lập: thứ tự chạy không ảnh hưởng kết quả (beforeEach reset)
[ ] Tên test mô tả rõ: "<feature> - <case>: <expected>"
[ ] Chạy test pass: npm test / vitest run
```

---

## Bước 6: Đặt file test đúng chỗ

| Loại code | Vị trí test |
|---|---|
| BE controller (`tenant.controller.js`) | `apps/be/tests/<domain>/<name>.controller.test.cjs` |
| BE service/helper thuần (no DB) | `apps/be/tests/<domain>/<name>.helper.test.cjs` |
| FE component (`/pages/booking/...`) | `apps/fe/src/pages/booking/__tests__/<name>.test.js` |
| FE utility/hook | `apps/fe/src/utilities/__tests__/<name>.test.js` |

---

## Lưu ý quan trọng

- **BE test import từ `dist/`** — phải chạy `npm run build` trước, vì code viết bằng ESM nhưng `node:test` dùng CJS
- **Mock TOÀN BỘ external**: DB models, SSO service, email service, Google Calendar — không call API thật trong test
- **Mock `req.user` luôn** — controllers đều đọc từ đây
- **FE mock `react-i18next` luôn** — component nào cũng dùng `useTranslation`
- **Tên file BE dùng `.test.cjs`** — không phải `.test.js`
