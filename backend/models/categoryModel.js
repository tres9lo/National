const pool = require('../config/database');

class CategoryModel {
  static async getAll(userId) {
    try {
      const [rows] = await pool.execute('SELECT * FROM Categories WHERE userId = ?', [userId]);
      return rows || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new Error('Failed to fetch categories: ' + error.message);
    }
  }

  static async getById(id, userId) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid category ID');
      }
      const [rows] = await pool.execute('SELECT * FROM Categories WHERE categoryId = ? AND userId = ?', [id, userId]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw new Error('Failed to fetch category: ' + error.message);
    }
  }

  static async create(category, userId) {
    try {
      const { name, description } = category;
      if (!name) {
        throw new Error('Name is required');
      }
      const [result] = await pool.execute(
        'INSERT INTO Categories (name, description, userId, createdAt, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [name, description || null, userId]
      );
      console.log('Created category with ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error in create:', error);
      throw new Error('Failed to create category: ' + error.message);
    }
  }

  static async update(id, category, userId) {
    try {
      const { name, description } = category;
      if (!id || isNaN(id)) {
        throw new Error('Invalid category ID');
      }
      if (!name) {
        throw new Error('Name is required');
      }
      const [result] = await pool.execute(
        'UPDATE Categories SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE categoryId = ? AND userId = ?',
        [name, description || null, id, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error('Category not found or no changes made');
      }
      console.log('Updated category with ID:', id);
      return result.affectedRows;
    } catch (error) {
      console.error('Error in update:', error);
      throw new Error('Failed to update category: ' + error.message);
    }
  }

  static async delete(id, userId) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid category ID');
      }
      const [result] = await pool.execute('DELETE FROM Categories WHERE categoryId = ? AND userId = ?', [id, userId]);
      if (result.affectedRows === 0) {
        throw new Error('Category not found');
      }
      console.log('Deleted category with ID:', id);
      return result.affectedRows;
    } catch (error) {
      console.error('Error in delete:', error);
      throw new Error('Failed to delete category: ' + error.message);
    }
  }
}

module.exports = CategoryModel;