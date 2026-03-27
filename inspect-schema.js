const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkSchema() {
    const connection = await mysql.createConnection({
        host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
        user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'zanezion_db',
        port:  Number(process.env.MYSQLPORT || process.env.DB_PORT     || 3306),
        ssl: process.env.MYSQLHOST ? { rejectUnauthorized: false } : undefined
    });

    try {
        console.log('Checking schema for subscription_requests...');
        const [rows] = await connection.execute('DESCRIBE subscription_requests');
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Error checking schema:', err.message);
    } finally {
        await connection.end();
    }
}

checkSchema().catch(console.error);
