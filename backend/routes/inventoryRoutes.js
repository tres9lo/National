const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

router.get('/', auth, inventoryController.getAllInventory);
router.get('/:id', auth, inventoryController.getInventoryById);
router.post('/stock', auth, inventoryController.stockMovement);

module.exports = router;