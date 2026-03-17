const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        console.log('Connected to MySQL server successfully.');
        
        const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
        if (rows.length === 0) {
            console.log(`Database "${process.env.DB_NAME}" does not exist. Creating it...`);
            await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database "${process.env.DB_NAME}" created successfully.`);
        } else {
            console.log(`Database "${process.env.DB_NAME}" already exists.`);
        }
        
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
