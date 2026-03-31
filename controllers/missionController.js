const Mission = require('../models/missionModel');
const { Delivery } = require('../models/logisticsModel');

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
            // Auto-create delivery when mission is dispatched
            let missionData = null;
            if (status === 'en_route' || status === 'completed') {
                missionData = await Mission.getById(req.params.id);
            }

            if (status === 'en_route' && missionData) {
                try {
                    // Map mission items to delivery items format
                    const deliveryItems = (missionData.items || []).map(item => ({
                        name: item.name || item.item_name || 'Item',
                        qty: item.quantity || item.qty || 1,
                        weight: item.weight || '',
                        length: item.length || '',
                        width: item.width || '',
                        height: item.height || ''
                    }));

                    const deliveryId = await Delivery.create({
                        order_id: missionData.order_id,
                        vehicle_id: missionData.vehicle_id || null,
                        driver_id: missionData.assigned_driver || null,
                        mission_type: missionData.mission_type || 'Logistics',
                        destination_type: missionData.destination_type || 'Local',
                        package_details: deliveryItems.length > 0 ? deliveryItems : null,
                        items: deliveryItems
                    });
                    console.log('[DISPATCH] Auto-created delivery ID:', deliveryId, 'for mission:', req.params.id);
                } catch (delErr) {
                    console.error('[DISPATCH] Auto-create delivery failed:', delErr.message, delErr.sql || '');
                }
            }

            res.json({ success: true, message: 'Mission status updated', data: missionData });
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
