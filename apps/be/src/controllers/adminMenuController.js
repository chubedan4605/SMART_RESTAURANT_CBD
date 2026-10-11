const service = require("../services/adminMenuService");

const sendError = (res, err, defaultMsg) => {
  const status = err?.status || 500;
  if (status === 500) console.error(defaultMsg, err);
  return res.status(status).json({ message: err?.message || defaultMsg });
};

exports.getCategories = async (req, res) => {
  try {
    const data = await service.getCategories(req.query);
    return res.json(data);
  } catch (e) {
    return sendError(res, e, "Không thể tải categories");
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const data = await service.getMenuItems(req.query);
    return res.json(data);
  } catch (e) {
    return sendError(res, e, "Không thể tải menu");
  }
};

exports.getMenuItemDetail = async (req, res) => {
  try {
    const data = await service.getMenuItemDetail(req.params.id);
    if (!data) return res.status(404).json({ message: "Không thể tải món này" });
    return res.json(data);
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const data = await service.createMenuItem(req.body);
    return res.status(201).json(data);
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await service.updateMenuItem(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Không thể tải món này" });
    return res.json({ message: "Updated", id: updated.id });
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

exports.toggleChefRecommended = async (req, res) => {
  try {
    const row = await service.toggleChefRecommended(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Không thể tải món này" });
    return res.json({ id: row.id, isChefRecommended: row.is_chef_recommended });
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const data = await service.createCategory(req.body);
    return res.status(201).json(data);
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const row = await service.deleteMenuItem(req.params.id);
    if (!row) return res.status(404).json({ message: "Không thể tải món này" });
    return res.json({ message: "Deleted", id: row.id });
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

exports.setMenuItemModifierGroups = async (req, res) => {
  try {
    const data = await service.setMenuItemModifierGroups(
      req.params.id,
      req.body,
    );
    return res.json({ message: "Updated modifier groups", ...data });
  } catch (e) {
    return sendError(res, e, "Server error");
  }
};

// GET /admin/menu-items/:id/photos
exports.getPhotos = async (req, res, next) => {
  try {
    const menuItemId = req.params.id;
    const photos = await service.getMenuItemPhotos(menuItemId);
    return res.json({ photos });
  } catch (e) {
    return next(e);
  }
};

// POST /admin/menu-items/:id/photos  (upload.array("images", 10))
exports.uploadPhotos = async (req, res, next) => {
  try {
    const menuItemId = req.params.id;

    // multer-cloudinary sẽ trả file info ở req.files
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "Không có ảnh nào đăng tải" });
    }

    // CloudinaryStorage trả URL ở file.path
    const urls = files.map((f) => f.path).filter(Boolean);

    const photos = await service.addMenuItemPhotos(menuItemId, urls);

    return res.status(201).json({
      message: "Uploaded",
      photos,
    });
  } catch (e) {
    next(e);
  }
};

// PATCH /admin/menu-items/:id/photos/:photoId/primary
exports.setPrimary = async (req, res, next) => {
  try {
    const menuItemId = req.params.id;
    const photoId = req.params.photoId;

    const photos = await service.setPrimaryPhoto(menuItemId, photoId);
    return res.json({ photos });
  } catch (e) {
    return next(e);
  }
};

// DELETE /admin/menu-items/:id/photos/:photoId
exports.deletePhoto = async (req, res, next) => {
  try {
    const menuItemId = req.params.id;
    const photoId = req.params.photoId;

    const photos = await service.removePhoto(menuItemId, photoId);
    return res.json({ photos });
  } catch (e) {
    return next(e);
  }
};

const redisStockService = require("../services/redisStockService");

// GET /admin/items/:id/inventory (chuẩn F&B track_inventory)
exports.getInventory = async (req, res) => {
  try {
    const data = await redisStockService.getInventory(req.params.id);
    return res.json(data);
  } catch (e) {
    return sendError(res, e, "Không thể lấy thông tin tồn kho");
  }
};

// PUT /admin/items/:id/inventory
exports.setInventory = async (req, res) => {
  try {
    const { track_inventory, stock_quantity, low_stock_threshold } = req.body;
    const result = await redisStockService.setInventory(req.params.id, {
      track_inventory: Boolean(track_inventory),
      stock_quantity,
      low_stock_threshold,
    });
    if (!result) {
      return res.status(500).json({ message: "Không thể lưu cấu hình tồn kho" });
    }
    return res.json({
      message: "Đã cập nhật cấu hình quản lý tồn kho thành công",
      inventory: result,
    });
  } catch (e) {
    return sendError(res, e, "Không thể cập nhật cấu hình tồn kho");
  }
};

// GET /admin/items/:id/stock (tương thích ngược)
exports.getItemStock = async (req, res) => {
  try {
    const inv = await redisStockService.getInventory(req.params.id);
    return res.json({
      menu_item_id: req.params.id,
      stock: inv.stock_quantity,
      is_limited: inv.track_inventory,
      low_stock_threshold: inv.low_stock_threshold,
      is_low_stock: inv.is_low_stock,
    });
  } catch (e) {
    return sendError(res, e, "Không thể lấy thông tin tồn kho");
  }
};

// PUT /admin/items/:id/stock (tương thích ngược)
exports.setItemStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === null || quantity === undefined) {
      await redisStockService.setInventory(req.params.id, { track_inventory: false });
      return res.json({ message: "Đã gỡ bỏ giới hạn số lượng món ăn", stock: null });
    }
    const qtyNum = Number(quantity);
    if (Number.isNaN(qtyNum) || qtyNum < 0) {
      return res.status(400).json({ message: "Số lượng phải là số nguyên không âm" });
    }
    await redisStockService.setInventory(req.params.id, {
      track_inventory: true,
      stock_quantity: qtyNum,
    });
    return res.json({
      message: "Đã cập nhật số lượng tồn kho thành công",
      menu_item_id: req.params.id,
      stock: qtyNum,
    });
  } catch (e) {
    return sendError(res, e, "Không thể cập nhật tồn kho");
  }
};


