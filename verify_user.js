const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'zanezion_db',
        port: Number(process.env.DB_PORT || 3306),
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT email, password, role, status FROM users WHERE email = "admin@zanezion.com"');
        console.log('User check result:', rows);
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
