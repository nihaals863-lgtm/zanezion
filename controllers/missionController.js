const Mission = require('../models/missionModel');

// @desc    Convert an order into a mission
// @route   POST /api/missions/convert/:orderId
// @access  Private (Operations, Super Admin)
const convertOrderToMission = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const missionData = req.body;

        const missionId = await Mission.createFromOrder(orderId, missionData);
        res.status(201).json({ success: true, message: 'Order successfully converted to Mission', data: { id: missionId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all missions
// @route   GET /api/missions
// @access  Private
const getMissions = async (req, res) => {
    try {
        let missions = await Mission.getAll();

        // Role-based filtering
        const role = req.user.role.toLowerCase().replace(/\s/g, '');
        const userId = req.user.id;

        if (role === 'client') {
            const Client = require('../models/clientModel');
            const clientDetails = await Client.getByUserId(userId);
            if (clientDetails) {
                missions = missions.filter(m => m.client_id === userId); // client_id in mission model refers to users.id of the client
            }
        } else if (role === 'fieldstaff') {
            missions = missions.filter(m => m.assigned_driver === userId);
        }

        res.json({ success: true, count: missions.length, data: missions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get mission by ID
// @route   GET /api/missions/:id
// @access  Private
const getMissionById = async (req, res) => {
    try {
        const mission = await Mission.getById(req.params.id);
        if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
        res.json({ success: true, data: mission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Assign driver to mission
// @route   POST /api/missions/:id/assign
// @access  Private (Operations, Logistics)
const assignMissionDriver = async (req, res) => {
    try {
        const { driverId, vehicleId } = req.body;
        const success = await Mission.assignDriver(req.params.id, driverId, vehicleId);

        if (success) {
            res.json({ success: true, message: 'Driver assigned successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Mission not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update mission status
// @route   PUT /api/missions/:id/status
// @access  Private
const updateMissionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'assigned', 'in_progress', 'en_route', 'completed', 'failed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }
        const success = await Mission.updateStatus(req.params.id, status);

        if (success) {
            res.json({ success: true, message: 'Mission status updated' });
        } else {
            res.status(404).json({ success: false, message: 'Mission not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    convertOrderToMission,
    getMissions,
    getMissionById,
    assignMissionDriver,
    updateMissionStatus
};
