require("dotenv").config();

const express = require("express");
const http = require("http");
const setUpRoutes = require("./config/index.routes");
const setUpSocket = require("./config/socket");
const setUpMiddleWare = require("./config/middleWare");
const passport = require("passport");
const { connectRedis, closeRedis } = require("./config/redis");

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

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectRedis();

  server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
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
