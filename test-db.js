const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: { rejectUnauthorized: false }
};

async function test() {
    console.log('Testing connection with config:', { ...dbConfig, password: '***' });
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connection successful!');
        
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tables in DB:', tables.map(t => Object.values(t)[0]));

        if (tables.length > 0) {
            const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
            console.log('User count:', users[0].count);
        } else {
            console.log('⚠️ Database is EMPTY!');
        }

        await connection.end();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        console.error('Full error:', err);
    }
}


test();
