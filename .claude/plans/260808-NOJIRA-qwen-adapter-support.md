# [NOJIRA] Qwen / OpenAI-compatible adapter cho Agentic Core Runtime

**Date**: 2026-08-08
**Type**: Feature Implementation
**Status**: In Progress
**Scope**: 5 story points (Task 6.1 = 2, 6.2 = 2, 6.3 = 1)

## Summary
Bóc Agentic core runtime khỏi phụ thuộc cứng vào `google.genai` để có thể switch mượt sang mô hình Qwen 3.6 27B của trường qua OpenAI-compatible endpoint. Bao gồm adapter layer trong core runtime, system prompt tối ưu cho Qwen (ChatML), và script verify độc lập.

## Context
- Core runtime hiện tại: `apps/agentic/app/core/runtime/{query.py,llm.py,subagent.py,compact.py,structured_predict.py}` bind chặt vào `google.genai` types (`types.Content`, `types.Part`, `types.FunctionCall/FunctionResponse`, `response.candidates[0].content`).
- Response Gemini có `thought_signature` phải preserve nguyên khối → dùng `response.candidates[0].content` verbatim. Qwen không có concept này.
- `settings.llm.provider: Provider` enum đã có (`GEMINI` / `OPENAI`) tại `app/settings/llm/__init__.py`.
- `OpenAiSettings` đã có nhưng thiếu `base_url` (cần thêm để trỏ về endpoint Qwen của trường).
- Package `openai` chưa được khai báo trong `pyproject.toml`.

## Architecture

```
                   ┌────────────────────────────────────┐
                   │ query.py (main agentic loop)       │
                   │  _think_stage / _act_stage /       │
                   │  _observe_stage                    │
                   └──────────────┬─────────────────────┘
                                  │ uses
                                  ▼
                   ┌────────────────────────────────────┐
                   │ llm_adapter.py (NEW)               │
                   │  LLMAdapter protocol               │
                   │  ├─ build_client()                 │
                   │  ├─ to_tools(tools, ctx)           │
                   │  ├─ build_config(...)              │
                   │  ├─ generate(client, model, ...)   │
                   │  │    → AdapterResponse            │
                   │  └─ make_tool_result_part(...)     │
                   │  get_adapter(provider) → factory   │
                   └──────┬─────────────┬───────────────┘
                          │             │
                ┌─────────▼──┐   ┌──────▼─────────────┐
                │ Gemini     │   │ OpenAI/Qwen        │
                │ adapter    │   │ adapter            │
                │ (google.   │   │ (openai.           │
                │  genai)    │   │  AsyncOpenAI)      │
                └────────────┘   └────────────────────┘
```

### Canonical form nội bộ
- `_LoopState.contents` vẫn giữ kiểu `list[types.Content]` (Gemini types) để tránh refactor xâm lấn ở nhiều chỗ.
- Adapter Gemini pass-through native. Adapter OpenAI dịch qua/lại tại boundary:
  - **Request**: `list[types.Content]` → OpenAI ChatCompletion `messages`.
  - **Response**: OpenAI `ChatCompletion` → `AdapterResponse` với `.assistant_content: types.Content` (Gemini-shaped, không có thought_signature).
- Điều này cho phép giữ nguyên `state.tool_result_parts`, `_partition_tool_batches`, `_observe_stage`, `compact.py` mà không refactor hàng loạt.

## Task 6.1 — Adapter (2 điểm)

### Files
1. **`apps/agentic/pyproject.toml`** — thêm `openai = "^1.51.0"`.
2. **`apps/agentic/app/settings/llm/openai.py`** — thêm `base_url: str | None`.
3. **`apps/agentic/app/settings/llm/__init__.py`** — thêm `Provider.LOCAL = "local"` (alias openai-compatible tự-host).
4. **`apps/agentic/app/core/runtime/llm_adapter.py`** (NEW ~260 dòng):
   - `AdapterFunctionCall` dataclass: `{name, args, id}`.
   - `AdapterUsageMetadata` dataclass: `{prompt_token_count, candidates_token_count, thoughts_token_count, total_token_count}`.
   - `AdapterResponse` dataclass: `{text, function_calls, finish_reason, usage_metadata, assistant_content}`.
   - `LLMAdapter` abstract base class.
   - `GeminiAdapter` — wrap logic hiện tại.
   - `OpenAIAdapter` — dịch qua/lại + Qwen tool-calling format.
   - `get_adapter(provider: Provider) → LLMAdapter` factory (memoized).
5. **`apps/agentic/app/core/runtime/llm.py`** — expose helper cho OpenAI conversion (giữ hàm cũ cho backward compat).
6. **`apps/agentic/app/core/runtime/query.py`** — refactor:
   - Thay `build_genai_client()` → `adapter.build_client()`.
   - Thay `to_genai_tools()` → `adapter.to_tools()`.
   - Thay `types.GenerateContentConfig(...)` → `adapter.build_config(...)` (returns `Any`).
   - Thay `client.aio.models.generate_content(...)` → `adapter.generate(...)` → `AdapterResponse`.
   - Thay các access `response.function_calls`, `response.text`, `response.candidates[0].content` bằng `AdapterResponse` fields.
   - Giữ `types.Part(function_response=...)` — vẫn dùng Gemini types cho tool_result_parts (canonical form).
   - `_getfinish_reason(response)` → `_getfinish_reason(adapter_response)`.
7. **`apps/agentic/app/core/runtime/compact.py`** — dùng `get_adapter(...)` thay vì `build_genai_client()` cho summarization call.
8. **`apps/agentic/app/core/runtime/subagent.py`** — không đổi (đã dùng `types.Content` canonical).

### `LLMAdapter` interface
```python
class LLMAdapter(ABC):
    provider: Provider

    def build_client(self) -> Any: ...
    def to_tools(self, tools: list[BuiltTool], ctx: ToolContext | None
                 ) -> tuple[Any, dict[str, str]]: ...
    def build_config(self, *, system_instruction: str, tools: Any,
                     temperature: float, max_output_tokens: int,
                     thinking_budget: int | None = None) -> Any: ...
    async def generate(self, client: Any, model: str,
                       contents: list[types.Content], config: Any,
                       timeout: float) -> AdapterResponse: ...
    def make_tool_result_part(self, *, fc_name: str, fc_id: str | None,
                              result_str: str) -> types.Part: ...
```

### OpenAI/Qwen chi tiết
- **Client**: `openai.AsyncOpenAI(api_key=..., base_url=settings.llm.openai.base_url)`.
- **Tools schema**: OpenAI Chat Completion Tools format:
  ```python
  {"type": "function", "function": {"name": ..., "description": ..., "parameters": schema}}
  ```
- **Messages**: `list[types.Content]` → convert:
  - `role="user"` với text parts → `{"role": "user", "content": text}`.
  - `role="model"` với text parts → `{"role": "assistant", "content": text}`.
  - `role="model"` với function_call parts → `{"role": "assistant", "tool_calls": [{"id": ..., "type": "function", "function": {"name": ..., "arguments": json.dumps(args)}}]}`.
  - `role="user"` với function_response parts → mỗi part → `{"role": "tool", "tool_call_id": id, "content": result_str}`.
  - Multi-modal image → OpenAI vision format (best-effort, chưa scope chính).
- **System prompt**: `{"role": "system", "content": system_instruction}` đứng đầu.
- **Config → API params**: `temperature`, `max_tokens`, `tools`, `tool_choice="auto"`.
- **Response → AdapterResponse**:
  - `choice.message.content` → `.text`.
  - `choice.message.tool_calls` → `.function_calls` với `.name`, `.args` (parse JSON), `.id`.
  - `choice.finish_reason` → `.finish_reason` (mapped: `"length"` → `"MAX_TOKENS"`, `"stop"` → `"STOP"`, `"tool_calls"` → `"STOP"`).
  - `response.usage.prompt_tokens` etc. → `AdapterUsageMetadata` (mirror Gemini attr names).
  - `.assistant_content` = Gemini-shaped `types.Content(role="model", parts=[Part.from_text(text=...)] + [Part(function_call=types.FunctionCall(name=..., args=..., id=...))])` để append vào `state.contents`.

### Acceptance
- [ ] `LLM__PROVIDER=openai` + `LLM__OPENAI__API_KEY=...` + `LLM__OPENAI__BASE_URL=...` → agent chạy chat + tool calls thành công (mock verified).
- [ ] `LLM__PROVIDER=gemini` (default) → hành vi hiện tại không đổi.
- [ ] Unit test mock `openai.AsyncOpenAI` cho 2 luồng: chat thường + tool calling.
- [ ] SSE event stream giữ đúng shape (`TextDeltaEvent`, `ToolCallEvent`, `ToolResultEvent`, `AgentCompleteEvent`).

## Task 6.2 — Qwen system prompts (2 điểm)

### Files
1. **`apps/agentic/app/services/jarvis_agent/prompts_qwen.py`** (NEW) — `JARVIS_AGENT_SYSTEM_PROMPT_QWEN`:
   - Rút gọn, cấu trúc rõ (bullet ngắn, dễ parse cho model 27B).
   - Nhấn mạnh "when calling a tool, respond ONLY with tool_calls; no free text".
   - Format ChatML boundary comment (Qwen tokenizer tự bọc `<|im_start|>system…<|im_end|>` nên system prompt là plain text — không tự chèn tag).
   - 2-3 few-shot examples: "user hỏi X → gọi tool Y với args Z" và "user chào → trả lời text ngắn".
2. **`apps/agentic/app/services/jarvis_agent/runtime.py`** — trong `_build_jarvis_system_prompt`, chọn prompt theo `settings.llm.provider`.
3. **`apps/agentic/docs/qwen-prompt-tuning.md`** (NEW) — tài liệu so sánh Qwen vs Gemini prompt, các thay đổi và lý do.

### Acceptance
- [ ] Prompt switch tự động theo provider.
- [ ] Doc so sánh tồn tại.
- [ ] (Manual) Kiểm thử 20 câu → tỷ lệ tool-call syntax error < 10% (best-effort — cần API key thật).

## Task 6.3 — Env & verify script (1 điểm)

### Files
1. **`apps/agentic/.env.example`** — ⚠️ file bị Read deny rule chặn ở môi trường hiện tại; user cần tự thêm block sau:
   ```
   # LLM provider selection: gemini | openai (openai bao gồm Qwen-compatible)
   LLM__PROVIDER=gemini

   # OpenAI/Qwen (school model)
   LLM__OPENAI__API_KEY=
   LLM__OPENAI__BASE_URL=
   LLM__OPENAI__MODEL_NAME=Qwen2.5-Coder-32B-Instruct
   LLM__OPENAI__TEMPERATURE=0.7
   LLM__OPENAI__MAX_TOKENS=2048
   ```
2. **`apps/agentic/scripts/test_school_model.py`** (NEW):
   - Đọc `.env` qua `pydantic-settings`.
   - Test 1: chat plain — "Xin chào, bạn là ai?".
   - Test 2: tool calling — mock function `get_weather(city: str)`, hỏi "Thời tiết Hà Nội?".
   - Đo latency mỗi call, in kết quả + finish_reason + usage.
   - Exit non-zero nếu bất kỳ test fail.

### Acceptance
- [ ] `.env.example` cập nhật với các key mới.
- [ ] Script chạy được (`poetry run python scripts/test_school_model.py`) — với key giả sẽ báo lỗi 401/network expected, với key thật phải PASS cả 2 test.

## Testing Strategy
- **Unit test**: `apps/agentic/tests/core/runtime/test_llm_adapter.py` — mock `openai.AsyncOpenAI` và `google.genai.Client`; verify conversion 2 chiều.
- **Integration test**: Chạy `query()` với mock adapter cho cả 2 provider, verify SSE events.
- **Quality gates**: `cd apps/agentic && poetry run ruff format . && poetry run ruff check . --fix && poetry run pytest`.

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| `state.contents` giữ Gemini types → adapter OpenAI phải convert mỗi turn (overhead) | Low (JSON ops <1ms) | Chấp nhận trade-off; không refactor toàn bộ |
| Qwen không hỗ trợ tool_calling stable → parse error | Medium | Adapter fallback: parse `<tool_call>...</tool_call>` XML pattern nếu `tool_calls` field trống nhưng content chứa pattern |
| `compact.py` gọi Gemini hardcode → provider = openai không có Gemini key | High | Dùng cùng adapter cho compact — text-only prompt đơn giản |
| `structured_predict.py` không hỗ trợ OpenAI (out of scope Task 6.1) | Medium | Document rõ; provider = openai + structured_predict → dùng OpenAI `response_format={"type":"json_object"}` trong follow-up |
| Tests hiện tại mock `build_genai_client()` → break sau refactor | Medium | Cập nhật tests hoặc giữ shim ở `llm.py` |

## Checklist
- [ ] Plan reviewed
- [ ] Task 6.1 implemented + unit tests pass
- [ ] Task 6.2 implemented + doc written
- [ ] Task 6.3 implemented + `.env.example` cập nhật
- [ ] Quality gates pass (`poetry run ruff format . && poetry run ruff check . && poetry run pytest`)
- [ ] Code reviewed
