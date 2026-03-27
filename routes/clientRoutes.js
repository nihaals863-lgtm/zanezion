const express = require('express');
const router = express.Router();
const { getClients, getOperationClients, getClientById, createClient, updateClient, deleteClient, getClientMenuPermissions, saveClientMenuPermissions } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, authorize('super_admin', 'operations'), getClients)
    .post(protect, authorize('super_admin', 'operations'), createClient);

router.get('/operation/:operationId', protect, authorize('super_admin', 'operations'), getOperationClients);

router.route('/:id')
    .get(protect, getClientById)
    .put(protect, authorize('super_admin', 'operations'), updateClient)
    .patch(protect, authorize('super_admin', 'operations'), updateClient)
    .delete(protect, authorize('super_admin'), deleteClient);

// SaaS Client menu permissions
router.route('/:id/permissions')
    .get(protect, authorize('super_admin'), getClientMenuPermissions)
    .post(protect, authorize('super_admin'), saveClientMenuPermissions);

module.exports = router;

