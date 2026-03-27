const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyRBAC() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    try {
        console.log('--- RBAC Verification Start ---\n');

        const [roles] = await connection.execute('SELECT id, name FROM roles');
        
        for (const role of roles) {
            console.log(`Checking Permissions for Role: ${role.name} (ID: ${role.id})`);
            
            const [perms] = await connection.execute(`
                SELECT m.name as menu_name, m.path, rmp.can_view, rmp.can_add, rmp.can_edit, rmp.can_delete 
                FROM menus m 
                JOIN role_menu_permissions rmp ON m.id = rmp.menu_id 
                WHERE rmp.role_id = ? AND rmp.can_view = 1
            `, [role.id]);

            if (perms.length > 0) {
                console.table(perms);
            } else {
                console.log(' [!] NO VIEW PERMISSIONS DEFINED\n');
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

verifyRBAC().catch(console.error);
