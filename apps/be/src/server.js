require("dotenv").config();

const express = require("express");
const http = require("http");
const setUpRoutes = require("./config/index.routes");
const setUpSocket = require("./config/socket");
const setUpMiddleWare = require("./config/middleWare");
const passport = require("passport");
const { connectRedis, closeRedis } = require("./config/redis");
const { runMigrations } = require("./database/migrate");

const app = express();
const server = http.createServer(app); // Tạo HTTP Server từ Express App

app.use(passport.initialize());
require("./config/passport")(passport); // chỉnh path theo dự án bạn
// Middleware
setUpMiddleWare(app);
//Cấu hình Socket.IO && connect socket
setUpSocket(server, app);
// Routes
setUpRoutes(app);

const PORT = process.env.PORT || 3030;

async function bootstrap() {
  // Tự động kiểm tra và chạy database migrations khi khởi động
  try {
    await runMigrations();
  } catch (err) {
    console.error("❌ [Server] Migration thất bại, dừng khởi động server:", err);
    process.exit(1);
  }

  await connectRedis();

  server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
    console.log(`✅ [CI/CD] Phiên bản V2 đã được Deploy tự động thành công qua GitHub Actions!`);
  });
}

async function gracefulShutdown(signal) {
  console.log(`${signal} received. Closing server...`);
  await closeRedis();
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

bootstrap();


// trigger CI CD 6