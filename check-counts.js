const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    // SSL REMOVED FOR LOCAL TEST
};

async function test() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [counts] = await connection.execute('SELECT role_id, COUNT(*) as count FROM role_menu_permissions GROUP BY role_id');
        console.table(counts);
        await connection.end();
    } catch (err) {
        console.error(err.message);
    }
}
test();
