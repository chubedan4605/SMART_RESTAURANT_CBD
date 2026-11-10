// apps/be/src/middlewares/socketAuthMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const socketDestination = require("../config/socketDestination");

/**
 * Socket.IO Handshake Authentication & RBAC Middleware
 * Xác thực JWT token của User hoặc QR Token của Bàn ăn ngay tại bước Handshake.
 * Tự động đưa socket vào đúng room được phân quyền.
 */
const socketAuthMiddleware = async (socket, next) => {
  try {
    const auth = socket.handshake.auth || {};
    const query = socket.handshake.query || {};
    const headers = socket.handshake.headers || {};

    // 1. Lấy user access token
    let token =
      auth.token ||
      query.token ||
      (headers.authorization && headers.authorization.startsWith("Bearer ")
        ? headers.authorization.slice(7)
        : null);

    // 2. Lấy QR token bàn ăn
    const qrToken = auth.qrToken || query.qrToken;
    const tableCode = auth.tableCode || query.tableCode;

    socket.user = null;
    socket.table = null;

    // 3. Xác thực User JWT Token (nếu có)
    if (token) {
      try {
        const decoded = jwt.verify(token, config.auth.accessTokenSecret);
        socket.user = decoded;
        const role = (decoded.role || "").toLowerCase();

        // Tự động gán vào room theo quyền hạn đã được verify
        if (role === "admin" || role === "superadmin") {
          socket.join(socketDestination.ADMIN);
          console.log(`🛡️ [Socket Auth] Socket ${socket.id} verified as ADMIN (${decoded.email || decoded.id}) -> Joined ${socketDestination.ADMIN}`);
        } else if (role === "kitchen") {
          socket.join(socketDestination.KITCHEN);
          console.log(`👩‍🍳 [Socket Auth] Socket ${socket.id} verified as KITCHEN -> Joined ${socketDestination.KITCHEN}`);
        } else if (role === "waiter") {
          socket.join(socketDestination.WAITER);
          console.log(`🧑‍💼 [Socket Auth] Socket ${socket.id} verified as WAITER -> Joined ${socketDestination.WAITER}`);
        }
      } catch (tokenErr) {
        console.warn(`⚠️ [Socket Auth] Invalid User JWT token: ${tokenErr.message}`);
      }
    }

    // 4. Xác thực QR Token cho Bàn ăn (nếu có)
    if (qrToken && process.env.QR_SECRET) {
      try {
        const decodedTable = jwt.verify(qrToken, process.env.QR_SECRET);
        socket.table = decodedTable;

        if (decodedTable.table_id) {
          socket.join(socketDestination.TABLE(decodedTable.table_id));
          console.log(`🪑 [Socket Auth] Socket ${socket.id} verified table QR -> Joined table_${decodedTable.table_id}`);
        }
        if (decodedTable.table_number && decodedTable.table_number !== decodedTable.table_id) {
          socket.join(socketDestination.TABLE(decodedTable.table_number));
        }
      } catch (qrErr) {
        console.warn(`⚠️ [Socket Auth] Invalid QR token: ${qrErr.message}`);
      }
    } else if (tableCode && socket.user) {
      // Nếu user là nhân viên / admin hoặc khách đã login có tableCode
      const role = (socket.user.role || "").toLowerCase();
      if (role === "admin" || role === "waiter" || role === "customer" || role === "user") {
        socket.join(socketDestination.TABLE(tableCode));
      }
    }

    return next();
  } catch (err) {
    console.error("❌ [Socket Auth] Handshake middleware error:", err);
    return next(new Error("Socket authentication error"));
  }
};

module.exports = socketAuthMiddleware;

