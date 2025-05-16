const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovementController');
const auth = require('../middleware/auth');

router.get('/', auth, stockMovementController.getAll);
router.get('/:id', auth, stockMovementController.getById);
router.post('/', auth, stockMovementController.create);
router.delete('/:id', auth, stockMovementController.delete);

module.exports = router;