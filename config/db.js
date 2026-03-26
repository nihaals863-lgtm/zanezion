const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Railway uses MYSQLHOST/RAILWAYMYSQL vars internally; fall back to local DB_ vars
const isRailway = !!(process.env.MYSQLHOST || (process.env.DB_HOST && process.env.DB_HOST.includes('rlwy.net')));

const dbConfig = {
    host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
    user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'zanezion_db',
    port:  Number(process.env.MYSQLPORT || process.env.DB_PORT     || 3306),
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    connectTimeout: 30000,
    // Keep connections alive so Railway doesn't drop them (ECONNRESET fix)
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // send keepalive ping every 10s
    // Enable SSL for Railway's public proxy (autorack.proxy.rlwy.net)
    ssl: isRailway ? { rejectUnauthorized: false } : undefined,
};

const pool = mysql.createPool(dbConfig);

// Test connection on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ MySQL connected: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
        connection.release();
    } catch (err) {
        console.error(`❌ MySQL connection failed (${dbConfig.database} @ ${dbConfig.host}):`, err.message);
        console.log('Check Railway MySQL environment variables are correctly set.');
    }
})();

module.exports = pool;
