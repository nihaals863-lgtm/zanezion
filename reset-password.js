const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

async function reset() {
    console.log('Resetting password for admin@zanezion.com in Railway...');
    try {
        const c = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
            ssl: { rejectUnauthorized: false }
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('Password123!', salt);

        const [res] = await c.execute('UPDATE users SET password = ? WHERE email = ?', [hash, 'admin@zanezion.com']);
        console.log('Update result:', res.affectedRows > 0 ? 'Success' : 'User not found');
        
        await c.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

reset();
