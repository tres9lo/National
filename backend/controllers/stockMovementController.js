const StockMovementModel = require('../models/stockMovementModel');

exports.getAll = async (req, res) => {
  try {
    const stockMovements = await StockMovementModel.getAll(req.user.userId);
    res.status(200).json(stockMovements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const stockMovement = await StockMovementModel.getById(req.params.id, req.user.userId);
    if (!stockMovement) return res.status(404).json({ error: 'Stock movement not found' });
    res.status(200).json(stockMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const movement = req.body;
    const movementId = await StockMovementModel.create(movement, req.user.userId);
    res.status(201).json({ movementId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await StockMovementModel.delete(req.params.id, req.user.userId);
    res.status(200).json({ message: 'Stock movement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};