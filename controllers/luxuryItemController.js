const LuxuryItem = require('../models/luxuryItemModel');

const luxuryItemController = {
    getAllItems: async (req, res, next) => {
        try {
            const items = await LuxuryItem.getAll();
            res.json({ success: true, data: items });
        } catch (error) {
            next(error);
        }
    },

    getItemById: async (req, res, next) => {
        try {
            const item = await LuxuryItem.getById(req.params.id);
            if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    },

    createItem: async (req, res, next) => {
        try {
            const newItemId = await LuxuryItem.create(req.body);
            const newItem = await LuxuryItem.getById(newItemId);
            res.status(201).json({ success: true, data: newItem, message: 'Luxury item created successfully' });
        } catch (error) {
            next(error);
        }
    },

    updateItem: async (req, res, next) => {
        try {
            const success = await LuxuryItem.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ success: false, message: 'Item not found' });
            const updatedItem = await LuxuryItem.getById(req.params.id);
            res.json({ success: true, data: updatedItem, message: 'Item updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    updateItemStatus: async (req, res, next) => {
        try {
            const { status } = req.body;
            if (!status) return res.status(400).json({ message: 'Status is required' });
            
            const success = await LuxuryItem.updateStatus(req.params.id, status);
            if (!success) return res.status(404).json({ success: false, message: 'Item not found' });
            const updatedItem = await LuxuryItem.getById(req.params.id);
            res.json({ success: true, data: updatedItem, message: 'Item status updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deleteItem: async (req, res, next) => {
        try {
            const success = await LuxuryItem.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Item not found' });
            res.json({ message: 'Item deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = luxuryItemController;
