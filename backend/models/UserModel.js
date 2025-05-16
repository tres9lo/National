const pool = require('../config/database'); // Now a pool, not a function
const bcrypt = require('bcryptjs');

class UserModel {
  static async getById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid user ID');
      }
      const [rows] = await pool.execute('SELECT * FROM Users WHERE userId = ?', [id]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw new Error('Failed to fetch user: ' + error.message);
    }
  }

  static async getByEmail(email) {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Invalid email');
      }
      const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
      return rows || [];
    } catch (error) {
      console.error('Error in getByEmail:', error);
      throw new Error('Failed to fetch user by email: ' + error.message);
    }
  }

  static async create(user) {
    try {
      const { username, password, email } = user;
      if (!username || !password || !email) {
        throw new Error('Username, password, and email are required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        'INSERT INTO Users (username, password, email, createdAt, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [username, hashedPassword, email]
      );
      console.log('Created user with ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error in create:', error);
      throw new Error('Failed to create user: ' + error.message);
    }
  }

  static async update(id, user) {
    try {
      const { username, password, email } = user;
      if (!id || isNaN(id)) {
        throw new Error('Invalid user ID');
      }
      if (!username || !password || !email) {
        throw new Error('Username, password, and email are required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        'UPDATE Users SET username = ?, password = ?, email = ?, updatedAt = CURRENT_TIMESTAMP WHERE userId = ?',
        [username, hashedPassword, email, id]
      );
      if (result.affectedRows === 0) {
        throw new Error('User not found or no changes made');
      }
      console.log('Updated user with ID:', id);
      return result.affectedRows;
    } catch (error) {
      console.error('Error in update:', error);
      throw new Error('Failed to update user: ' + error.message);
    }
  }
}

module.exports = UserModel;