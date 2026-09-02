const crypto = require("crypto");
const tableRepository = require("../repositories/tableRepository");
const tableSessionRepository = require("../repositories/tableSessionRepository");
const socketService = require("./socketService");
const { getRedisClient, isRedisReady } = require("../config/redis");
const {
  TABLE_SESSION_TTL_SECONDS,
  TABLE_SESSION_HEARTBEAT_TTL_SECONDS,
  TABLE_SESSION_LOCK_TTL_MS,
  TABLE_SESSION_LOCK_WAIT_MS,
  TABLE_SESSION_LOCK_RETRIES,
} = require("../config/tableSession");

const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

const sessionTokenKey = (token) => `table:session:token:${token}`;
const sessionIdKey = (sessionId) => `table:session:id:${sessionId}`;
const tableKey = (tableId) => `table:session:table:${tableId}`;
const userKey = (userId) => `table:session:user:${userId}`;
const qrTokenKey = (qrToken) => `table:session:qr:${qrToken}`;
const tableLockKey = (tableId) => `lock:table-session:${tableId}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeLockToken() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function getRedis() {
  const client = getRedisClient();
  if (!client || !isRedisReady()) return null;
  return client;
}

async function acquireTableLock(tableId) {
  const client = getRedis();
  if (!client) return { acquired: true, token: null };

  const token = makeLockToken();

  for (let i = 0; i <= TABLE_SESSION_LOCK_RETRIES; i += 1) {
    try {
      const result = await client.set(tableLockKey(tableId), token, {
        NX: true,
        PX: TABLE_SESSION_LOCK_TTL_MS,
      });
      if (result === "OK") {
        return { acquired: true, token };
      }
    } catch (err) {
      console.warn("Redis table lock failed:", err.message);
      break;
    }

    if (i < TABLE_SESSION_LOCK_RETRIES) {
      await sleep(TABLE_SESSION_LOCK_WAIT_MS);
    }
  }

  return { acquired: false, token };
}

async function releaseTableLock(tableId, token) {
  const client = getRedis();
  if (!client || !token) return;

  try {
    await client.eval(RELEASE_LOCK_SCRIPT, {
      keys: [tableLockKey(tableId)],
      arguments: [token],
    });
  } catch (err) {
    console.warn("Redis table lock release failed:", err.message);
  }
}

async function getSessionByToken(token) {
  const client = getRedis();
  if (!client) return null;
  try {
    const raw = await client.get(sessionTokenKey(token));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Redis get session failed:", err.message);
    return null;
  }
}

async function getSessionById(sessionId) {
  const client = getRedis();
  if (!client) return null;
  try {
    const token = await client.get(sessionIdKey(sessionId));
    if (!token) return null;
    return getSessionByToken(token);
  } catch (err) {
    console.warn("Redis get session by id failed:", err.message);
    return null;
  }
}

async function getSessionByTableId(tableId) {
  const client = getRedis();
  if (!client) return null;
  try {
    const token = await client.get(tableKey(tableId));
    if (!token) return null;
    return getSessionByToken(token);
  } catch (err) {
    console.warn("Redis get session by table failed:", err.message);
    return null;
  }
}

async function getSessionByUserId(userId) {
  const client = getRedis();
  if (!client) return null;
  try {
    const token = await client.get(userKey(userId));
    if (!token) return null;
    return getSessionByToken(token);
  } catch (err) {
    console.warn("Redis get session by user failed:", err.message);
    return null;
  }
}

async function getSessionByQrToken(qrToken) {
  const client = getRedis();
  if (!client) return null;
  try {
    const token = await client.get(qrTokenKey(qrToken));
    if (!token) return null;
    return getSessionByToken(token);
  } catch (err) {
    console.warn("Redis get session by QR token failed:", err.message);
    return null;
  }
}

async function saveSession(session) {
  const client = getRedis();
  if (!client) return session;

  const payload = {
    ...session,
    lastHeartbeatAt: new Date().toISOString(),
  };

  console.log("Saving session to Redis:", payload);

  try {
    const multi = client.multi();
    multi.setEx(
      sessionTokenKey(session.sessionToken),
      TABLE_SESSION_TTL_SECONDS,
      JSON.stringify(payload),
    );
    multi.setEx(
      qrTokenKey(session.qrToken),
      TABLE_SESSION_TTL_SECONDS,
      session.sessionToken,
    );
    multi.setEx(
      sessionIdKey(session.id),
      TABLE_SESSION_TTL_SECONDS,
      session.sessionToken,
    );
    multi.setEx(
      tableKey(session.tableId),
      TABLE_SESSION_TTL_SECONDS,
      session.sessionToken,
    );
    if (session.userId) {
      multi.setEx(
        userKey(session.userId),
        TABLE_SESSION_TTL_SECONDS,
        session.sessionToken,
      );
    }
    await multi.exec();
  } catch (err) {
    console.warn("Redis save session failed:", err.message);
  }

  return payload;
}

async function touchSession(session) {
  const client = getRedis();
  if (!client) return session;

  const payload = {
    ...session,
    lastHeartbeatAt: new Date().toISOString(),
  };

  try {
    const multi = client.multi();
    multi.setEx(
      sessionTokenKey(session.sessionToken),
      TABLE_SESSION_HEARTBEAT_TTL_SECONDS,
      JSON.stringify(payload),
    );
    multi.setEx(
      sessionIdKey(session.id),
      TABLE_SESSION_HEARTBEAT_TTL_SECONDS,
      session.sessionToken,
    );
    multi.setEx(
      qrTokenKey(session.qrToken),
      TABLE_SESSION_HEARTBEAT_TTL_SECONDS,
      session.sessionToken,
    );
    multi.setEx(
      tableKey(session.tableId),
      TABLE_SESSION_HEARTBEAT_TTL_SECONDS,
      session.sessionToken,
    );
    if (session.userId) {
      multi.setEx(
        userKey(session.userId),
        TABLE_SESSION_HEARTBEAT_TTL_SECONDS,
        session.sessionToken,
      );
    }
    await multi.exec();
  } catch (err) {
    console.warn("Redis touch session failed:", err.message);
  }

  return payload;
}

async function deleteSession(session) {
  const client = getRedis();
  if (!client) return;

  try {
    const keys = [
      sessionTokenKey(session.sessionToken),
      sessionIdKey(session.id),
      tableKey(session.tableId),
    ];
    if (session.userId) keys.push(userKey(session.userId));
    await client.del(keys);
  } catch (err) {
    console.warn("Redis delete session failed:", err.message);
  }
}

class TableSessionService {
  // Sinh session token ngẫu nhiên
  generateSessionToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Kiểm tra bàn và tạo/lấy session
  async checkAndCreateSession(tableCode, userId = null, qrToken = null) {
    // 1. Tìm bàn theo table_number hoặc id
    let table = await tableRepository.findById(tableCode);

    if (!table) {
      const err = new Error("Bàn không tồn tại");
      err.status = 404;
      throw err;
    }

    console.log("Found table:", table);

    // 2. Kiểm tra bàn có active không
    if (table.status === "inactive") {
      const err = new Error("Bàn đang tạm ngưng phục vụ");
      err.status = 400;
      throw err;
    }

    const lock = await acquireTableLock(table.id);
    if (!lock.acquired) {
      const err = new Error("Bàn đang được xử lý, vui lòng thử lại");
      err.status = 409;
      throw err;
    }

    try {
      // 3. Kiểm tra session hiện tại trong Redis
      const redisSession = await getSessionByTableId(table.id);

      // console.log("Redis session for table:", redisSession);

      if (redisSession) {
        if (userId && redisSession.userId && userId !== redisSession.userId) {
          const err = new Error("Bàn đang được sử dụng bởi khách khác.");
          err.status = 400;
          throw err;
        }

        const refreshed = await touchSession(redisSession);
        return {
          success: true,
          tableSession: {
            id: refreshed.id,
            sessionToken: refreshed.sessionToken,
            tableId: refreshed.tableId,
            tableNumber: refreshed.tableNumber,
            startedAt: refreshed.startedAt,
          },
          isExisting: true,
        };
      }

      // 3.1 Nếu DB còn session active nhưng Redis không có -> coi là hết hạn
      const dbSession = await tableSessionRepository.findActiveByTableId(
        table.id,
      );
      if (dbSession) {
        await tableSessionRepository.endSession(dbSession.id);
        await tableRepository.clearSession(table.id);
      }

      // 4. Tạo session mới trong DB (lưu lịch sử), Redis giữ active
      const sessionToken = this.generateSessionToken();
      const newSession = await tableSessionRepository.create({
        tableId: table.id,
        userId,
        sessionToken,
      });

      console.log("session token:", newSession);

      await saveSession({
        id: newSession.id,
        sessionToken: newSession.session_token,
        qrToken: qrToken,
        tableId: newSession.table_id,
        tableNumber: table.table_number,
        userId: newSession.user_id || null,
        startedAt: newSession.started_at,
      });

      // 5. Cập nhật session cho bàn
      await tableRepository.updateSession(table.id, newSession.id);

      // 6. Lấy lại thông tin bàn đã cập nhật để gửi socket
      const updatedTable = await tableRepository.findById(table.id);

      // 7. Emit socket thông báo có khách mới vào bàn
      socketService.notifyTableSessionUpdate({
        type: "session_started",
        table: updatedTable,
        session: {
          id: newSession.id,
          tableId: newSession.table_id,
          startedAt: newSession.started_at,
        },
      });

      return {
        success: true,
        tableSession: {
          id: newSession.id,
          sessionToken: newSession.session_token,
          qrToken: newSession.qr_token,
          tableId: newSession.table_id,
          tableNumber: table.table_number,
          startedAt: newSession.started_at,
        },
        requiresBookingCode: false,
        isExisting: false,
      };
    } finally {
      await releaseTableLock(table.id, lock.token);
    }
  }

  async findSessionActive(userId) {
    const session = await getSessionByUserId(userId);
    if (session) {
      const refreshed = await touchSession(session);
      return {
        hasSession: true,
        sessions: {
          id: refreshed.id,
          sessionToken: refreshed.sessionToken,
          qrToken: refreshed.qrToken,
          tableId: refreshed.tableId,
          tableNumber: refreshed.tableNumber,
          startedAt: refreshed.startedAt,
        },
      };
    }

    const dbSession =
      await tableSessionRepository.findActiveByUserAndTable(userId);
    console.log("DB session for user:", dbSession);
    if (dbSession) {
      await tableSessionRepository.endSession(dbSession.id);
      await tableRepository.clearSession(dbSession.table_id);
    }

    return { hasSession: false };
  }

  // Kết thúc session
  async endSession(tableCode, sessionId) {
    const redisSession = await getSessionById(sessionId);
    const session = redisSession
      ? {
          id: redisSession.id,
          sessionToken: redisSession.sessionToken,
          qrToken: redisSession.qrToken,
          tableId: redisSession.tableId,
          tableNumber: redisSession.tableNumber,
          userId: redisSession.userId,
          startedAt: redisSession.startedAt,
          status: "active",
        }
      : await tableSessionRepository.findById(sessionId);

    if (!session) {
      const err = new Error("Session không tồn tại");
      err.status = 404;
      throw err;
    }

    if (session.status === "closed") {
      return { message: "Session đã được đóng trước đó" };
    }

    // 2. Kết thúc session
    const endedSession = await tableSessionRepository.endSession(sessionId);
    if (redisSession) {
      await deleteSession(redisSession);
    }

    // 3. Cập nhật trạng thái bàn về 'active' (available)
    await tableRepository.updateStatus(
      session.tableId || session.table_id,
      "active",
    );
    await tableRepository.clearSession(session.tableId || session.table_id);

    // 4. Lấy thông tin bàn đã cập nhật
    const updatedTable = await tableRepository.findById(session.table_id);

    // 5. Emit socket thông báo bàn đã trống
    socketService.notifyTableSessionUpdate({
      type: "session_ended",
      table: updatedTable,
      session: endedSession,
    });

    return {
      message: "Đã kết thúc session",
      session: endedSession,
    };
  }

  // Validate session token
  async validateSession(tableCode, sessionToken) {
    const token = sessionToken || tableCode;
    const tableCodeValue = sessionToken ? tableCode : null;

    const redisSession = await getSessionByToken(token);
    if (!redisSession) {
      const dbSession = await tableSessionRepository.findBySessionToken(token);
      if (dbSession) {
        await tableSessionRepository.endSession(dbSession.id);
        await tableRepository.clearSession(dbSession.table_id);
      }

      return {
        valid: false,
        message: "Session không hợp lệ hoặc đã hết hạn",
      };
    }

    if (tableCodeValue) {
      let table = await tableRepository.findByNumber(tableCodeValue);
      if (!table) {
        table = await tableRepository.findById(tableCodeValue);
      }

      if (!table || redisSession.tableId !== table.id) {
        return {
          valid: false,
          message: "Session không thuộc bàn này",
        };
      }
    }

    const refreshed = await touchSession(redisSession);

    return {
      valid: true,
      session: {
        id: refreshed.id,
        tableId: refreshed.tableId,
        tableNumber: refreshed.tableNumber,
        startedAt: refreshed.startedAt,
      },
    };
  }
}

module.exports = new TableSessionService();
