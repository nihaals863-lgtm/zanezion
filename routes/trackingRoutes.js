const express = require('express');
const router = express.Router();
const Tracking = require('../models/trackingModel');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const data = await Tracking.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const id = await Tracking.create(req.body);
        const record = await Tracking.getById(id);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const success = await Tracking.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Tracking record not found' });
        res.json({ success: true, message: 'Tracking updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const success = await Tracking.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Tracking record not found' });
        res.json({ success: true, message: 'Tracking deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
