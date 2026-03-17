const Warehouse = require('../models/warehouseModel');

const getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.getAll();
        res.json({ success: true, count: warehouses.length, data: warehouses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.getById(req.params.id);
        if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });
        res.json({ success: true, data: warehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createWarehouse = async (req, res) => {
    try {
        const warehouseId = await Warehouse.create(req.body);
        const newWarehouse = await Warehouse.getById(warehouseId);
        res.status(201).json({ success: true, data: newWarehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateWarehouse = async (req, res) => {
    try {
        const success = await Warehouse.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Warehouse not found' });
        const updatedWarehouse = await Warehouse.getById(req.params.id);
        res.json({ success: true, data: updatedWarehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse
};
