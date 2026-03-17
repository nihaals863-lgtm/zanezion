const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zanezion_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        const dbName = process.env.DB_NAME || 'zanezion_db';
        console.log(`Successfully connected to MySQL database: ${dbName}`);
        connection.release();
    } catch (err) {
        const host = process.env.DB_HOST || 'localhost';
        const dbName = process.env.DB_NAME || 'zanezion_db';
        console.error(`Error connecting to MySQL database (${dbName}) on host (${host}):`, err.message);
        console.log('Ensure Railway variables (MYSQLHOST, etc.) are set or update your dashboard environment variables.');
    }
})();

module.exports = pool;
