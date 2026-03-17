const express = require('express');
const router = express.Router();
const luxuryItemController = require('../controllers/luxuryItemController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Base route: /api/concierge/luxury-items

// All concierge staff can view luxury items
router.get('/', protect, authorize('super_admin', 'concierge'), luxuryItemController.getAllItems);
router.get('/:id', protect, authorize('super_admin', 'concierge'), luxuryItemController.getItemById);

// Only managers/admins can modify luxury items
router.post('/', protect, authorize('super_admin', 'concierge'), luxuryItemController.createItem);
router.put('/:id', protect, authorize('super_admin', 'concierge'), luxuryItemController.updateItem);
router.patch('/:id/status', protect, authorize('super_admin', 'concierge'), luxuryItemController.updateItemStatus);
router.delete('/:id', protect, authorize('super_admin', 'concierge'), luxuryItemController.deleteItem);

module.exports = router;
