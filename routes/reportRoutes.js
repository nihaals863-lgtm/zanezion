const express = require('express');
const router = express.Router();
const { getFinancialReport, getInventoryReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/financial', protect, authorize('super_admin', 'finance'), getFinancialReport);
router.get('/inventory', protect, authorize('super_admin', 'inventory', 'procurement'), getInventoryReport);

module.exports = router;
