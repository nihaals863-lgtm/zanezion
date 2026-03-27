const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyIsolation() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    try {
        console.log('--- SaaS Isolation Verification ---\n');

        // Check clients
        const [clients] = await connection.execute('SELECT id, business_name as name, client_type FROM clients WHERE client_type = "SaaS" LIMIT 5');
        
        for (const client of clients) {
            console.log(`Checking Isolation for Client: ${client.name} (ID: ${client.id})`);
            
            // 1. Check associated users
            const [users] = await connection.execute('SELECT id, email, role FROM users WHERE company_id = ?', [client.id]);
            console.log(` > Associated Users: ${users.length}`);

            // 2. Check associated inventory
            const [items] = await connection.execute('SELECT id, name FROM inventory_items WHERE company_id = ? OR client_id = ?', [client.id, client.id]);
            console.log(` > Associated Inventory Items: ${items.length}\n`);
            
            if (items.length > 0) {
                console.log(' Sample Inventory:');
                console.table(items.slice(0, 3));
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

verifyIsolation().catch(console.error);
