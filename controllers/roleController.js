const Role = require('../models/roleModel');

const getRoles = async (req, res) => {
    try {
        const roles = await Role.getAll();
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRolePermissions = async (req, res) => {
    try {
        const permissions = await Role.getPermissions(req.params.id);
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllMenus = async (req, res) => {
    try {
        const menus = await Role.getAllMenus();
        res.json({ success: true, data: menus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const roleId = await Role.create(name, description);
        res.status(201).json({ success: true, data: { id: roleId, name, description } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const assignMenuPermissions = async (req, res) => {
    try {
        // Expected payload: { permissions: [ { menu_id: 1, can_view: true, can_add: false ... }, ... ] }
        const { permissions } = req.body;
        await Role.assignMenuPermissions(req.params.id, permissions);
        res.json({ success: true, message: 'Menu permissions assigned successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getRoles,
    getRolePermissions,
    getAllMenus,
    createRole,
    assignMenuPermissions
};
