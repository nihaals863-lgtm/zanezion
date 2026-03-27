const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const dbConfig = {
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'zanezion_db',
    port:  Number(process.env.DB_PORT || 3306),
};

async function check() {
    console.log("Checking DB with config:", { ...dbConfig, password: '***' });
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log("\n--- ROLES ---");
        const [roles] = await connection.execute('SELECT * FROM roles');
        console.table(roles);

        console.log("\n--- USER ROLES (Distinct) ---");
        const [userRoles] = await connection.execute('SELECT DISTINCT role FROM users');
        console.table(userRoles);

        console.log("\n--- MENUS (Sample) ---");
        const [menus] = await connection.execute('SELECT id, name, path FROM menus LIMIT 20');
        console.table(menus);

        console.log("\n--- ROLE MENU PERMISSIONS (Sample) ---");
        const [perms] = await connection.execute(`
            SELECT r.name as role_name, m.name as menu_name, rmp.can_view, rmp.can_add, rmp.can_edit, rmp.can_delete 
            FROM role_menu_permissions rmp
            JOIN roles r ON rmp.role_id = r.id
            JOIN menus m ON rmp.menu_id = m.id
            LIMIT 20
        `);
        console.table(perms);

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

check();
