const pool = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching stats for userId:', userId);

    // Fetch total products
    const [productCount] = await pool.execute(
      'SELECT COUNT(*) AS total FROM Products WHERE userId = ?',
      [userId]
    );
    console.log('Product count:', productCount);

    // Fetch total categories
    const [categoryCount] = await pool.execute(
      'SELECT COUNT(*) AS total FROM Categories WHERE userId = ?',
      [userId]
    );
    console.log('Category count:', categoryCount);

    // Fetch total inventory items (updated column name to quantity)
    const [inventoryCount] = await pool.execute(
      'SELECT SUM(quantity) AS total FROM Inventory WHERE userId = ?',
      [userId]
    );
    console.log('Inventory count:', inventoryCount);

    const stats = {
      totalProducts: productCount[0].total || 0,
      totalCategories: categoryCount[0].total || 0,
      totalInventory: inventoryCount[0].total || 0
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats: ' + error.message });
  }
};