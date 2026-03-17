const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const { role } = req.user;
        let stats = {};

        // Shared Stats (if any)
        
        if (role === 'super_admin' || role === 'finance') {
            // Admin/Finance Stats
            const [ordersCount] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status != "cancelled"');
            const [pendingOrders] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status = "pending_review"');
            const [deliveredCount] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
            
            const [revenue] = await db.execute('SELECT SUM(amount) as total FROM invoices WHERE status = "paid"');
            const [outstanding] = await db.execute('SELECT SUM(amount) as total FROM invoices WHERE status != "paid"');
            
            const [inventoryValue] = await db.execute('SELECT SUM(price * quantity) as total FROM inventory_items');
            const [lowStock] = await db.execute('SELECT COUNT(*) as count FROM inventory_items WHERE quantity <= threshold');
            
            const [activeStaff] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role != "Client" AND status = "active"');

            stats = {
                openOrders: pendingOrders[0].count,
                completedOrders: deliveredCount[0].count,
                relevantRevenue: revenue[0].total || 0,
                outstandingRevenue: outstanding[0].total || 0,
                inventoryValue: inventoryValue[0].total || 0,
                lowStockCount: lowStock[0].count,
                onlineStaff: activeStaff[0].count,
                // Add more as needed by Admin/Dashboard.jsx
            };
        } else if (role === 'operations' || role === 'Operational Staff') {
            // Operations Stats
            const [projectsCount] = await db.execute('SELECT COUNT(*) as count FROM projects WHERE status = "in_progress"');
            const [activeMissions] = await db.execute('SELECT COUNT(*) as count FROM missions WHERE status IN ("assigned", "in_progress")');
            const [completedMissions] = await db.execute('SELECT COUNT(*) as count FROM missions WHERE status = "completed"');
            
            stats = {
                activeProjects: projectsCount[0].count,
                activeMissionsCount: activeMissions[0].count,
                missionSuccessRate: completedMissions[0].count > 0 ? ((completedMissions[0].count / (activeMissions[0].count + completedMissions[0].count)) * 100).toFixed(1) : 100
            };
        } else if (role === 'logistics' || role === 'Logistics Lead') {
            // Logistics Stats
            const [activeVehicles] = await db.execute('SELECT COUNT(*) as count FROM vehicles WHERE status = "available"');
            const [onMissionVehicles] = await db.execute('SELECT COUNT(*) as count FROM vehicles WHERE status = "on_mission"');
            const [pendingDeliveries] = await db.execute('SELECT COUNT(*) as count FROM deliveries WHERE status = "pending"');
            
            stats = {
                availableVehicles: activeVehicles[0].count,
                vehiclesOnMission: onMissionVehicles[0].count,
                pendingDeliveriesCount: pendingDeliveries[0].count
            };
        } else if (role === 'inventory' || role === 'Inventory Manager' || role === 'procurement') {
            // Inventory/Procurement Stats
            const [totalItems] = await db.execute('SELECT COUNT(*) as count FROM inventory_items');
            const [lowStock] = await db.execute('SELECT COUNT(*) as count FROM inventory_items WHERE quantity <= threshold');
            const [pendingPO] = await db.execute('SELECT COUNT(*) as count FROM purchase_orders WHERE status = "Pending"');
            
            stats = {
                totalSKUs: totalItems[0].count,
                lowStockItems: lowStock[0].count,
                pendingPurchaseOrders: pendingPO[0].count
            };
        }

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
