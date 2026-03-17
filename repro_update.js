
require('dotenv').config();
const db = require('./config/db');

async function testUpdate() {
    try {
        console.log('--- Testing Update for ID 10 ---');
        const [rows] = await db.execute('SELECT * FROM users WHERE id = 10');
        const user = rows[0];
        console.log('Current User:', user.id, user.email);

        console.log('Attempting to update ID 10 with same email...');
        const [result] = await db.execute('UPDATE users SET email = ? WHERE id = ?', [user.email, user.id]);
        console.log('Update result:', result.affectedRows);

        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error.message);
        process.exit(1);
    }
}

testUpdate();
