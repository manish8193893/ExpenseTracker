const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardData } = require('../controllers/dashboardController');

const router = express.Router();

// Route to get dashboard data
router.get('/', protect, getDashboardData);

module.exports = router;