const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const auth = require('../middleware/auth');

router.get('/stats', auth, homeController.getDashboardStats);

module.exports = router;