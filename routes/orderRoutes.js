const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, createOrder, updateOrderStatus, getProjects, createProject, createProjectFromOrder, updateProjectStatus, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Order routes
router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, authorize('super_admin', 'operations'), async (req, res) => {
        try {
            const { Order } = require('../models/orderModel');
            const success = await Order.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ success: false, message: 'Order not found' });
            res.json({ success: true, message: 'Order updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })
    .delete(protect, authorize('super_admin', 'operations'), deleteOrder);

router.route('/:id/status').patch(protect, authorize('super_admin', 'operations'), updateOrderStatus);

// Project conversion
router.route('/convert/:orderId').post(protect, authorize('super_admin', 'operations'), createProjectFromOrder);

// Project routes
router.route('/projects/all').get(protect, getProjects);
router.route('/projects')
    .post(protect, authorize('super_admin', 'operations'), createProject);
router.route('/projects/:id')
    .put(protect, authorize('super_admin', 'operations'), async (req, res) => {
        try {
            const { Project } = require('../models/orderModel');
            const success = await Project.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ success: false, message: 'Project not found' });
            res.json({ success: true, message: 'Project updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })
    .delete(protect, authorize('super_admin', 'operations'), async (req, res) => {
        try {
            const { Project } = require('../models/orderModel');
            const success = await Project.softDelete(req.params.id);
            if (!success) return res.status(404).json({ success: false, message: 'Project not found' });
            res.json({ success: true, message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

router.route('/projects/:id/status').patch(protect, authorize('super_admin', 'operations'), updateProjectStatus);

module.exports = router;
