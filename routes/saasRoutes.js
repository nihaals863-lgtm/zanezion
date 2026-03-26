const express = require('express');
const router = express.Router();
const saasController = require('../controllers/saasController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public route for landing page form submission
router.post('/submit', saasController.submitRequest);

// Protected routes for admin management
router.use(protect);
router.use(authorize('super_admin', 'operations'));

router.get('/requests', saasController.getRequests);
router.put('/requests/:id/status', saasController.updateRequestStatus);
router.post('/requests/:id/provision', saasController.provisionClient);
router.delete('/requests/:id', saasController.deleteRequest);

module.exports = router;
