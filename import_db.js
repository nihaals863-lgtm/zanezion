const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async () => {
    const dbConfig = {
        host:     process.env.DB_HOST || '127.0.0.1',
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port:  Number(process.env.DB_PORT || 3306),
        multipleStatements: true
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        const dbName = process.env.DB_NAME || 'zanezion_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        
        console.log('Cleaning up existing tables...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const [tables] = await connection.query('SHOW TABLES');
        const dropQueries = tables.map(r => `DROP TABLE IF EXISTS \`${Object.values(r)[0]}\``).join('; ');
        if (dropQueries) {
            await connection.query(dropQueries);
            console.log('Tables cleaned.');
        }

        const sql = fs.readFileSync(path.join(__dirname, 'railway_clean2.sql'), 'utf8');

        console.log('Running railway dump...');
        await connection.query(sql);
        console.log('Database initialized successfully from railway dump.');

        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('Error during initialization:', err.message);
        process.exit(1);
    }
})();
