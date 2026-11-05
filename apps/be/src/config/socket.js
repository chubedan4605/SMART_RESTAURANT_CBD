// apps/be/src/config/socket.js
const { Server } = require("socket.io");
const socketService = require("../services/socketService");
const socketAuthMiddleware = require("../middlewares/socketAuthMiddleware");

const defaultAllowedOrigins = [
  "https://smart-restaurant.id.vn",
  "https://d1qu7ng7kw13po.cloudfront.net",
  "https://final-project-smart-restaurant.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const setUpSocket = (server, app) => {
  // 1. Khởi tạo IO với dynamic CORS
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const envOrigins = process.env.ALLOWED_ORIGINS
          ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
          : [];

        const allAllowed = [...defaultAllowedOrigins, ...envOrigins];

        if (allAllowed.includes(origin) || origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }

        console.warn(`[Socket CORS] Origin not in whitelist: ${origin}`);
        return callback(null, true); // Không ngắt socket khi test môi trường linh hoạt
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 2. Handshake Auth Middleware (Xác thực JWT / QR token & Phân quyền RBAC)
  io.use(socketAuthMiddleware);

  // 3. Inject IO vào Request cho controller
  if (app) {
    app.use((req, res, next) => {
      req.io = io;
      next();
    });
  }

  // 4. Kích hoạt logic lắng nghe từ Service
  socketService.init(io);

  return io;
};

module.exports = setUpSocket;
