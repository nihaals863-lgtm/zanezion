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
        console.log('✅ Connected to MySQL.');

        const dbName = process.env.DB_NAME || 'zanezion_db';
        
        // Use zanezion_db or create it
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        
        console.log('⚠️  Cleaning up existing tables for a fresh start...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const [tables] = await connection.query('SHOW TABLES');
        const dropQueries = tables.map(r => `DROP TABLE IF EXISTS \`${Object.values(r)[0]}\``).join('; ');
        if (dropQueries) {
            await connection.query(dropQueries);
            console.log('✨ Tables cleaned.');
        }

        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Running schema.sql (this includes fixes and full hashes)...');
        await connection.query(sql);
        console.log('✅ Database initialized successfully with login fixes.');

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        await connection.end();
        console.log('🎉 DONE! You can now login with password: 123456');
    } catch (err) {
        console.error('❌ Error during initialization:', err.message);
        process.exit(1);
    }
})();
