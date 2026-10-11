const { getRedisClient, isRedisReady } = require("../config/redis");
const db = require("../config/db");

const DEDUCT_STOCK_LUA = `
  local current = redis.call('get', KEYS[1])
  if not current then
    return -1
  end
  local stock = tonumber(current)
  local qty = tonumber(ARGV[1])
  if stock >= qty then
    local remaining = redis.call('decrby', KEYS[1], qty)
    return remaining
  else
    return -2
  end
`;

const stockKey = (menuItemId) => `item:stock:${menuItemId}`;
const inventoryConfigKey = (menuItemId) => `item:inventory:${menuItemId}`;

function getRedis() {
  const client = getRedisClient();
  if (!client || !isRedisReady()) return null;
  return client;
}

/**
 * Lấy số lượng tồn kho hiện tại trên Redis (có fallback PostgreSQL)
 */
async function getStock(menuItemId) {
  const client = getRedis();
  if (client) {
    try {
      const raw = await client.get(stockKey(menuItemId));
      if (raw !== null && raw !== undefined) return Number(raw);
    } catch (err) {
      console.warn("Redis getStock failed:", err.message);
    }
  }

  // Fallback DB nếu Redis chưa có key
  try {
    const res = await db.query(
      "SELECT track_inventory, stock_quantity FROM menu_items WHERE id = $1",
      [menuItemId]
    );
    if (!res.rows.length) return null;
    const item = res.rows[0];
    if (!item.track_inventory || item.stock_quantity === null) return null;
    return Number(item.stock_quantity);
  } catch (err) {
    console.warn("DB getStock fallback failed:", err.message);
    return null;
  }
}

/**
 * Lấy thông tin cấu hình quản lý tồn kho (F&B track_inventory)
 * Hỗ trợ Cache-Aside: Ưu tiên Redis, fallback PostgreSQL và tự warm-up cache
 */
async function getInventory(menuItemId) {
  const client = getRedis();
  let rawStock = null;
  let rawConfig = null;

  if (client) {
    try {
      [rawStock, rawConfig] = await Promise.all([
        client.get(stockKey(menuItemId)),
        client.get(inventoryConfigKey(menuItemId)),
      ]);
    } catch (err) {
      console.warn("Redis getInventory read failed:", err.message);
    }
  }

  // Nếu trên Redis đã có cache
  if (rawStock !== null || rawConfig) {
    const stock = rawStock !== null ? Number(rawStock) : 0;
    const config = rawConfig ? JSON.parse(rawConfig) : { low_stock_threshold: 3 };
    const threshold = config.low_stock_threshold || 3;

    return {
      menu_item_id: menuItemId,
      track_inventory: true,
      stock_quantity: stock,
      low_stock_threshold: threshold,
      is_low_stock: stock > 0 && stock <= threshold,
      is_sold_out: stock <= 0,
    };
  }

  // Fallback đọc từ PostgreSQL DB (Cache-Aside)
  try {
    const res = await db.query(
      `SELECT track_inventory, stock_quantity, low_stock_threshold, status 
       FROM menu_items 
       WHERE id = $1`,
      [menuItemId]
    );

    if (!res.rows.length) {
      return {
        menu_item_id: menuItemId,
        track_inventory: false,
        stock_quantity: null,
        low_stock_threshold: null,
        is_low_stock: false,
        is_sold_out: false,
      };
    }

    const item = res.rows[0];
    const isTrack = Boolean(item.track_inventory);
    const stock =
      item.stock_quantity !== null && item.stock_quantity !== undefined
        ? Number(item.stock_quantity)
        : null;
    const threshold =
      item.low_stock_threshold !== null && item.low_stock_threshold !== undefined
        ? Number(item.low_stock_threshold)
        : 3;

    // Warm-up Redis cache nếu món đang bật track_inventory
    if (isTrack && stock !== null && client) {
      try {
        await client.set(stockKey(menuItemId), String(stock));
        await client.set(
          inventoryConfigKey(menuItemId),
          JSON.stringify({
            track_inventory: true,
            low_stock_threshold: threshold,
            updated_at: new Date().toISOString(),
          })
        );
      } catch (cacheErr) {
        console.warn("Redis warm-up cache failed:", cacheErr.message);
      }
    }

    return {
      menu_item_id: menuItemId,
      track_inventory: isTrack,
      stock_quantity: stock,
      low_stock_threshold: isTrack ? threshold : null,
      is_low_stock: isTrack && stock !== null && stock > 0 && stock <= threshold,
      is_sold_out: isTrack && stock !== null && stock <= 0,
    };
  } catch (dbErr) {
    console.warn("DB getInventory fallback failed:", dbErr.message);
    return {
      menu_item_id: menuItemId,
      track_inventory: false,
      stock_quantity: null,
      low_stock_threshold: null,
      is_low_stock: false,
      is_sold_out: false,
    };
  }
}

/**
 * Thiết lập quản lý tồn kho chuẩn F&B (Bật/tắt track_inventory + Ngưỡng cảnh báo)
 * CẬP NHẬT ĐỒNG THỜI: PostgreSQL database VÀ Redis in-memory cache
 */
async function setInventory(menuItemId, { track_inventory, stock_quantity, low_stock_threshold = 3 }) {
  const isTrack = Boolean(track_inventory);
  const qty = isTrack ? Math.max(0, Number(stock_quantity) || 0) : null;
  const threshold = isTrack ? Math.max(0, Number(low_stock_threshold) || 3) : 3;

  // 1. Cập nhật PostgreSQL database
  try {
    if (!isTrack) {
      await db.query(
        `UPDATE menu_items 
         SET track_inventory = FALSE,
             stock_quantity = NULL,
             low_stock_threshold = 3,
             updated_at = NOW()
         WHERE id = $1`,
        [menuItemId]
      );
    } else {
      await db.query(
        `UPDATE menu_items 
         SET track_inventory = TRUE,
             stock_quantity = $1,
             low_stock_threshold = $2,
             status = CASE 
               WHEN $1 <= 0 THEN 'sold_out' 
               WHEN status = 'sold_out' AND $1 > 0 THEN 'available' 
               ELSE status 
             END,
             updated_at = NOW()
         WHERE id = $3`,
        [qty, threshold, menuItemId]
      );
    }
  } catch (dbErr) {
    console.error("DB update inventory failed:", dbErr.message);
    throw dbErr;
  }

  // 2. Đồng bộ Redis in-memory cache
  const client = getRedis();
  if (client) {
    try {
      if (!isTrack) {
        // Tắt theo dõi tồn kho -> Xóa key trên Redis (món bán không giới hạn)
        await client.del([stockKey(menuItemId), inventoryConfigKey(menuItemId)]);
      } else {
        await client.set(stockKey(menuItemId), String(qty));
        await client.set(
          inventoryConfigKey(menuItemId),
          JSON.stringify({
            track_inventory: true,
            low_stock_threshold: threshold,
            updated_at: new Date().toISOString(),
          })
        );
      }
      // Invalidate menu cache version
      await client.incr("menu:version").catch(() => {});
    } catch (err) {
      console.warn("Redis setInventory sync failed:", err.message);
    }
  }

  return {
    menu_item_id: menuItemId,
    track_inventory: isTrack,
    stock_quantity: qty,
    low_stock_threshold: isTrack ? threshold : null,
  };
}

/**
 * Trừ tồn kho nguyên tử bằng Lua Script
 */
async function deductStock(menuItemId, quantity) {
  const client = getRedis();
  if (!client) {
    try {
      const dbRes = await db.query(
        "SELECT track_inventory, stock_quantity, low_stock_threshold FROM menu_items WHERE id = $1",
        [menuItemId]
      );
      const item = dbRes.rows[0];
      if (!item || !item.track_inventory || item.stock_quantity === null) {
        return {
          success: true,
          unlimited: true,
          remaining: null,
          soldOutNow: false,
          lowStockNow: false,
        };
      }
      const currentStock = Number(item.stock_quantity);
      if (currentStock < quantity) {
        return {
          success: false,
          unlimited: false,
          remaining: currentStock,
          soldOutNow: currentStock <= 0,
          lowStockNow: false,
        };
      }
      const remaining = currentStock - quantity;
      return {
        success: true,
        unlimited: false,
        remaining,
        soldOutNow: remaining <= 0,
        lowStockNow: remaining <= (item.low_stock_threshold || 3),
      };
    } catch (err) {
      console.warn("DB fallback in deductStock failed:", err.message);
      return {
        success: true,
        unlimited: true,
        remaining: null,
        soldOutNow: false,
        lowStockNow: false,
      };
    }
  }

  try {
    let result = await client.eval(DEDUCT_STOCK_LUA, {
      keys: [stockKey(menuItemId)],
      arguments: [String(quantity)],
    });

    if (result === -1) {
      // Key chưa có trên Redis -> Kiểm tra PostgreSQL xem món có bật track_inventory không
      try {
        const dbRes = await db.query(
          "SELECT track_inventory, stock_quantity, low_stock_threshold FROM menu_items WHERE id = $1",
          [menuItemId]
        );
        const item = dbRes.rows[0];
        if (item && item.track_inventory && item.stock_quantity !== null) {
          const dbStock = Number(item.stock_quantity);
          await client.set(stockKey(menuItemId), String(dbStock));
          await client.set(
            inventoryConfigKey(menuItemId),
            JSON.stringify({
              track_inventory: true,
              low_stock_threshold: item.low_stock_threshold || 3,
              updated_at: new Date().toISOString(),
            })
          );

          // Thử trừ lại sau khi warm up
          result = await client.eval(DEDUCT_STOCK_LUA, {
            keys: [stockKey(menuItemId)],
            arguments: [String(quantity)],
          });
        }
      } catch (checkErr) {
        console.warn("DB check in deductStock failed:", checkErr.message);
      }
    }

    if (result === -1) {
      // Món không bật track_inventory (Made-to-order, bán không giới hạn)
      return {
        success: true,
        unlimited: true,
        remaining: null,
        soldOutNow: false,
        lowStockNow: false,
      };
    }

    if (result === -2) {
      // Hết hàng / không đủ số lượng
      const current = await getStock(menuItemId);
      return {
        success: false,
        unlimited: false,
        remaining: current || 0,
        soldOutNow: false,
        lowStockNow: false,
      };
    }

    const remaining = Number(result);
    const inv = await getInventory(menuItemId);
    const threshold = inv.low_stock_threshold || 3;

    return {
      success: true,
      unlimited: false,
      remaining,
      soldOutNow: remaining === 0,
      lowStockNow: remaining > 0 && remaining <= threshold,
      lowStockThreshold: threshold,
    };
  } catch (err) {
    console.warn("Redis deductStock failed:", err.message);
    return {
      success: true,
      unlimited: true,
      remaining: null,
      soldOutNow: false,
      lowStockNow: false,
    };
  }
}

/**
 * Hoàn trả lại số lượng tồn kho trên Redis nếu Database Transaction bị lỗi
 */
async function rollbackStock(menuItemId, quantity) {
  const client = getRedis();
  if (!client) return;

  try {
    const exists = await client.exists(stockKey(menuItemId));
    if (exists) {
      await client.incrBy(stockKey(menuItemId), quantity);
    }
  } catch (err) {
    console.warn("Redis rollbackStock failed:", err.message);
  }
}

module.exports = {
  getStock,
  getInventory,
  setInventory,
  deductStock,
  rollbackStock,
};
