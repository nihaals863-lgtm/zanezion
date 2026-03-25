const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const { role } = req.user;
        const normalizedRole = role?.toLowerCase() || '';
        let stats = {};

        // Shared Stats (if any)
        const companyId = req.user.companyId;
        const isHQ = !companyId;
        const tenantFilter = !isHQ ? ' AND company_id = ?' : '';
        const params = !isHQ ? [companyId] : [];
        
        if (role === 'super_admin' || role === 'superadmin') {
            // GLOBAL HQ Stats (Sum across all tenants + Platform)
            const [tenants] = await db.execute('SELECT COUNT(*) as count FROM clients WHERE client_type = "SaaS"');
            const [globalUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE status = "active"');
            const [globalRevenue] = await db.execute('SELECT SUM(amount) as total FROM invoices WHERE status = "Paid"');
            const [globalOrders] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status != "cancelled"');
            const [globalInventory] = await db.execute('SELECT SUM(price * quantity) as total FROM inventory_items WHERE deleted_at IS NULL');
            const [pendingRequests] = await db.execute('SELECT COUNT(*) as count FROM clients WHERE status = "Pending"');

            stats = {
                activeTenants: tenants[0].count,
                platformRevenue: Number(globalRevenue[0].total || 0),
                onlineStaff: globalUsers[0].count,
                pendingRequests: pendingRequests[0].count,
                openOrders: globalOrders[0].count,
                inventoryValue: Number(globalInventory[0].total || 0)
            };

        } else if (normalizedRole === 'client' || normalizedRole === 'saas_client') {
            // Institutional / Tenant Isolated Stats
            const [ordersCount] = await db.execute(`SELECT COUNT(*) as count FROM orders WHERE company_id = ?`, [companyId]);
            const [activeOrders] = await db.execute(`SELECT COUNT(*) as count FROM orders WHERE company_id = ? AND status NOT IN ("Delivered", "Cancelled")`, [companyId]);
            const [shipments] = await db.execute(`SELECT COUNT(*) as count FROM deliveries d JOIN orders o ON d.order_id = o.id WHERE o.company_id = ? AND d.status != "Delivered"`, [companyId]);
            const [assets] = await db.execute(`SELECT COUNT(*) as count FROM inventory_items WHERE company_id = ?`, [companyId]);
            const [unpaidInvoices] = await db.execute(`SELECT COUNT(*) as count FROM invoices i JOIN orders o ON i.order_id = o.id WHERE o.company_id = ? AND i.status != "Paid"`, [companyId]);
            const [activeProjects] = await db.execute(`SELECT COUNT(*) as count FROM projects WHERE company_id = ? AND status = "Active"`, [companyId]);

            stats = {
                openOrders: activeOrders[0].count,
                totalOrders: ordersCount[0].count,
                shipmentsCount: shipments[0].count,
                assetCount: assets[0].count,
                unpaidInvoices: unpaidInvoices[0].count,
                activeProjects: activeProjects[0].count,
                pendingDeliveriesCount: shipments[0].count,
                missionSuccessRate: "98.5" // Placeholder or compute it
            };
        } else {
            // Staff / Operational Stats (filtered by companyId if delegated)
            const [opsOrders] = await db.execute(`SELECT COUNT(*) as count FROM orders WHERE status != "cancelled"${tenantFilter}`, params);
            const [opsInventory] = await db.execute(`SELECT SUM(price * quantity) as total FROM inventory_items WHERE deleted_at IS NULL${tenantFilter}`, params);
            const [opsStaff] = await db.execute(`SELECT COUNT(*) as count FROM users WHERE status = "active"${tenantFilter}`, params);
            
            stats = {
                openOrders: opsOrders[0].count,
                inventoryValue: Number(opsInventory[0].total || 0),
                onlineStaff: opsStaff[0].count
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
