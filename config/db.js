const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database: ' + process.env.DB_NAME);
        connection.release();
    } catch (err) {
        console.error('Error connecting to MySQL database:', err.message);
        console.log('Make sure to create the database "' + process.env.DB_NAME + '" and update .env credentials.');
    }
})();

module.exports = pool;
