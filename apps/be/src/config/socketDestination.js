// apps/be/src/config/socketDestination.js

const socketDestination = {
  ADMIN: "admin_room",
  KITCHEN: "kitchen_room",
  WAITER: "waiter_room",
  STAFF: "waiter_room",
  CASHIER: "cashier_room",
  TABLE: (tableId) => `table_${tableId}`,
};

module.exports = socketDestination;

