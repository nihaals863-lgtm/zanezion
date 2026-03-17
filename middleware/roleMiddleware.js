const db = require('../config/db');

const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role ? req.user.role.toLowerCase().trim().replace(/_/g, '').replace(/\s/g, '') : 'unknown';
        const allowedRoles = roles.map(r => r.toLowerCase().trim().replace(/_/g, '').replace(/\s/g, ''));

        if (!req.user || (!allowedRoles.includes(userRole) && !allowedRoles.includes('superadmin') && userRole !== 'superadmin')) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user ? req.user.role : 'unknown'} (mapped to ${userRole}) is not authorized to access this route. Required one of: ${roles.join(', ')}`
            });
        }
        next();
    };
};

/**
 * Middleware to check action-level permissions for a specific menu.
 * Usage: authorizeAction('Orders', 'can_add')
 */
const authorizeAction = (menuName, action) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user?.role?.toLowerCase().replace(/\s+/g, '_');
            if (!userRole) {
                return res.status(403).json({ success: false, message: 'No role found.' });
            }

            // Super admin bypass
            if (userRole === 'super_admin' || userRole === 'superadmin') {
                return next();
            }

            const [rows] = await db.execute(
                `SELECT rmp.${action} as allowed
                 FROM role_menu_permissions rmp
                 JOIN roles r ON r.id = rmp.role_id
                 JOIN menus m ON m.id = rmp.menu_id
                 WHERE r.name = ? AND m.name = ?`,
                [userRole, menuName]
            );

            if (rows.length > 0 && rows[0].allowed) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: `Access denied: You do not have '${action}' permission for '${menuName}'.`
            });
        } catch (error) {
            console.error('authorizeAction error:', error);
            return res.status(500).json({ success: false, message: 'Permission check failed.' });
        }
    };
};

module.exports = { authorize, authorizeAction };
