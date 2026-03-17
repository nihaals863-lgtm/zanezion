const db = require('./config/db');

async function listUsers() {
    try {
        const [rows] = await db.query('SELECT id, name, email, role FROM users');
        console.table(rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

listUsers();
