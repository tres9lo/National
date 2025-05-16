const pool = require('../config/database');

class StockMovementModel {
  static async getAll(userId) {
    try {
      const [rows] = await pool.execute(
        `
          SELECT sm.*, p.name AS productName 
          FROM StockMovements sm 
          JOIN Products p ON sm.productId = p.productId 
          WHERE sm.userId = ?
          ORDER BY sm.createdAt DESC
        `,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error('Failed to fetch stock movements: ' + error.message);
    }
  }

  static async getById(id, userId) {
    try {
      const [rows] = await pool.execute(
        `
          SELECT sm.*, p.name AS productName 
          FROM StockMovements sm 
          JOIN Products p ON sm.productId = p.productId 
          WHERE sm.movementId = ? AND sm.userId = ?
        `,
        [id, userId]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Failed to fetch stock movement: ' + error.message);
    }
  }

  static async create(movement, userId) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO StockMovements (userId, productId, quantity, type, notes) VALUES (?, ?, ?, ?, ?)',
        [userId, movement.productId, movement.quantity, movement.type, movement.notes]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create stock movement: ' + error.message);
    }
  }

  static async delete(id, userId) {
    try {
      await pool.execute('DELETE FROM StockMovements WHERE movementId = ? AND userId = ?', [id, userId]);
    } catch (error) {
      throw new Error('Failed to delete stock movement: ' + error.message);
    }
  }

  static async getReport(userId, startDate, endDate, productId, type) {
    try {
      let query = `
        SELECT sm.*, p.name AS productName 
        FROM StockMovements sm 
        JOIN Products p ON sm.productId = p.productId 
        WHERE sm.userId = ? AND sm.createdAt BETWEEN ? AND ?
      `;
      const params = [userId, `${startDate} 00:00:00`, `${endDate} 23:59:59`];

      console.log('Query params:', { userId, startDate, endDate, productId, type });

      if (productId) {
        query += ' AND sm.productId = ?';
        params.push(productId);
      }

      if (type) {
        query += ' AND sm.type = ?';
        params.push(type);
      }

      query += ' ORDER BY sm.createdAt DESC';

      const [rows] = await pool.execute(query, params);
      console.log('Raw query result:', rows);
      return rows;
    } catch (error) {
      console.error('Error in getReport:', error);
      throw new Error('Failed to fetch stock movement report: ' + error.message);
    }
  }
}

module.exports = StockMovementModel;