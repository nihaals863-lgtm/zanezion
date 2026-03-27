const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
};

async function test() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected!');
        
        const [cols] = await connection.execute('SHOW COLUMNS FROM access_plans');
        console.log('Columns in access_plans:', cols.map(c => c.Field).join(', '));

        const [rows] = await connection.execute('SELECT * FROM access_plans LIMIT 1');
        console.log('First row keys:', Object.keys(rows[0] || {}).join(', '));
        console.log('First row data:', JSON.stringify(rows[0] || {}, null, 2));

        await connection.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}
test();
