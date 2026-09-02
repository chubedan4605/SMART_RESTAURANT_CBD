const crypto = require("crypto");
const { getRedisClient, isRedisReady } = require("../config/redis");

const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeToken() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function encodeOrHash(s) {
  if (!s) return "";
  const str = String(s);
  if (str.length <= 64) return encodeURIComponent(str);
  return crypto.createHash("sha1").update(str).digest("hex");
}

function buildKey(parts = []) {
  return parts.map((p) => String(p)).join("|");
}

async function getJson(key) {
  const client = getRedisClient();
  if (!client || !isRedisReady()) return null;
  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Redis get cache failed:", err.message);
    return null;
  }
}

async function setJson(key, ttlInSeconds, value) {
  const client = getRedisClient();
  if (!client || !isRedisReady()) return;
  try {
    await client.setEx(key, ttlInSeconds, JSON.stringify(value));
  } catch (err) {
    console.warn("Redis set cache failed:", err.message);
  }
}

async function getVersion(versionKey = "menu:version") {
  const client = getRedisClient();
  if (!client || !isRedisReady()) return "0";
  try {
    let version = await client.get(versionKey);
    if (!version) {
      version = "1";
      await client.set(versionKey, version);
    }
    return String(version);
  } catch (err) {
    console.warn("Redis getVersion failed:", err.message);
    return "0";
  }
}

async function bumpVersion(versionKey = "menu:version") {
  const client = getRedisClient();
  if (!client || !isRedisReady()) return;
  try {
    await client.incr(versionKey);
  } catch (err) {
    console.warn("Redis bumpVersion failed:", err.message);
  }
}

async function getOrSetJsonWithLock({
  key,
  ttlSeconds,
  lockKey = `${key}:lock`,
  lockTtlMs = 8000,
  waitMs = 50,
  retries = 6,
  buildFn,
}) {
  const cached = await getJson(key);
  if (cached) {
    console.log(`[cache] hit ${key}`);
    return cached;
  }

  const client = getRedisClient();
  if (!client || !isRedisReady()) {
    const value = await buildFn();
    return value;
  }

  const token = makeToken();
  let acquired = false;
  try {
    const result = await client.set(lockKey, token, {
      NX: true,
      PX: lockTtlMs,
    });
    acquired = result === "OK";
  } catch (err) {
    console.warn("Redis lock failed:", err.message);
  }

  if (acquired) {
    try {
      const value = await buildFn();
      await setJson(key, ttlSeconds, value);
      return value;
    } finally {
      try {
        await client.eval(RELEASE_LOCK_SCRIPT, {
          keys: [lockKey],
          arguments: [token],
        });
      } catch (err) {
        console.warn("Redis lock release failed:", err.message);
      }
    }
  }

  for (let i = 0; i < retries; i += 1) {
    await sleep(waitMs + Math.floor(Math.random() * waitMs));
    const retryCached = await getJson(key);
    if (retryCached) {
      console.log(`[cache] hit-after-wait ${key}`);
      return retryCached;
    }
  }

  const value = await buildFn();
  await setJson(key, ttlSeconds, value);
  return value;
}

module.exports = {
  encodeOrHash,
  buildKey,
  getJson,
  setJson,
  getVersion,
  bumpVersion,
  getOrSetJsonWithLock,
};
