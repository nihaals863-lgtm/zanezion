const AccessPlan = require('../models/accessPlanModel');

const accessPlanController = {
    getAllPlans: async (req, res, next) => {
        try {
            const plans = await AccessPlan.getAll();
            res.json(plans);
        } catch (error) {
            next(error);
        }
    },

    getPlanById: async (req, res, next) => {
        try {
            const plan = await AccessPlan.getById(req.params.id);
            if (!plan) return res.status(404).json({ message: 'Plan not found' });
            res.json(plan);
        } catch (error) {
            next(error);
        }
    },

    createPlan: async (req, res, next) => {
        try {
            const newPlanId = await AccessPlan.create(req.body);
            res.status(201).json({ id: newPlanId, message: 'Access plan created successfully' });
        } catch (error) {
            next(error);
        }
    },

    updatePlan: async (req, res, next) => {
        try {
            const success = await AccessPlan.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ message: 'Plan not found' });
            res.json({ message: 'Access plan updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deletePlan: async (req, res, next) => {
        try {
            const success = await AccessPlan.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Plan not found' });
            res.json({ message: 'Access plan deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = accessPlanController;
