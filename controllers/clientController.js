const Client = require('../models/clientModel');
const db = require('../config/db');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Super Admin, Operations)
const getClients = async (req, res) => {
    try {
        const role = req.user.role.toLowerCase().replace(/\s/g, '');
        const isGlobalAdmin = ['super_admin', 'superadmin', 'super admin', 'operations'].includes(role);
        const companyId = isGlobalAdmin ? null : req.user.companyId;
        
        // isolation logic
        let assignedAdminId = undefined;
        if (role === 'operations') {
            assignedAdminId = req.user.id;
        } else if (['super_admin', 'superadmin', 'super_admin'].includes(role)) {
            assignedAdminId = null; // Tells model to hide SaaS clients
        }

        const clients = await Client.getAll(companyId, assignedAdminId);
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
        const payload = {
            ...req.body,
            company_id: req.body.companyId || req.body.company_id || (req.user ? (['super_admin', 'superadmin'].includes(req.user.role) ? null : req.user.companyId) : null)
        };
        // If it's a SaaS client and no password is given, we use the default from model or generate one
        const isSaaS = payload.client_type === 'SaaS' || payload.clientType === 'SaaS';
        const rawPassword = payload.password || 'Password123!';

        const clientId = await Client.create(payload);
        const newClient = await Client.getById(clientId);

        const responseData = { success: true, data: newClient };
        if (isSaaS) {
            responseData.credentials = {
                email: newClient.email,
                password: rawPassword
            };
        }

        res.status(201).json(responseData);
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

// @desc    Get SaaS client menu permissions
// @route   GET /api/clients/:id/permissions
// @access  Private (Super Admin)
const getClientMenuPermissions = async (req, res) => {
    try {
        const clientId = req.params.id;
        const [rows] = await db.execute(`
            SELECT m.id, m.name, m.path, m.icon,
                   COALESCE(cmp.can_view, 0) as can_view,
                   COALESCE(cmp.can_add, 0) as can_add,
                   COALESCE(cmp.can_edit, 0) as can_edit,
                   COALESCE(cmp.can_delete, 0) as can_delete
            FROM menus m
            LEFT JOIN client_menu_permissions cmp ON m.id = cmp.menu_id AND cmp.client_id = ?
            ORDER BY m.sort_order, m.id
        `, [clientId]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Save SaaS client menu permissions
// @route   POST /api/clients/:id/permissions
// @access  Private (Super Admin)
const saveClientMenuPermissions = async (req, res) => {
    try {
        const clientId = req.params.id;
        const { permissions } = req.body; // [{ menu_id, can_view, can_add, can_edit, can_delete }]

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            // Clear existing
            await connection.execute('DELETE FROM client_menu_permissions WHERE client_id = ?', [clientId]);
            // Insert new
            for (const p of permissions) {
                await connection.execute(
                    `INSERT INTO client_menu_permissions (client_id, menu_id, can_view, can_add, can_edit, can_delete) VALUES (?, ?, ?, ?, ?, ?)`,
                    [clientId, p.menu_id, p.can_view ? 1 : 0, p.can_add ? 1 : 0, p.can_edit ? 1 : 0, p.can_delete ? 1 : 0]
                );
            }
            await connection.commit();
            res.json({ success: true, message: 'Client permissions saved successfully' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get clients for a specific Operation
// @route   GET /api/clients/operation/:operationId
// @access  Private (Super Admin, Operations)
const getOperationClients = async (req, res) => {
    try {
        const operationId = req.params.operationId;
        const clients = await Client.getAll(null, operationId);
        res.json({ success: true, count: clients.length, data: clients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientMenuPermissions,
    saveClientMenuPermissions,
    getOperationClients
};

