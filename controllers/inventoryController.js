const InventoryItem = require('../models/inventoryModel');

const getInventoryItems = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        let items = await InventoryItem.getAll(companyId);

        // Role-based filtering if more specific than just companyId
        const role = req.user.role.toLowerCase().replace(/\s/g, '');
        if (role === 'client') {
             // For clients, we show both Marketplace items (to buy) and their own Stock (to view)
             // Already handled by InventoryItem.getAll(companyId)
        }

        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getInventoryItemById = async (req, res) => {
    try {
        const item = await InventoryItem.getById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createInventoryItem = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? req.body.companyId : req.user.companyId;
        const payload = {
            ...req.body,
            company_id: companyId,
            inventory_type: req.body.inventoryType || req.body.inventory_type || 'Marketplace',
            client_id: req.body.clientId || req.body.client_id || null
        };
        const itemId = await InventoryItem.create(payload);
        const newItem = await InventoryItem.getById(itemId);
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateInventoryItem = async (req, res) => {
    try {
        const success = await InventoryItem.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Item not found' });
        const updatedItem = await InventoryItem.getById(req.params.id);
        res.json({ success: true, data: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const adjustStock = async (req, res) => {
    try {
        const { quantity, type, reference_type, reference_id } = req.body;
        const success = await InventoryItem.adjustStock(
            req.params.id,
            quantity,
            type,
            reference_type,
            reference_id,
            req.user.id
        );
        if (success) {
            const updatedItem = await InventoryItem.getById(req.params.id);
            res.json({ success: true, data: updatedItem });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getInventoryAlerts = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        const allItems = await InventoryItem.getAll(companyId);
        
        // Filter for items that are low on stock or out of stock
        // status is updated in adjustStock, but we can also filter here for robustness
        const alerts = allItems.filter(item => 
            item.status === 'low_stock' || 
            item.status === 'out_of_stock' || 
            item.quantity < (item.threshold || 10)
        );
        
        res.json({ success: true, count: alerts.length, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getInventoryItems,
    getInventoryItemById,
    getInventoryAlerts,
    createInventoryItem,
    updateInventoryItem,
    adjustStock
};
