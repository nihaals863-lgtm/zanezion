const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/convert/:orderId', protect, authorize('super_admin', 'operations', 'admin'), missionController.convertOrderToMission);
router.get('/', protect, missionController.getMissions);
router.get('/:id', protect, missionController.getMissionById);
router.post('/:id/assign', protect, authorize('super_admin', 'operations', 'Logistics Lead'), missionController.assignMissionDriver);
router.put('/:id', protect, authorize('super_admin', 'operations'), async (req, res) => {
    try {
        const Mission = require('../models/missionModel');
        const success = await Mission.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Mission not found' });
        res.json({ success: true, message: 'Mission updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.put('/:id/status', protect, missionController.updateMissionStatus);
router.delete('/:id', protect, authorize('super_admin', 'operations'), async (req, res) => {
    try {
        const Mission = require('../models/missionModel');
        const success = await Mission.softDelete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Mission not found' });
        res.json({ success: true, message: 'Mission deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
