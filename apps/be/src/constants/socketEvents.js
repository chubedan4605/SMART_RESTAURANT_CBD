// apps/be/src/constants/socketEvents.js
/**
 * Chuẩn hóa danh mục Socket Event Names giữa Backend và Frontend
 */
const SOCKET_EVENTS = {
  // Connection / Lifecycle
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Orders
  NEW_ORDER: "new_order",
  ADMIN_NEW_ORDER: "admin_new_order",
  UPDATE_ORDER: "update_order",
  ADMIN_ORDER_UPDATE: "admin_order_update",
  ORDER_STATUS_UPDATE: "order_status_update",
  ORDER_ITEM_STATUS_UPDATE: "order_item_status_update",
  ADMIN_ORDER_ITEM_UPDATE: "admin_order_item_update",
  ORDER_ITEMS_ADDED: "order_items_added",

  // Tables
  TABLE_UPDATE: "table_update",
  ADMIN_TABLE_UPDATE: "admin_table_update",
  TABLE_SESSION_UPDATE: "table_session_update",
  TABLE_ASSIGNMENT_UPDATE: "table_assignment_update",
  ADMIN_TABLE_ASSIGNMENT_UPDATE: "admin_table_assignment_update",

  // Bill & Payments
  BILL_REQUEST: "bill_request",
  BILL_REQUEST_UPDATE: "bill_request_update",
  BILL_REQUEST_CONFIRMED: "bill_request_confirmed",
  BILL_UPDATE: "bill_update",
  PAYMENT_COMPLETED: "payment_completed",
  ADMIN_PAYMENT_COMPLETED: "admin_payment_completed",

  // Notifications
  TABLE_NOTIFICATION: "table_notification",
};

module.exports = SOCKET_EVENTS;

