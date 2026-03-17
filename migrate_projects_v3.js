const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'zanezion_db'
    });

    try {
        console.log('Starting Project Table Migration v3...');

        // 1. Add location column
        await connection.execute('ALTER TABLE projects ADD COLUMN location VARCHAR(255) AFTER end_date');
        console.log('Added location column.');

        console.log('Migration v3 completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
