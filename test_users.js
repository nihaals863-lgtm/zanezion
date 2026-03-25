const db = require('./config/db');

async function checkUsers() {
    try {
        const connection = await db.getConnection();
        const [users] = await connection.execute('SELECT email, role, deleted_at FROM users');
        console.log(users);
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
