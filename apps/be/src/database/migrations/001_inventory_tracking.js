/**
 * Migration 001: Add inventory tracking columns to menu_items table
 */
module.exports = {
  name: "001_inventory_tracking",
  up: async (client) => {
    const sql = `
      ALTER TABLE menu_items 
      ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 3;
    `;
    await client.query(sql);
  },
  down: async (client) => {
    const sql = `
      ALTER TABLE menu_items 
      DROP COLUMN IF EXISTS track_inventory,
      DROP COLUMN IF EXISTS stock_quantity,
      DROP COLUMN IF EXISTS low_stock_threshold;
    `;
    await client.query(sql);
  },
};
