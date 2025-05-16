const InventoryModel = require('../models/inventoryModel');
const StockMovementModel = require('../models/stockMovementModel');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await InventoryModel.getAll(req.user.userId);
    res.status(200).json(inventory);
  } catch (error) {
    console.error('Error in getAllInventory:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await InventoryModel.getById(req.params.id, req.user.userId);
    if (!inventory) return res.status(404).json({ error: 'Inventory item not found' });
    res.status(200).json(inventory);
  } catch (error) {
    console.error('Error in getInventoryById:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.stockMovement = async (req, res) => {
  try {
    const { productId, quantity, type, notes } = req.body;

    // Input validation
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ error: 'Valid product ID is required' });
    }
    if (quantity === undefined || isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ error: 'Valid non-negative quantity is required' });
    }
    if (!['IN', 'OUT'].includes(type)) {
      return res.status(400).json({ error: 'Type must be IN or OUT' });
    }

    // Get current inventory by productId (not inventoryId)
    const currentInventory = await InventoryModel.getByProductId(productId, req.user.userId);

    // Validate stock-out quantity
    if (type === 'OUT') {
      const currentQuantity = currentInventory ? parseInt(currentInventory.quantity) : 0;
      const movementQuantity = parseInt(quantity);
      if (currentQuantity < movementQuantity) {
        return res.status(400).json({
          error: `Insufficient stock: current quantity is ${currentQuantity}, cannot remove ${movementQuantity}`
        });
      }
    }

    // Update inventory quantity (pass the raw quantity to add/subtract)
    const newQuantity = await InventoryModel.updateQuantity(productId, parseInt(quantity), req.user.userId, type);

    // Log the stock movement
    await StockMovementModel.create({ productId, quantity: parseInt(quantity), type, notes }, req.user.userId);

    res.status(200).json({ message: `Stock ${type === 'IN' ? 'added' : 'removed'} successfully`, newQuantity });
  } catch (error) {
    console.error('Error in stockMovement:', error);
    res.status(500).json({ error: error.message });
  }
};