const express = require('express');
const router = express.Router();
const { 
    getVehicles, createVehicle, updateVehicle, deleteVehicle,
    getDeliveries, createDelivery, updateDeliveryStatus,
    getRoutes, createRoute, updateRoute, deleteRoute,
    getDeliveryPricing, updateDeliveryPricing
} = require('../controllers/logisticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Vehicle routes
router.route('/vehicles')
    .get(protect, getVehicles)
    .post(protect, authorize('super_admin', 'logistics'), createVehicle);

router.route('/vehicles/:id')
    .put(protect, authorize('super_admin', 'logistics'), updateVehicle)
    .delete(protect, authorize('super_admin', 'logistics'), deleteVehicle);

// Delivery routes
router.route('/deliveries')
    .get(protect, getDeliveries)
    .post(protect, authorize('super_admin', 'logistics'), createDelivery);

router.route('/deliveries/:id/status')
    .patch(protect, authorize('super_admin', 'logistics', 'field_staff'), updateDeliveryStatus);

// Route routes
router.route('/routes')
    .get(protect, getRoutes)
    .post(protect, authorize('super_admin', 'logistics'), createRoute);

router.route('/routes/:id')
    .put(protect, authorize('super_admin', 'logistics'), updateRoute)
    .delete(protect, authorize('super_admin', 'logistics'), deleteRoute);

// Pricing routes
router.route('/pricing')
    .get(protect, getDeliveryPricing);

router.route('/pricing/:id')
    .put(protect, authorize('super_admin', 'logistics'), updateDeliveryPricing);

module.exports = router;
