const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const role = req.user.role?.toLowerCase().replace(/\s/g, '');
        const normalizedRole = role || '';
        let stats = {};

        const companyId = req.user.companyId;
        const isHQ = !companyId;
        const tenantFilter = !isHQ ? ' AND company_id = ?' : '';
        const params = !isHQ ? [companyId] : [];
        
        if (role === 'super_admin' || role === 'superadmin') {
            // GLOBAL HQ Stats: Exclude SaaS metrics for Super Admin per user request
            const [globalUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE status = "active"');
            const [globalRevenue] = await db.execute('SELECT SUM(amount) as total FROM invoices WHERE status = "Paid"');
            const [globalOrders] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE status != "cancelled"');
            const [globalInventory] = await db.execute('SELECT SUM(price * quantity) as total FROM inventory_items WHERE deleted_at IS NULL');

            stats = {
                activeTenants: 0, // Super Admin doesn't see SaaS clients
                platformRevenue: Number(globalRevenue[0].total || 0),
                onlineStaff: globalUsers[0].count,
                pendingRequests: 0, 
                openOrders: globalOrders[0].count,
                inventoryValue: Number(globalInventory[0].total || 0)
            };

        } else if (normalizedRole === 'operations') {
            // Operations Admin: See only assigned SaaS metrics
            const [myClients] = await db.execute('SELECT COUNT(*) as count FROM clients WHERE assigned_admin_id = ? OR assigned_admin_id IS NULL', [req.user.id]);
            const [myRequests] = await db.execute('SELECT COUNT(*) as count FROM subscription_requests WHERE status = "Pending" AND (assigned_admin_id = ? OR assigned_admin_id IS NULL)', [req.user.id]);
            const [opsOrders] = await db.execute(`SELECT COUNT(*) as count FROM orders WHERE status != "cancelled"`); // Ops can see all non-tenant orders or change to assigned? User didn't specify orders yet, mainly clients.
            
            stats = {
                activeTenants: myClients[0].count,
                pendingRequests: myRequests[0].count,
                openOrders: opsOrders[0].count,
                onlineStaff: 0 // Could filter or hide
            };
        } else if (normalizedRole === 'client' || normalizedRole === 'saas_client') {
        }

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
