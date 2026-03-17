const db = require('../config/db');

const getFinancialReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = 'SELECT * FROM invoices WHERE 1=1';
        let params = [];

        if (startDate) {
            query += ' AND created_at >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND created_at <= ?';
            params.push(endDate);
        }

        const [invoices] = await db.execute(query, params);
        
        const totalRevenue = invoices.reduce((acc, inv) => acc + parseFloat(inv.amount || 0), 0);
        const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + parseFloat(inv.amount || 0), 0);
        const outstanding = totalRevenue - totalPaid;

        res.json({
            success: true,
            data: {
                invoices,
                summary: {
                    totalRevenue,
                    totalPaid,
                    outstanding
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getInventoryReport = async (req, res) => {
    try {
        const [items] = await db.execute('SELECT * FROM inventory_items');
        const [movements] = await db.execute('SELECT * FROM stock_movements WHERE type = "adjustment"');
        
        const totalValuation = items.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0);
        const lowStockItems = items.filter(item => item.quantity <= item.threshold);

        res.json({
            success: true,
            data: {
                items,
                summary: {
                    totalValuation,
                    lowStockCount: lowStockItems.length,
                    movementsCount: movements.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getFinancialReport,
    getInventoryReport
};
