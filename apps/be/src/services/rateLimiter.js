const crypto = require("crypto");
const { getRedisClient, isRedisReady } = require("../config/redis");

function normalizeIp(ip) {
  if (!ip) return "";
  const raw = String(ip).trim();
  return raw.replace(/^::ffff:/, "");
}

function hashIdentity(value) {
  const str = String(value || "");
  return crypto.createHash("sha1").update(str).digest("hex");
}

function buildKey(prefix, identity) {
  return `rl:${prefix}:${hashIdentity(identity)}`;
}

async function consumeFixedWindow({ key, limit, windowSeconds }) {
  const client = getRedisClient();
  if (!client || !isRedisReady()) {
    return { allowed: true, remaining: limit, resetSeconds: 0 };
  }

  try {
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetSeconds: ttl >= 0 ? ttl : windowSeconds,
    };
  } catch (err) {
    console.warn("Redis rate limit failed:", err.message);
    return { allowed: true, remaining: limit, resetSeconds: 0 };
  }
}

async function enforceFixedWindow({ key, limit, windowSeconds, errorMessage }) {
  const result = await consumeFixedWindow({ key, limit, windowSeconds });
  if (!result.allowed) {
    const err = new Error(errorMessage || "Too many requests");
    err.status = 429;
    err.retryAfter = result.resetSeconds;
    throw err;
  }
  return result;
}

module.exports = {
  normalizeIp,
  hashIdentity,
  buildKey,
  consumeFixedWindow,
  enforceFixedWindow,
};
