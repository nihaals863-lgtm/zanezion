const express = require('express');
const router = express.Router();
const { getClients, getClientById, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, authorize('super_admin', 'operations'), getClients)
    .post(createClient);

router.route('/:id')
    .get(protect, getClientById)
    .put(protect, authorize('super_admin', 'operations'), updateClient)
    .delete(protect, authorize('super_admin'), deleteClient);

module.exports = router;
