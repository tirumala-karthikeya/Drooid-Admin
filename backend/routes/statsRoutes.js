const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');

// Get dashboard stats
router.get('/', getDashboardStats);

module.exports = router; 