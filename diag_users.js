
require('dotenv').config();
const db = require('./config/db');

async function checkAll() {
    try {
        console.log('--- USERS with Role ---');
        const [users] = await db.execute('SELECT id, name, email, role, status, deleted_at FROM users WHERE email = ?', ['fgsfdg@example.com']);
        console.log(JSON.stringify(users, null, 2));
        
        console.log('\n--- ALL USERS Roles ---');
        const [allUsers] = await db.execute('SELECT id, name, email, role, deleted_at FROM users LIMIT 20');
        console.log(JSON.stringify(allUsers, null, 2));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkAll();
