const crypto = require("crypto");
const { getRedisClient, isRedisReady } = require("../config/redis");

const DEFAULT_LOCK_TTL_MS = 3000;
const DEFAULT_RETRIES = 5;
const DEFAULT_WAIT_MS = 80;

const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

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

const itemLockKey = (menuItemId) => `lock:menu_item:${menuItemId}`;

/**
 * Cố gắng chiếm lock cho 1 món ăn cụ thể
 */
async function acquireItemLock(menuItemId, options = {}) {
  const client = getRedis();
  if (!client) return { acquired: true, token: null };

  const ttlMs = options.ttlMs || DEFAULT_LOCK_TTL_MS;
  const retries = options.retries !== undefined ? options.retries : DEFAULT_RETRIES;
  const waitMs = options.waitMs || DEFAULT_WAIT_MS;
  const token = makeLockToken();

  for (let i = 0; i <= retries; i += 1) {
    try {
      const result = await client.set(itemLockKey(menuItemId), token, {
        NX: true,
        PX: ttlMs,
      });
      if (result === "OK") {
        return { acquired: true, token };
      }
    } catch (err) {
      console.warn(`Redis lock failed for item ${menuItemId}:`, err.message);
      break;
    }

    if (i < retries) {
      await sleep(waitMs);
    }
  }

  return { acquired: false, token: null };
}

/**
 * Giải phóng lock của 1 món ăn an toàn bằng Lua script
 */
async function releaseItemLock(menuItemId, token) {
  const client = getRedis();
  if (!client || !token) return;

  try {
    await client.eval(RELEASE_LOCK_SCRIPT, {
      keys: [itemLockKey(menuItemId)],
      arguments: [token],
    });
  } catch (err) {
    console.warn(`Redis lock release failed for item ${menuItemId}:`, err.message);
  }
}

/**
 * Khóa nhiều món ăn đồng thời:
 * 1. Sắp xếp danh sách ID tăng dần để chống Deadlock
 * 2. Chiếm lock tuần tự
 * 3. Nếu bất kỳ món nào thất bại, rollback nhả toàn bộ lock đã chiếm
 */
async function acquireMultipleItemLocks(menuItemIds, options = {}) {
  const uniqueIds = [...new Set(menuItemIds.filter(Boolean))].sort();
  const acquiredLocks = [];

  for (const id of uniqueIds) {
    const lock = await acquireItemLock(id, options);
    if (!lock.acquired) {
      // Rollback: Giải phóng toàn bộ lock đã lấy trước đó
      await releaseMultipleItemLocks(acquiredLocks);
      return {
        acquired: false,
        failedItemId: id,
        locks: [],
      };
    }
    if (lock.token) {
      acquiredLocks.push({ menuItemId: id, token: lock.token });
    }
  }

  return {
    acquired: true,
    failedItemId: null,
    locks: acquiredLocks,
  };
}

/**
 * Giải phóng danh sách các lock
 */
async function releaseMultipleItemLocks(locks) {
  if (!locks || !locks.length) return;
  await Promise.all(
    locks.map((item) => releaseItemLock(item.menuItemId, item.token))
  );
}

module.exports = {
  acquireItemLock,
  releaseItemLock,
  acquireMultipleItemLocks,
  releaseMultipleItemLocks,
};
