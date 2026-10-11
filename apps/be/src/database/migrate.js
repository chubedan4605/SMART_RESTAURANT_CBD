require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

async function runMigrations() {
  console.log("==================================================");
  console.log("🔄 [DB Migration] Đang kiểm tra và chạy Database Migrations...");
  console.log("==================================================");

  let client;
  try {
    client = await pool.connect();

    // 1. Tạo bảng quản lý migrations nếu chưa có
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Lấy danh sách các migrations đã chạy
    const { rows: executedRows } = await client.query(
      "SELECT name FROM schema_migrations ORDER BY id ASC"
    );
    const executedMigrations = new Set(executedRows.map((r) => r.name));

    // 3. Đọc các file migration trong thư mục migrations
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".js") || file.endsWith(".sql"))
      .sort();

    const pendingFiles = files.filter((file) => {
      const migrationName = path.parse(file).name;
      return !executedMigrations.has(migrationName);
    });

    if (pendingFiles.length === 0) {
      console.log("✨ [DB Migration] Cơ sở dữ liệu đã ở trạng thái mới nhất. Không có migration nào cần chạy.");
      return;
    }

    console.log(`📦 [DB Migration] Tìm thấy ${pendingFiles.length} migration(s) mới cần thực thi:`);
    pendingFiles.forEach((f) => console.log(`   - ${f}`));

    // 4. Thực thi từng migration trong transaction
    for (const file of pendingFiles) {
      const migrationName = path.parse(file).name;
      const filePath = path.join(migrationsDir, file);

      console.log(`\n⏳ Đang chạy migration: ${migrationName}...`);
      await client.query("BEGIN");

      try {
        if (file.endsWith(".js")) {
          const migration = require(filePath);
          if (typeof migration.up === "function") {
            await migration.up(client);
          } else {
            throw new Error(`File ${file} không export hàm up(client) hợp lệ.`);
          }
        } else if (file.endsWith(".sql")) {
          const sql = fs.readFileSync(filePath, "utf-8");
          await client.query(sql);
        }

        // Lưu lịch sử migration
        await client.query(
          "INSERT INTO schema_migrations (name) VALUES ($1)",
          [migrationName]
        );

        await client.query("COMMIT");
        console.log(`✅ Thành công: ${migrationName}`);
      } catch (migrationError) {
        await client.query("ROLLBACK");
        console.error(`❌ Thất bại tại migration: ${migrationName}`);
        throw migrationError;
      }
    }

    console.log("\n🎉 [DB Migration] Tất cả migrations đã được áp dụng thành công!");
  } catch (err) {
    console.error("\n❌ [DB Migration] Lỗi nghiêm trọng khi chạy migration:");
    console.error(err.message || err);
    throw err;
  } finally {
    if (client) client.release();
  }
}

// Nếu chạy trực tiếp từ command line: node src/database/migrate.js
if (require.main === module) {
  runMigrations()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await pool.end();
      process.exit(1);
    });
}

module.exports = { runMigrations };
