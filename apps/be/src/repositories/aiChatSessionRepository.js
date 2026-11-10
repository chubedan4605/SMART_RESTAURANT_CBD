const db = require("../config/db");

class AiChatSessionRepository {
  /**
   * Lấy phiên chat theo mã bàn
   */
  async findByTableCode(tableCode) {
    if (!tableCode) return null;
    const result = await db.query(
      `SELECT id, table_code, interaction_id, messages, created_at, updated_at
       FROM ai_chat_sessions
       WHERE table_code = $1
       LIMIT 1`,
      [String(tableCode).trim()]
    );
    return result.rows[0] || null;
  }

  /**
   * Lưu hoặc cập nhật phiên chat (Upsert)
   */
  async saveSession({ tableCode, interactionId = null, messages = [] }) {
    if (!tableCode) return null;
    const cleanCode = String(tableCode).trim();
    const cleanMessages = Array.isArray(messages) ? messages : [];

    const result = await db.query(
      `INSERT INTO ai_chat_sessions (table_code, interaction_id, messages, updated_at)
       VALUES ($1, $2, $3::jsonb, NOW())
       ON CONFLICT (table_code)
       DO UPDATE SET
         interaction_id = COALESCE(EXCLUDED.interaction_id, ai_chat_sessions.interaction_id),
         messages = EXCLUDED.messages,
         updated_at = NOW()
       RETURNING *`,
      [cleanCode, interactionId, JSON.stringify(cleanMessages)]
    );
    return result.rows[0] || null;
  }

  /**
   * Thêm tin nhắn mới vào phiên chat hiện tại
   */
  async appendMessages({ tableCode, interactionId = null, newMessages = [] }) {
    if (!tableCode || !Array.isArray(newMessages) || newMessages.length === 0) {
      return null;
    }

    const current = await this.findByTableCode(tableCode);
    const existingMessages = Array.isArray(current?.messages)
      ? current.messages
      : [];

    // Giữ tối đa 60 tin nhắn gần nhất để tối ưu hiệu năng và dung lượng JSONB
    const combined = [...existingMessages, ...newMessages].slice(-60);

    return this.saveSession({
      tableCode,
      interactionId: interactionId || current?.interaction_id || null,
      messages: combined,
    });
  }

  /**
   * Xóa phiên chat của bàn (khi khách làm mới hoặc bàn kết thúc bữa ăn)
   */
  async clearSession(tableCode) {
    if (!tableCode) return false;
    await db.query(
      `DELETE FROM ai_chat_sessions WHERE table_code = $1`,
      [String(tableCode).trim()]
    );
    return true;
  }
}

module.exports = new AiChatSessionRepository();

