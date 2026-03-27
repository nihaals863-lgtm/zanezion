const mysql = require('mysql2/promise');
const path = require('path');
const { normalizeRole } = require('./utils/authUtils');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const dbConfig = {
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'zanezion_db',
    port:  Number(process.env.DB_PORT || 3306),
};

async function verify() {
    console.log("Starting verification of RBAC fix...");
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Test role normalization for diverse role names found in DB
        const testRoles = [
            'Concierge Manager', 
            'Logistics Lead', 
            'Field Staff', 
            'Inventory Manager',
            'operations',
            'SaaS Client'
        ];

        console.log("\n--- Testing Role Normalization ---");
        for (const role of testRoles) {
            const normalized = normalizeRole(role);
            console.log(`Original: "${role}" => Normalized: "${normalized}"`);
            
            // Check if this normalized name exists in the 'roles' table
            const [rows] = await connection.execute('SELECT id FROM roles WHERE name = ?', [normalized]);
            if (rows.length > 0) {
                console.log(`✅ Found in roles table! (ID: ${rows[0].id})`);
                
                // Fetch permissions for this role
                const [perms] = await connection.execute(`
                    SELECT m.name as menu_name, rmp.can_view 
                    FROM menus m 
                    JOIN role_menu_permissions rmp ON m.id = rmp.menu_id 
                    WHERE rmp.role_id = ? AND rmp.can_view = 1
                    LIMIT 3
                `, [rows[0].id]);
                
                if (perms.length > 0) {
                    console.log(`   Permissions found: ${perms.map(p => p.menu_name).join(', ')}...`);
                } else {
                    console.log(`   ⚠️ No view permissions set for this role yet.`);
                }
            } else {
                console.log(`❌ NOT found in roles table. Mapping missing.`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

verify();
