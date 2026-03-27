const express = require('express');
const router = express.Router();
const { getInventoryItems, getInventoryItemById, createInventoryItem, updateInventoryItem, adjustStock, getInventoryAlerts } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getInventoryItems)
    .post(protect, authorize('super_admin', 'operations', 'inventory'), createInventoryItem);

router.get('/alerts', protect, getInventoryAlerts);

router.route('/:id')
    .get(protect, getInventoryItemById)
    .put(protect, authorize('super_admin', 'operations', 'inventory'), updateInventoryItem)
    .delete(protect, authorize('super_admin', 'operations', 'inventory'), async (req, res) => {
        try {
            const InventoryItem = require('../models/inventoryModel');
            const success = await InventoryItem.softDelete(req.params.id);
            if (!success) return res.status(404).json({ success: false, message: 'Item not found' });
            res.json({ success: true, message: 'Item decommissioned successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

router.route('/:id/adjust').post(protect, authorize('super_admin', 'operations', 'inventory'), adjustStock);

module.exports = router;
