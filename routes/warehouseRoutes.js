const express = require('express');
const router = express.Router();
const { getWarehouses, getWarehouseById, createWarehouse, updateWarehouse } = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getWarehouses)
    .post(protect, authorize('super_admin', 'operations', 'inventory'), createWarehouse);

router.route('/:id')
    .get(protect, getWarehouseById)
    .patch(protect, authorize('super_admin', 'operations', 'inventory'), updateWarehouse)
    .delete(protect, authorize('super_admin', 'operations', 'inventory'), async (req, res) => {
        try {
            const Warehouse = require('../models/warehouseModel');
            const success = await Warehouse.softDelete(req.params.id);
            if (!success) return res.status(404).json({ success: false, message: 'Warehouse not found' });
            res.json({ success: true, message: 'Warehouse deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

module.exports = router;
