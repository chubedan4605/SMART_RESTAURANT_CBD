const repo = require("../repositories/menuRepository");
const cache = require("./cache");

const {
  MENU_CACHE_VERSION_KEY,
  MENU_PUBLIC_TTL_SECONDS,
  MENU_GUEST_TTL_SECONDS,
  MENU_TOPCHEF_TTL_SECONDS,
} = require("../config/cache");

function toInt(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

// ===== CATEGORIES =====
exports.getCategories = async () => {
  return repo.findAllCategories();
};

exports.createCategory = async (payload) => {
  const name = payload.name?.trim();
  if (!name) {
    const err = new Error("Tên danh mục không được trống");
    err.status = 400;
    throw err;
  }

  try {
    const created = await repo.insertCategory({
      name,
      description: payload.description ?? null,
      display_order: payload.display_order ?? 0,
      status: payload.status ?? "active",
    });

    await cache.bumpVersion(MENU_CACHE_VERSION_KEY);

    return created;
  } catch (e) {
    // unique violation
    if (e.code === "23505") {
      const err = new Error("Tên danh mục đã tồn tại");
      err.status = 400;
      throw err;
    }
    throw e;
  }
};

exports.updateCategory = async (id, payload) => {
  const updated = await repo.updateCategoryById(id, {
    name: payload.name?.trim(),
    description: payload.description,
    display_order: payload.display_order,
    status: payload.status,
  });

  if (!updated) {
    const err = new Error("Không tìm thấy danh mục");
    err.status = 404;
    throw err;
  }

  await cache.bumpVersion(MENU_CACHE_VERSION_KEY);

  return updated;
};

// ===== MENU ITEMS =====
exports.getMenuItemsAdmin = async (query) => {
  const page = Math.max(1, toInt(query.page, 1));
  const limit = Math.min(200, Math.max(1, toInt(query.limit, 100)));
  const offset = (page - 1) * limit;

  return repo.findMenuItemsAdmin({
    page,
    limit,
    offset,
    search: query.search ? String(query.search).trim() : "",
    category_id: query.category_id || null,
    status: query.status || null,
    sort: query.sort || "newest",
  });
};

exports.getMenuItemDetail = async (id) => {
  const item = await repo.findMenuItemById(id);
  if (!item) {
    const err = new Error("Không tìm thấy món");
    err.status = 404;
    throw err;
  }
  const groups = await repo.findModifierGroupsByMenuItemId(id);
  return { ...item, modifier_groups: groups };
};

exports.createMenuItem = async (body, filePathOrNull) => {
  const name = body.name?.trim();
  if (!name || name.length < 2 || name.length > 80) {
    const err = new Error("Tên món phải từ 2 đến 80 ký tự.");
    err.status = 400;
    throw err;
  }

  const numericPrice = Number(body.price);
  if (
    !body.price ||
    Number.isNaN(numericPrice) ||
    numericPrice <= 0 ||
    numericPrice > 100000000
  ) {
    const err = new Error("Giá phải là số dương hợp lệ (1 - 100,000,000 VND).");
    err.status = 400;
    throw err;
  }

  let prep = 15;
  if (body.prep_time_minutes !== undefined && body.prep_time_minutes !== "") {
    const t = Number(body.prep_time_minutes);
    if (Number.isNaN(t) || t < 0 || t > 240) {
      const err = new Error("Thời gian chuẩn bị phải từ 0 đến 240 phút.");
      err.status = 400;
      throw err;
    }
    prep = t;
  }

  if (!body.category_id) {
    const err = new Error("Vui lòng chọn danh mục.");
    err.status = 400;
    throw err;
  }

  const cat = await repo.findCategoryId(body.category_id);
  if (!cat) {
    const err = new Error("Danh mục không tồn tại.");
    err.status = 400;
    throw err;
  }

  const newItem = await repo.insertMenuItem({
    category_id: body.category_id,
    name,
    description: body.description ?? null,
    price: numericPrice,
    prep_time_minutes: prep,
    status: body.status ?? "available",
    is_chef_recommended:
      body.is_chef_recommended === "true" || body.is_chef_recommended === true,
  });

  // Nếu có ảnh, thêm vào menu_item_photos và set là primary
  if (filePathOrNull) {
    await repo.insertMenuItemPhoto(newItem.id, filePathOrNull, true);
  }

  await cache.bumpVersion(MENU_CACHE_VERSION_KEY);

  return newItem;
};

exports.updateMenuItem = async (id, body, imageUrlOrUndefined) => {
  console.log("Updating menu item", { id, body, imageUrlOrUndefined });
  // validate partial
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (name.length < 2 || name.length > 80) {
      const err = new Error("Tên món phải từ 2 đến 80 ký tự.");
      err.status = 400;
      throw err;
    }
  }

  if (body.price !== undefined) {
    const p = Number(body.price);
    if (Number.isNaN(p) || p <= 0 || p > 100000000) {
      const err = new Error(
        "Giá phải là số dương hợp lệ (1 - 100,000,000 VND).",
      );
      err.status = 400;
      throw err;
    }
  }

  if (body.prep_time_minutes !== undefined && body.prep_time_minutes !== "") {
    const t = Number(body.prep_time_minutes);
    if (Number.isNaN(t) || t < 0 || t > 240) {
      const err = new Error("Thời gian chuẩn bị phải từ 0 đến 240 phút.");
      err.status = 400;
      throw err;
    }
  }

  if (body.category_id) {
    const cat = await repo.findCategoryId(body.category_id);
    if (!cat) {
      const err = new Error("Danh mục mới không tồn tại.");
      err.status = 400;
      throw err;
    }
  }

  // build dynamic update
  const fields = [];
  const values = [];
  let idx = 1;

  if (body.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(String(body.name).trim());
  }
  if (body.price !== undefined) {
    fields.push(`price = $${idx++}`);
    values.push(Number(body.price));
  }
  if (body.category_id !== undefined) {
    fields.push(`category_id = $${idx++}`);
    values.push(body.category_id);
  }
  if (body.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(body.status);
  }
  if (body.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(body.description);
  }
  if (body.prep_time_minutes !== undefined) {
    fields.push(`prep_time_minutes = $${idx++}`);
    values.push(Number(body.prep_time_minutes));
  }
  if (body.is_chef_recommended !== undefined) {
    fields.push(`is_chef_recommended = $${idx++}`);
    values.push(
      body.is_chef_recommended === "true" || body.is_chef_recommended === true,
    );
  }
  // image_url đã chuyển sang bảng menu_item_photos, không cập nhật ở đây nữa

  if (fields.length === 0 && !imageUrlOrUndefined) {
    const err = new Error("Không có dữ liệu nào thay đổi");
    err.status = 400;
    throw err;
  }

  fields.push("updated_at = NOW()");
  values.push(id);

  const updated = await repo.updateMenuItemById(id, fields, values);
  if (!updated) {
    const err = new Error("Không tìm thấy món ăn");
    err.status = 404;
    throw err;
  }

  await cache.bumpVersion(MENU_CACHE_VERSION_KEY);
  return updated;
};

exports.deleteMenuItem = async (id) => {
  await repo.softDeleteMenuItem(id);
  await cache.bumpVersion(MENU_CACHE_VERSION_KEY);
  return { message: "Đã xóa (Soft delete)" };
};

exports.addItemPhotos = async (id, files) => {
  if (!files || files.length === 0) {
    const err = new Error("Chưa chọn ảnh");
    err.status = 400;
    throw err;
  }
  await Promise.all(files.map((f) => repo.insertMenuItemPhoto(id, f.path)));
  await cache.bumpVersion(MENU_CACHE_VERSION_KEY);
  return { message: `Đã thêm ${files.length} ảnh` };
};

exports.getGuestMenu = async () => {
  const version = await cache.getVersion(MENU_CACHE_VERSION_KEY);
  const cacheKey = cache.buildKey([`menu:guest`, `v:${version}`]);

  const cached = await cache.getJson(cacheKey);
  if (cached) return cached;

  const data = await repo.findGuestMenu();
  await cache.setJson(cacheKey, MENU_GUEST_TTL_SECONDS, data);
  return data;
};

exports.getRelatedMenuItems = async (id) => {
  // 1. Lấy thông tin món hiện tại để biết nó thuộc danh mục nào
  const currentItem = await repo.findMenuItemById(id);

  if (!currentItem) {
    const err = new Error("Không tìm thấy món ăn");
    err.status = 404;
    throw err;
  }

  const relatedItems = await repo.findRelatedItemsByCategory(
    currentItem.category_id,
    id,
  );

  return relatedItems;
};

exports.getMenuItemsPublic = async (query) => {
  const page = Math.max(1, toInt(query.page, 1));
  const limit = Math.min(50, Math.max(1, toInt(query.limit, 12)));
  const offset = (page - 1) * limit;

  const search = query.search ? String(query.search).trim() : "";
  const category_id = query.category_id || null;
  const sort = query.sort || "newest"; // "popularity" | "newest"

  const chef =
    query.chef === true ||
    query.chef === "true" ||
    query.chef === 1 ||
    query.chef === "1";

  const version = await cache.getVersion(MENU_CACHE_VERSION_KEY);
  const cacheKey = cache.buildKey([
    "menu:public",
    `v:${version}`,
    `page:${page}`,
    `limit:${limit}`,
    `category:${category_id || "all"}`,
    `sort:${sort}`,
    `search:${cache.encodeOrHash(search)}`,
    `chef:${chef ? 1 : 0}`,
  ]);

  const cached = await cache.getJson(cacheKey);
  if (cached) return cached;

  const { rows, total } = await repo.findMenuItemsPublic({
    category_id,
    search,
    sort,
    limit,
    offset,
    chef,
  });

  const payload = {
    data: rows,
    meta: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  };

  await cache.setJson(cacheKey, MENU_PUBLIC_TTL_SECONDS, payload);
  return payload;
};

exports.getTopChefBestSeller = async (limit) => {
  const version = await cache.getVersion(MENU_CACHE_VERSION_KEY);
  const cacheKey = cache.buildKey([
    `menu:top-chef`,
    `v:${version}`,
    `limit:${limit}`,
  ]);

  const cached = await cache.getJson(cacheKey);
  if (cached) return cached;

  const rows = await repo.findTopChefBestSeller(limit);
  const data = rows.map((r) => ({
    id: r.id,
    name: r.name,
    categoryId: r.category_id,
    price: Number(r.price),
    description: r.description,
    image: r.image_url,
    soldQty: Number(r.sold_qty),
  }));

  await cache.setJson(cacheKey, MENU_TOPCHEF_TTL_SECONDS, data);
  return data;
};
