const express = require('express');
const router = express.Router();
const { getRoles, getRolePermissions, getAllMenus, createRole, assignMenuPermissions } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getRoles)
    .post(protect, authorize('super_admin'), createRole);

router.route('/menus')
    .get(protect, getAllMenus);

router.route('/:id/permissions')
    .get(protect, getRolePermissions)
    .post(protect, authorize('super_admin'), assignMenuPermissions);

module.exports = router;
