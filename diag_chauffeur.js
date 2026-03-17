
require('dotenv').config();
const db = require('./config/db');

async function diagQuery() {
    try {
        console.log('--- Checking Deliveries Table Columns ---');
        const [delCols] = await db.execute('SHOW COLUMNS FROM deliveries');
        console.log(delCols.map(c => c.Field));

        console.log('\n--- Checking Missions Table Columns ---');
        const [missCols] = await db.execute('SHOW COLUMNS FROM missions');
        console.log(missCols.map(c => c.Field));

        console.log('\n--- Checking Orders Table Columns ---');
        const [ordCols] = await db.execute('SHOW COLUMNS FROM orders');
        console.log(ordCols.map(c => c.Field));

        console.log('\n--- Checking Users Table Columns ---');
        const [usrCols] = await db.execute('SHOW COLUMNS FROM users');
        console.log(usrCols.map(c => c.Field));

        console.log('\n--- Testing Refined Join Query ---');
        const query = `
            SELECT 
                d.*, 
                u.name as clientName, 
                dr.name as driverName 
            FROM deliveries d 
            LEFT JOIN orders o ON d.order_id = o.id 
            LEFT JOIN users u ON o.client_id = u.id 
            LEFT JOIN users dr ON d.driver_id = dr.id 
            WHERE d.mission_type = 'Chauffeur'
        `;
        const [rows] = await db.execute(query);
        console.log('Result Count:', rows.length);
        if (rows.length > 0) console.log('First Row Keys:', Object.keys(rows[0]));

        process.exit(0);
    } catch (error) {
        console.error('Diagnostic failed:', error);
        process.exit(1);
    }
}

diagQuery();
