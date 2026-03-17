const db = require('../config/db');

const getSystemSettings = async (req, res) => {
    try {
        // Mocking settings as there is no settings table currently in schema.sql
        // In a real scenario, this would fetch from a 'settings' table.
        const settings = {
            companyName: 'ZaneZion Institutional',
            currency: 'USD',
            timezone: 'UTC',
            maintenanceMode: false
        };
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllPermissions = async (req, res) => {
    try {
        const [permissions] = await db.execute('SELECT * FROM permissions');
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRolePermissions = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { roleId, permissions } = req.body; // permissions is an array of IDs
        
        await connection.beginTransaction();
        
        // Remove existing permissions
        await connection.execute('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
        
        // Add new permissions
        for (const permId of permissions) {
            await connection.execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleId, permId]);
        }
        
        await connection.commit();
        res.json({ success: true, message: 'Role permissions updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    getSystemSettings,
    getAllPermissions,
    updateRolePermissions
};
