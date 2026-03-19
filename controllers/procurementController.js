const { PurchaseOrder, PurchaseRequest, Quote } = require('../models/procurementModel');

// @desc    Create new Purchase Order
// @route   POST /api/procurement/po
// @access  Private (Procurement/Admin)
const createPO = async (req, res) => {
    try {
        const payload = { ...req.body, companyId: req.user.companyId };
        const poId = await PurchaseOrder.create(payload);
        const newPO = await PurchaseOrder.getById(poId, req.user.companyId);
        res.status(201).json({ success: true, data: newPO });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all Purchase Orders
// @route   GET /api/procurement/po
// @access  Private
const getAllPOs = async (req, res) => {
    try {
        const pos = await PurchaseOrder.getAll(req.user.companyId);
        res.json({ success: true, data: pos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get PO by ID
// @route   GET /api/procurement/po/:id
// @access  Private
const getPOById = async (req, res) => {
    try {
        const po = await PurchaseOrder.getById(req.params.id, req.user.companyId);
        if (!po) return res.status(404).json({ success: false, message: 'PO not found' });
        res.json({ success: true, data: po });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Purchase Order
// @route   PUT /api/procurement/po/:id
// @access  Private (Procurement/Admin)
const updatePO = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Authorization Workflow logic
        if (updateData.approvalStatus && updateData.approvalStatus !== 'Pending') {
            if (req.user.role !== 'Super Admin' && req.user.role !== 'super_admin') {
                return res.status(403).json({ success: false, message: 'Only a Super Admin can approve or reject Purchase Orders.' });
            }
            updateData.approved_by_id = req.user.id;
            updateData.approval_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            // Auto update overall status if approved
            if (updateData.approvalStatus === 'Approved' && !updateData.status) {
                updateData.status = 'Approved'; 
            }
        }

        await PurchaseOrder.update(req.params.id, updateData, req.user.companyId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Receive goods against PO
// @route   PUT /api/procurement/po/:id/receive
// @access  Private (Inventory/Admin)
const receiveGoods = async (req, res) => {
    try {
        const success = await PurchaseOrder.receiveItems(req.params.id, req.body);
        res.json({ success: true, data: { poId: req.params.id, success } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Purchase Requests
const createRequest = async (req, res) => {
    try {
        const id = await PurchaseRequest.create(req.body);
        const newReq = await PurchaseRequest.getById(id);
        res.status(201).json({ success: true, data: newReq });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRequests = async (req, res) => {
    try {
        const requests = await PurchaseRequest.getAll();
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRequest = async (req, res) => {
    try {
        await PurchaseRequest.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Quotes
const createQuote = async (req, res) => {
    try {
        const id = await Quote.create(req.body);
        const newQuote = await Quote.getById(id);
        res.status(201).json({ success: true, data: newQuote });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.getAll();
        res.json({ success: true, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPO,
    getAllPOs,
    getPOById,
    updatePO,
    receiveGoods,
    createRequest,
    getRequests,
    updateRequest,
    createQuote,
    getQuotes
};
