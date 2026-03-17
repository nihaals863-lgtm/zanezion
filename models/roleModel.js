const db = require('../config/db');

class Role {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM roles');
        return rows;
    }

    static async getPermissions(roleId) {
        // Now using role_menu_permissions
        const [rows] = await db.execute(
            `SELECT m.id, m.name, m.path, m.icon, rmp.can_view, rmp.can_add, rmp.can_edit, rmp.can_delete 
             FROM menus m
             LEFT JOIN role_menu_permissions rmp ON m.id = rmp.menu_id AND rmp.role_id = ?
             ORDER BY m.sort_order ASC`,
            [roleId]
        );
        return rows;
    }

    static async getRoleByName(roleName) {
        const [rows] = await db.execute('SELECT * FROM roles WHERE name = ?', [roleName]);
        return rows[0];
    }

    static async getAllMenus() {
        const [rows] = await db.execute('SELECT * FROM menus ORDER BY sort_order ASC');
        return rows;
    }

    static async create(name, description) {
        const [result] = await db.execute(
            'INSERT INTO roles (name, description) VALUES (?, ?)',
            [name, description]
        );
        return result.insertId;
    }

    static async assignMenuPermissions(roleId, menuPermissions) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Get all valid menu IDs
            const [validMenus] = await connection.execute('SELECT id FROM menus');
            const validMenuIds = new Set(validMenus.map(m => m.id));

            // 2. Clear existing for this role
            await connection.execute('DELETE FROM role_menu_permissions WHERE role_id = ?', [roleId]);

            // 3. Insert new permissions (filtered)
            for (const perm of menuPermissions) {
                if (!validMenuIds.has(perm.menu_id)) {
                    console.warn(`Skipping invalid menu_id: ${perm.menu_id}`);
                    continue;
                }

                await connection.execute(
                    `INSERT INTO role_menu_permissions 
                    (role_id, menu_id, can_view, can_add, can_edit, can_delete) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        roleId, 
                        perm.menu_id, 
                        perm.can_view || false, 
                        perm.can_add || false, 
                        perm.can_edit || false, 
                        perm.can_delete || false
                    ]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Role;
