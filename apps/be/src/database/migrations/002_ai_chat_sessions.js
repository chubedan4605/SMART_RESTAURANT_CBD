/**
 * Migration 002: Create ai_chat_sessions table for persisting AI dining assistant conversation history
 */
module.exports = {
  name: "002_ai_chat_sessions",
  up: async (client) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS ai_chat_sessions (
        id SERIAL PRIMARY KEY,
        table_code VARCHAR(100) NOT NULL UNIQUE,
        interaction_id VARCHAR(255),
        messages JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_chat_sessions_table_code 
      ON ai_chat_sessions(table_code);
    `;
    await client.query(sql);
  },
  down: async (client) => {
    const sql = `
      DROP TABLE IF EXISTS ai_chat_sessions;
    `;
    await client.query(sql);
  },
};

