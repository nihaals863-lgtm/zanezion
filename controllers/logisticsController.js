const { Vehicle, Delivery, Route, DeliveryPricing } = require('../models/logisticsModel');

const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.getAll();
        res.json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createVehicle = async (req, res) => {
    try {
        const vehicleId = await Vehicle.create(req.body);
        res.status(201).json({ success: true, data: { id: vehicleId, ...req.body } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const success = await Vehicle.update(req.params.id, req.body);
        if (success) {
            res.json({ success: true, message: 'Vehicle updated' });
        } else {
            res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const success = await Vehicle.delete(req.params.id);
        if (success) {
            res.json({ success: true, message: 'Vehicle deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.getAll();
        res.json({ success: true, data: deliveries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createDelivery = async (req, res) => {
    try {
        const deliveryId = await Delivery.create(req.body);
        const newDelivery = await Delivery.getById(deliveryId);
        res.status(201).json({ success: true, data: newDelivery });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, signature, photo } = req.body;
        const success = await Delivery.updateStatus(req.params.id, status, { signature, photo });
        
        if (success) {
            // Auto-generate invoice after delivery (mock logic for now)
            if (status === 'delivered') {
                console.log(`Auto-generating invoice for delivery ${req.params.id}`);
                // In a real system, we'd call an Invoice service here
            }
            res.json({ success: true, message: `Delivery status updated to ${status}` });
        } else {
            res.status(404).json({ success: false, message: 'Delivery not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRoutes = async (req, res) => {
    try {
        const routes = await Route.getAll();
        res.json({ success: true, data: routes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createRoute = async (req, res) => {
    try {
        const routeId = await Route.create(req.body);
        res.status(201).json({ success: true, data: { id: routeId, ...req.body } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRoute = async (req, res) => {
    try {
        const success = await Route.update(req.params.id, req.body);
        if (success) {
            res.json({ success: true, message: 'Route updated' });
        } else {
            res.status(404).json({ success: false, message: 'Route not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteRoute = async (req, res) => {
    try {
        const success = await Route.delete(req.params.id);
        if (success) {
            res.json({ success: true, message: 'Route deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Route not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDeliveryPricing = async (req, res) => {
    try {
        const pricing = await DeliveryPricing.getAll();
        res.json({ success: true, data: pricing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDeliveryPricing = async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const success = await DeliveryPricing.update(id, price);
        if (success) {
            res.json({ success: true, message: 'Pricing updated' });
        } else {
            res.status(404).json({ success: false, message: 'Pricing record not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getDeliveries,
    createDelivery,
    updateDeliveryStatus,
    getRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    getDeliveryPricing,
    updateDeliveryPricing
};
