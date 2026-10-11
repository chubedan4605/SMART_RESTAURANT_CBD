    # AI_log.md — AI Usage Log

    **Feature:** Split the bill at a table (`smart-restaurant`)  
    **AI Tool:** Google Gemini (Gemini 1.5 Pro / Advanced)

    ---

    Bước 1: Khởi tạo ngữ cảnh và định hình cấu trúc (Prompt 1)
    Mục đích: Đưa cho AI toàn bộ bối cảnh của bài tập, yêu cầu nó đóng vai một System Analyst / Product Manager và tạo ra bộ khung chuẩn theo slide.

    Nội dung Prompt 1:
    [Act as a Senior System Analyst working on the "smart-restaurant" project. My task is to write a 1-page feature specification for "splitting the bill at a table". 

    Here is the context:
    - A table has one open order with several items, priced, VAT included.
    - The customers want to pay separately, each from their own phone.
    - The kitchen is not affected; the order stays open until every share is paid.
    - The specification must follow this exact template:
    # Split the bill
    Status: draft · Owner: [My Name] · Feature of: smart-restaurant
    ## Goal
    ## Out of scope
    ## Flow
    ## Contract
    ## Data
    ## Errors
    ## Acceptance
    ## Constraints

    Before writing the full spec, give me a detailed bullet-point outline of what you will write for each section. Pay special attention to "Out of scope", "Contract", and "Acceptance" to ensure we cover edge cases like rounding issues (who pays the extra đồng?), concurrency (two people tap Pay simultaneously), and partial failures. Do not write the full spec yet, just the outline for us to align.]

    Nội dung AI trả lời: ""



    Bước 2: Viết phần Core (Scope, Flow, Data & Constraints) (Prompt 2)
    Mục đích: Sau khi bạn chốt outline ở Bước 1, yêu cầu AI viết các phần cơ bản nhưng phải đảm bảo tính sắc bén, đặc biệt là phần Non-goals (Out of scope) để ăn điểm rubric.

    Nội dung Prompt 2:
    [The outline looks good. Now, write the first draft of the following sections for `spec.md`:
    1. Header, Goal, Out of scope
    2. Flow
    3. Data
    4. Constraints

    Requirements for this part based on my grading rubric:
    - "Out of scope" (Non-goals) must be explicit and prevent scope creep. Explicitly mention that we do NOT split by item, no refunds for failed partial shares, etc.
    - Address permissions (who can split the bill: anyone at the table or just the creator?).
    - Keep the language concise and direct.]

    Nội dung AI trả lời: ""


    Bước 3: Viết phần API Contract & Errors (Prompt 3)
    Mục đích: Đây là phần chiếm 25 điểm trong Rubric. Contract phải cực kỳ rõ ràng, payload cụ thể, mã lỗi (status codes) chuẩn chỉnh.

    Nội dung Prompt 3:
    Now, write the `## Contract` and `## Errors` sections.

    Requirements based on my grading rubric (25 points for Contract):
    - Provide concrete endpoints (e.g., POST /api/tables/:id/bill/split).
    - Provide exact JSON payloads for Request and Response.
    - Include idempotencyKey in the request to handle concurrency/retries.
    - List specific HTTP status codes (201, 409, 422, etc.).
    - Error responses MUST have a named shape (e.g., { "error": "split_exists", "splitId": 42 }).
    - For the `## Errors` section, map conditions to what the user sees and what the system does. Cover limits, empty states, and partial failures.

    Nội dung AI trả lời: ""


    Bước 4: Viết phần Acceptance Criteria (Prompt 4)
    Mục đích: Phần này chiếm 25 điểm. Các tiêu chí phải là test-case thực thi được (runnable), có số liệu cụ thể, không được viết kiểu "wishful thinking".

    Nội dung Prompt 4:
    Now, write the `## Acceptance` section. 

    Requirements based on my grading rubric (25 points for Acceptance Criteria):
    - DO NOT write wishes like "splitting works correctly".
    - EVERY criterion must name concrete values and be directly translatable into a test.
    - Must cover at least: 
    1. The split arithmetic (e.g., splitting a 400,000đ order 3 ways - what happens to the remainder?).
    2. One failure path (e.g., one share fails to pay).
    3. One concurrency case (e.g., duplicate pay request for the same share at the exact same second).
    Use the format: "✓ AC1: [Condition] produces [Expected Concrete Result]"

    Nội dung AI trả lời: ""


    Bước 5: Lắp ráp và Review lại với "The 5 thin places" (Prompt 5)
    Mục đích: Lắp ghép thành file hoàn chỉnh và rà soát lại tiêu chí "Edge cases and non-goals" (20 điểm).

    Nội dung Prompt 5:
    Combine all the sections above into a single, cohesive markdown file (`spec.md`). Ensure it is approximately one page long (concise, high information density).

    Before finalizing, review it against the "5 thin places" criteria. The spec must explicitly address at least 4 of these 5:
    1. Empty and first-run states
    2. Partial failure
    3. Permissions
    4. Concurrency and duplicates
    5. Limits (e.g., max number of ways to split)

    If any of these are missing or vague, adjust the `spec.md` to include them. Output the final `spec.md` content.

    Nội dung AI trả lời: ""


    Bước 6: Tạo file SELF_ASSESSMENT_REPORT.md (Prompt 6)
    Mục đích: Tạo bảng tự đánh giá dựa trên rubric có sẵn. Đây là file bắt buộc phải có trong file zip nộp bài.

    Nội dung Prompt 6:
    Based on the `spec.md` we just created, generate the `SELF_ASSESSMENT_REPORT.md` file required for my submission. 
    I am aiming for a score of 100/100 (except Revision, which I will do later). 

    Format it as a Markdown table with the following columns: `#`, `Criterion`, `Points Claimed`, and `Evidence`.

    - For Contract (25/25): Cite the exact lines/sections showing concrete endpoints, JSON payloads, status codes, and error shapes.
    - For Acceptance criteria (25/25): Cite the ACs showing concrete values, split arithmetic, failure path, and concurrency.
    - For Edge cases and non-goals (20/20): Cite where the "Out of scope" section is, and where at least 4 of the 5 "thin places" are addressed.
    - For Implementability (20/20): Assume 20/20 for now.
    - For Revision (0/10): Put 0 points for now, as this is the first submission before the swap. Add a note: "Will be completed in the final submission".

    Output the complete `SELF_ASSESSMENT_REPORT.md`.

    Nội dung AI trả lời: ""
