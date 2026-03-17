const express = require('express');
const router = express.Router();
const { getSystemSettings, getAllPermissions, updateRolePermissions } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/system', protect, getSystemSettings);
router.get('/permissions', protect, authorize('super_admin'), getAllPermissions);
router.post('/role-permissions', protect, authorize('super_admin'), updateRolePermissions);

module.exports = router;
