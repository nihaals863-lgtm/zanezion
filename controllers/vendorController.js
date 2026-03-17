const Vendor = require('../models/vendorModel');

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Private
const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.getAll();
        res.json({ success: true, count: vendors.length, data: vendors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get vendor by ID
// @route   GET /api/vendors/:id
// @access  Private
const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.getById(req.params.id);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
        res.json({ success: true, data: vendor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create vendor
// @route   POST /api/vendors
// @access  Private (Procurement, Operations, Super Admin)
const createVendor = async (req, res) => {
    try {
        const vendorId = await Vendor.create(req.body);
        const newVendor = await Vendor.getById(vendorId);
        res.status(201).json({ success: true, data: newVendor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update vendor
// @route   PATCH /api/vendors/:id
// @access  Private
const updateVendor = async (req, res) => {
    try {
        const success = await Vendor.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Vendor not found or no changes' });
        const updatedVendor = await Vendor.getById(req.params.id);
        res.json({ success: true, data: updatedVendor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private (Super Admin)
const deleteVendor = async (req, res) => {
    try {
        const success = await Vendor.softDelete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Vendor not found' });
        res.json({ success: true, message: 'Vendor removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
};
