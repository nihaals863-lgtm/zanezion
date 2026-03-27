const express = require('express');
const router = express.Router();
const accessPlanController = require('../controllers/accessPlanController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Base route: /api/saas/plans

// Anyone authenticated (even clients) can view available plans, and public website needs it too
router.get('/', accessPlanController.getAllPlans);
router.get('/:id', accessPlanController.getPlanById);

// Only super admins can modify access plans
router.post('/', protect, authorize('super_admin'), accessPlanController.createPlan);
router.put('/:id', protect, authorize('super_admin'), accessPlanController.updatePlan);
router.delete('/:id', protect, authorize('super_admin'), accessPlanController.deletePlan);

module.exports = router;
