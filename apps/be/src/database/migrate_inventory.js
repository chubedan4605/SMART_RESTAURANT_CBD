require("dotenv").config();
const { pool } = require("../config/db");

async function migrateInventory() {
  console.log("🚀 Bắt đầu cập nhật cấu trúc bảng menu_items cho tính năng track_inventory...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const sql = `
      ALTER TABLE menu_items 
      ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 3;
    `;

    await client.query(sql);
    await client.query("COMMIT");

    console.log("✅ Thành công: Đã thêm các trường sau vào bảng menu_items:");
    console.log("   - track_inventory (BOOLEAN, default: false)");
    console.log("   - stock_quantity (INTEGER, default: NULL)");
    console.log("   - low_stock_threshold (INTEGER, default: 3)");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Lỗi khi cập nhật database:", err.message);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

migrateInventory();
