const pool = require('../config/database');

class InventoryModel {
  static async getAll(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      const [rows] = await pool.execute(
        `
          SELECT i.*, p.name AS productName 
          FROM Inventory i 
          JOIN Products p ON i.productId = p.productId 
          WHERE i.userId = ?
        `,
        [userId]
      );
      return rows || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new Error('Failed to fetch inventory: ' + error.message);
    }
  }

  static async getById(id, userId) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid inventory ID');
      }
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      const [rows] = await pool.execute(
        `
          SELECT i.*, p.name AS productName 
          FROM Inventory i 
          JOIN Products p ON i.productId = p.productId 
          WHERE i.inventoryId = ? AND i.userId = ?
        `,
        [id, userId]
      );
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw new Error('Failed to fetch inventory item: ' + error.message);
    }
  }

  static async getByProductId(productId, userId) {
    try {
      if (!productId || isNaN(productId)) {
        throw new Error('Invalid product ID');
      }
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      const [rows] = await pool.execute(
        `
          SELECT i.*, p.name AS productName 
          FROM Inventory i 
          JOIN Products p ON i.productId = p.productId 
          WHERE i.productId = ? AND i.userId = ?
        `,
        [productId, userId]
      );
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getByProductId:', error);
      throw new Error('Failed to fetch inventory by product: ' + error.message);
    }
  }

  static async create(inventory, userId) {
    try {
      const { productId, quantity } = inventory;
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      if (!productId || isNaN(productId)) {
        throw new Error('Invalid product ID');
      }
      if (quantity === undefined || isNaN(quantity) || quantity < 0) {
        throw new Error('Invalid quantity');
      }
      const [result] = await pool.execute(
        'INSERT INTO Inventory (userId, productId, quantity, createdAt, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [userId, productId, quantity]
      );
      console.log('Created inventory item with ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error in create:', error);
      throw new Error('Failed to create inventory item: ' + error.message);
    }
  }

  static async updateQuantity(productId, quantity, userId, type) {
    try {
      // Input validation
      if (!productId || isNaN(productId)) {
        throw new Error('Invalid product ID');
      }
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      if (quantity === undefined || isNaN(quantity) || quantity < 0) {
        throw new Error('Invalid quantity');
      }
      if (!['IN', 'OUT'].includes(type)) {
        throw new Error('Invalid movement type');
      }

      // Fetch current inventory for the product
      let inventory = await this.getByProductId(productId, userId);
      if (!inventory) {
        // If no inventory exists, create one with quantity 0
        await this.create({ productId, quantity: 0 }, userId);
        inventory = await this.getByProductId(productId, userId);
      }

      // Calculate new quantity based on movement type
      let newQuantity;
      if (type === 'IN') {
        newQuantity = inventory.quantity + quantity; // Add for stock-in
      } else if (type === 'OUT') {
        newQuantity = inventory.quantity - quantity; // Subtract for stock-out
        if (newQuantity < 0) {
          throw new Error(`Insufficient stock: current quantity is ${inventory.quantity}, cannot remove ${quantity}`);
        }
      }

      // Update the inventory quantity
      const [result] = await pool.execute(
        'UPDATE Inventory SET quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE inventoryId = ? AND userId = ?',
        [newQuantity, inventory.inventoryId, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error('Failed to update inventory: item not found');
      }

      console.log(`Updated inventory for productId ${productId}: ${type === 'IN' ? 'Stock-in' : 'Stock-out'}, new quantity: ${newQuantity}`);
      return newQuantity;
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      throw new Error('Failed to update inventory quantity: ' + error.message);
    }
  }

  static async delete(id, userId) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid inventory ID');
      }
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      const [result] = await pool.execute('DELETE FROM Inventory WHERE inventoryId = ? AND userId = ?', [id, userId]);
      if (result.affectedRows === 0) {
        throw new Error('Inventory item not found');
      }
      console.log('Deleted inventory item with ID:', id);
      return result.affectedRows;
    } catch (error) {
      console.error('Error in delete:', error);
      throw new Error('Failed to delete inventory item: ' + error.message);
    }
  }
}

module.exports = InventoryModel;