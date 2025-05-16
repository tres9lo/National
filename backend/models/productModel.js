const pool = require('../config/database');

class ProductModel {
  static async getAll(userId) {
    try {
      const [rows] = await pool.execute('SELECT * FROM Products WHERE userId = ?', [userId]);
      return rows;
    } catch (error) {
      throw new Error('Failed to fetch products: ' + error.message);
    }
  }

  static async getById(id, userId) {
    try {
      const [rows] = await pool.execute('SELECT * FROM Products WHERE productId = ? AND userId = ?', [id, userId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to fetch product: ' + error.message);
    }
  }

  static async create(product, userId) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO Products (userId, categoryId, name, sku, description, price, minimumStock, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, product.categoryId, product.name, product.sku, product.description, product.price, product.minimumStock, product.imageUrl]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create product: ' + error.message);
    }
  }

  static async update(id, product, userId) {
    try {
      await pool.execute(
        'UPDATE Products SET categoryId = ?, name = ?, sku = ?, description = ?, price = ?, minimumStock = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE productId = ? AND userId = ?',
        [product.categoryId, product.name, product.sku, product.description, product.price, product.minimumStock, product.imageUrl, id, userId]
      );
    } catch (error) {
      throw new Error('Failed to update product: ' + error.message);
    }
  }

  static async delete(id, userId) {
    try {
      await pool.execute('DELETE FROM Products WHERE productId = ? AND userId = ?', [id, userId]);
    } catch (error) {
      throw new Error('Failed to delete product: ' + error.message);
    }
  }
}

module.exports = ProductModel;