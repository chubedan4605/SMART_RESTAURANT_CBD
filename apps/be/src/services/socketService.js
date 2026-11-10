// apps/be/src/services/socketService.js
const SOCKET_EVENTS = require("../constants/socketEvents");
const socketDestination = require("../config/socketDestination");

class SocketService {
  constructor() {
    this.io = null; // Biến lưu trữ instance của Socket.IO
  }

  // Hàm này được gọi 1 lần duy nhất ở server.js
  init(io) {
    this.io = io;
    console.log("✅ SocketService initialized!");

    this.io.on("connection", (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // 1. Admin join phòng admin (Bảo mật RBAC)
      socket.on("join_admin", () => {
        const role = (socket.user?.role || "").toLowerCase();
        if (role === "admin" || role === "superadmin") {
          socket.join(socketDestination.ADMIN);
          console.log(`🛡️ Socket ${socket.id} verified & joined ${socketDestination.ADMIN}`);
        } else {
          console.warn(`[SECURITY ALERT] Unauthorized join_admin from socket ${socket.id}`);
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Unauthorized: Admin role required" });
        }
      });

      // 2. Waiter join phòng waiter (Bảo mật RBAC)
      socket.on("join_waiter", () => {
        const role = (socket.user?.role || "").toLowerCase();
        if (role === "waiter" || role === "admin" || role === "superadmin") {
          socket.join(socketDestination.WAITER);
          console.log(`👩‍🍳 Socket ${socket.id} verified & joined ${socketDestination.WAITER}`);
        } else {
          console.warn(`[SECURITY ALERT] Unauthorized join_waiter from socket ${socket.id}`);
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Unauthorized: Waiter role required" });
        }
      });

      // 3. Kitchen join phòng bếp (Bảo mật RBAC)
      socket.on("join_kitchen", () => {
        const role = (socket.user?.role || "").toLowerCase();
        if (role === "kitchen" || role === "admin" || role === "superadmin") {
          socket.join(socketDestination.KITCHEN);
          console.log(`🍳 Socket ${socket.id} verified & joined ${socketDestination.KITCHEN}`);
        } else {
          console.warn(`[SECURITY ALERT] Unauthorized join_kitchen from socket ${socket.id}`);
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Unauthorized: Kitchen role required" });
        }
      });

      // 4. Khách hàng join phòng bàn ăn (Bảo mật QR Session)
      socket.on("join_table", (data) => {
        const tableCode =
          data?.tableCode ||
          socket.handshake.query?.tableCode ||
          socket.table?.table_number ||
          socket.table?.table_id;
        const role = (socket.user?.role || "").toLowerCase();
        const isStaff = role === "admin" || role === "superadmin" || role === "waiter";

        if (tableCode) {
          const isTableOwner =
            socket.table &&
            (String(socket.table.table_id) === String(tableCode) ||
              String(socket.table.table_number) === String(tableCode));

          if (isStaff || isTableOwner || socket.user) {
            socket.join(socketDestination.TABLE(tableCode));
            console.log(`🪑 Socket ${socket.id} authorized & joined table_${tableCode}`);
          } else {
            console.warn(
              `[SECURITY ALERT] Unauthorized join_table attempt to table_${tableCode} from socket ${socket.id}`
            );
            socket.emit(SOCKET_EVENTS.ERROR, {
              message: "Unauthorized: QR token required to join table",
            });
          }
        }
      });
    });
  }

  // --- CÁC HÀM GỌI TỪ SERVICE KHÁC ---

  // 1. Thông báo đơn mới
  notifyNewOrder(order) {
    if (!this.io) {
      console.warn("⚠️ SocketIO chưa được khởi tạo!");
      return;
    }
    // Gửi cho waiter
    this.io.to(socketDestination.WAITER).emit(SOCKET_EVENTS.NEW_ORDER, order);

    // Gửi thêm cho admin room để admin nhận thông báo
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_NEW_ORDER, {
      type: "new_order",
      order: order,
      message: `Đơn hàng mới từ Bàn ${order.table_number || order.table_id}`,
      timestamp: new Date().toISOString(),
    });
    console.log("📡 Đã thông báo đơn mới cho admin & waiter:", order.id);
  }

  // Thông báo món ăn đã hết hàng cho toàn bộ khách, bếp, admin
  notifyItemSoldOut(menuItemId, itemName) {
    if (!this.io) return;
    this.io.emit("item_sold_out", {
      menu_item_id: menuItemId,
      name: itemName,
      status: "sold_out",
    });
    console.log(`📡 Broadcasted sold out for item ${itemName} (${menuItemId})`);
  }

  // Thông báo cảnh báo món ăn sắp hết hàng (Low Stock) cho Bếp, Phục vụ, Admin
  notifyItemLowStock(menuItemId, itemName, remaining) {
    if (!this.io) return;
    this.io.to("kitchen_room").to("waiter_room").to("admin_room").emit("item_low_stock", {
      menu_item_id: menuItemId,
      name: itemName,
      remaining,
      message: `Cảnh báo: Món '${itemName}' chỉ còn lại ${remaining} phần!`,
    });
    console.log(`⚠️ Low stock alert for ${itemName}: ${remaining} left`);
  }

  // 2. Thông báo cập nhật đơn hàng (Status thay đổi)
  notifyToKitchen(order) {
    if (!this.io) return;
    this.io.to(socketDestination.KITCHEN).emit(SOCKET_EVENTS.UPDATE_ORDER, order);
  }

  notifyOrderUpdate(order, destination = "ALL") {
    if (!this.io) return;

    if (destination === "KITCHEN") {
      this.io.to(socketDestination.KITCHEN).emit(SOCKET_EVENTS.UPDATE_ORDER, order);
      console.log("📡 Bắn socket cập nhật đơn cho kitchen:", order.id);
      return;
    }

    // khi cập nhật order luôn gửi cho admin, waiter và khách
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_ORDER_UPDATE, {
      type: "order_update",
      order: order,
      message: `Đơn #${order.id} - ${this._getStatusMessage(order.status)}`,
      timestamp: new Date().toISOString(),
    });

    // Bắn cho waiter_room để nhân viên theo dõi tiến độ
    this.io.to(socketDestination.WAITER).emit(SOCKET_EVENTS.UPDATE_ORDER, order);

    this.io.to(socketDestination.TABLE(order.table_id)).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATE, {
      orderId: order.id,
      status: order.status,
      message: this._getStatusMessage(order.status),
      timestamp: new Date().toISOString(),
    });

    console.log(
      "📡 Bắn socket cập nhật đơn:",
      order.id,
      "Status:",
      order.status,
      "table:",
      order.table_id,
    );
  }

  // Thông báo cập nhật từng item trong đơn
  notifyOrderItemUpdate(orderId, itemId, itemStatus, tableId) {
    if (!this.io) return;

    console.log(
      `📡 Bắn socket item update: Order ${orderId}, Item ${itemId} -> ${itemStatus}`,
    );

    // bắn cho admin
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_ORDER_ITEM_UPDATE, {
      orderId,
      itemId,
      itemStatus,
      timestamp: new Date().toISOString(),
    });

    // bắn cho waiter
    this.io.to(socketDestination.WAITER).emit(SOCKET_EVENTS.ORDER_ITEM_STATUS_UPDATE, {
      orderId,
      itemId,
      itemStatus,
      timestamp: new Date().toISOString(),
    });

    // Bắn cho khách ở bàn đó
    if (tableId) {
      this.io.to(socketDestination.TABLE(tableId)).emit(SOCKET_EVENTS.ORDER_ITEM_STATUS_UPDATE, {
        orderId,
        itemId,
        itemStatus,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Thông báo có yêu cầu thanh toán mới
  notifyBillRequest(data) {
    if (this.io) {
      // Gửi cho tất cả staff (waiter, cashier, admin)
      this.io.to(socketDestination.WAITER).emit(SOCKET_EVENTS.BILL_REQUEST, data);
      this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.BILL_REQUEST, data);
      console.log(
        "📢 Bill request notification sent:",
        data.request?.table_number,
      );
    }
  }

  // Thông báo cập nhật trạng thái yêu cầu thanh toán
  notifyBillRequestUpdate(data) {
    if (this.io) {
      // Gửi cho staff (waiter + admin) - Đã sửa lỗi phòng ma 'staff'
      this.io.to(socketDestination.WAITER).to(socketDestination.ADMIN).emit(SOCKET_EVENTS.BILL_REQUEST_UPDATE, data);
      // Gửi cho bàn cụ thể (nếu khách đang xem)
      if (data.tableId) {
        this.io.to(socketDestination.TABLE(data.tableId)).emit(SOCKET_EVENTS.BILL_REQUEST_UPDATE, data);
      }
    }
  }

  // Helper: Tạo message dễ hiểu cho khách
  _getStatusMessage(status) {
    const messages = {
      received: "📝 Đơn đã được tiếp nhận",
      preparing: "🔥 Bếp đang chuẩn bị",
      ready: "✅ Đơn đã sẵn sàng!",
      completed: "💰 Thanh toán hoàn tất",
      rejected: "❌ Đơn đã bị hủy",
    };
    return messages[status] || "📦 Cập nhật đơn hàng";
  }

  // Chấp nhận cả 2 cách gọi: notifyTableUpdate(tableData) hoặc notifyTableUpdate(io, tableData)
  notifyTableUpdate(arg1, arg2) {
    if (!this.io) return;

    let tableData;
    if (arg2 !== undefined) {
      tableData = arg2;
    } else {
      tableData = arg1;
    }

    const table = tableData.table || tableData;
    const type = tableData.type || "update";

    console.log(
      "📡 Bắn socket update bàn:",
      table.table_number || table.id,
      "- Type:",
      type,
    );

    // Gửi bill_update cho bàn nếu có id
    if (table.id) {
      this.io.to(socketDestination.TABLE(table.id)).emit(SOCKET_EVENTS.BILL_UPDATE, {
        message: this._getStatusMessage("completed"),
        timestamp: new Date().toISOString(),
      });
    }

    this.io
      .to(socketDestination.ADMIN)
      .to(socketDestination.KITCHEN)
      .emit(SOCKET_EVENTS.TABLE_UPDATE, { type, table });

    // Gửi thông báo riêng cho admin về cập nhật bàn
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, {
      type: "table_update",
      table: table,
      message: `Bàn ${table.table_number || table.id} đã được cập nhật`,
      timestamp: new Date().toISOString(),
    });
  }

  // Thông báo khi có session mới (khách quét QR vào bàn)
  notifyTableSessionUpdate(data) {
    if (!this.io) return;
    console.log("SocketService: notifyTableSessionUpdate", data);

    const { table, session, type } = data;
    console.log(
      "📡 Bắn socket table session:",
      table?.table_number,
      "- Type:",
      type,
    );

    // Gửi cho admin và kitchen
    this.io
      .to(socketDestination.ADMIN)
      .to(socketDestination.KITCHEN)
      .emit(SOCKET_EVENTS.TABLE_SESSION_UPDATE, {
        type: type, // 'session_started' hoặc 'session_ended'
        table: table,
        session: session,
        timestamp: new Date().toISOString(),
      });

    // Cũng emit table_update để cập nhật trạng thái bàn
    this.io
      .to(socketDestination.ADMIN)
      .to(socketDestination.KITCHEN)
      .emit(SOCKET_EVENTS.TABLE_UPDATE, {
        type: "update",
        table: table,
      });

    // Gửi thông báo cho admin
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, {
      type: "table_session",
      table: table,
      message:
        type === "session_started"
          ? `🟢 Bàn ${table.table_number} có khách mới!`
          : `⚪ Bàn ${table.table_number} đã trống`,
      timestamp: new Date().toISOString(),
    });
  }

  // Thông báo thanh toán thành công cho admin, waiter và kitchen
  notifyPaymentCompleted(data) {
    if (!this.io) return;

    const { table_id, table_number, bill, orders_count, total_amount } = data;

    console.log(
      "📡 Bắn socket thanh toán thành công - Bàn:",
      table_number,
      "- Tổng tiền:",
      total_amount,
    );

    // Gửi cho admin room
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_PAYMENT_COMPLETED, {
      type: "payment_completed",
      table_id: table_id,
      table_number: table_number,
      bill: bill,
      orders_count: orders_count,
      total_amount: total_amount,
      message: `💰 Bàn ${table_number} đã thanh toán ${total_amount?.toLocaleString("vi-VN")}₫`,
      timestamp: new Date().toISOString(),
    });

    // Gửi cho waiter room để waiter biết
    this.io.to(socketDestination.WAITER).emit(SOCKET_EVENTS.PAYMENT_COMPLETED, {
      table_id: table_id,
      table_number: table_number,
      bill: bill,
      total_amount: total_amount,
      message: `💰 Bàn ${table_number} đã thanh toán xong!`,
      timestamp: new Date().toISOString(),
    });

    // Cũng gửi cho kitchen room
    this.io.to(socketDestination.KITCHEN).emit(SOCKET_EVENTS.PAYMENT_COMPLETED, {
      table_id: table_id,
      table_number: table_number,
      total_amount: total_amount,
      timestamp: new Date().toISOString(),
    });
  }

  // Thông báo thay đổi phân công bàn cho waiter
  notifyTableAssignmentUpdate(data) {
    if (!this.io) return;

    const { waiterId, waiterName, tableIds, tables } = data;

    console.log(
      "📡 Bắn socket cập nhật phân công bàn - Waiter:",
      waiterName,
      "- Tables:",
      tableIds?.length || 0,
    );

    // Emit cho tất cả waiter room để waiter tự kiểm tra
    this.io.to(socketDestination.WAITER).emit(SOCKET_EVENTS.TABLE_ASSIGNMENT_UPDATE, {
      waiterId: waiterId,
      waiterName: waiterName,
      tableIds: tableIds,
      tables: tables,
      message: `Danh sách bàn phụ trách đã được cập nhật`,
      timestamp: new Date().toISOString(),
    });

    // Cũng gửi cho admin room để admin biết
    this.io.to(socketDestination.ADMIN).emit(SOCKET_EVENTS.ADMIN_TABLE_ASSIGNMENT_UPDATE, {
      type: "table_assignment",
      waiterId: waiterId,
      waiterName: waiterName,
      tableIds: tableIds,
      message: `Đã cập nhật phân công bàn cho ${waiterName}`,
      timestamp: new Date().toISOString(),
    });
  }
}

// Xuất ra một instance duy nhất (Singleton)
module.exports = new SocketService();
