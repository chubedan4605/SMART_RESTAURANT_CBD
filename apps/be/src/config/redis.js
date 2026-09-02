const { createClient } = require("redis");

let redisClient = null;
let redisReady = false;

const isRedisEnabled = () =>
  String(process.env.REDIS_ENABLED || "false").toLowerCase() === "true";

function getRedisClient() {
  if (!isRedisEnabled() || !process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      },
    });

    redisClient.on("ready", () => {
      redisReady = true;
      console.log("✅ Redis connected");
    });

    redisClient.on("error", (err) => {
      redisReady = false;
      console.error("Redis error:", err.message);
    });

    redisClient.on("end", () => {
      redisReady = false;
      console.warn("Redis connection closed");
    });
  }

  return redisClient;
}

async function connectRedis() {
  const client = getRedisClient();

  if (!client) {
    console.log("ℹ️ Redis disabled (REDIS_ENABLED != true)");
    return false;
  }

  if (!client.isOpen) {
    try {
      await client.connect();
      return true;
    } catch (err) {
      console.error("❌ Cannot connect to Redis:", err.message);
      return false;
    }
  }

  return true;
}

async function closeRedis() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
}

function isRedisReady() {
  return Boolean(redisClient && redisClient.isReady && redisReady);
}

module.exports = {
  getRedisClient,
  connectRedis,
  closeRedis,
  isRedisReady,
};
