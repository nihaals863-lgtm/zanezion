const Client = require('../models/clientModel');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Super Admin, Operations)
const getClients = async (req, res) => {
    try {
        const clients = await Client.getAll();
        res.json({ success: true, count: clients.length, data: clients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
    try {
        const client = await Client.getById(req.params.id);
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
        res.json({ success: true, data: client });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private (Super Admin, Operations)
const createClient = async (req, res) => {
    try {
        const clientId = await Client.create(req.body);
        const newClient = await Client.getById(clientId);
        res.status(201).json({ success: true, data: newClient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update client
// @route   PATCH /api/clients/:id
// @access  Private (Super Admin, Operations)
const updateClient = async (req, res) => {
    try {
        const success = await Client.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Client not found or no changes made' });
        const updatedClient = await Client.getById(req.params.id);
        res.json({ success: true, data: updatedClient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Super Admin)
const deleteClient = async (req, res) => {
    try {
        const success = await Client.softDelete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Client not found' });
        res.json({ success: true, message: 'Client removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};
