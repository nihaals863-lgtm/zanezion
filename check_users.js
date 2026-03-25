const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.execute('SELECT id, name, email, role, status FROM users ORDER BY id DESC LIMIT 10');
        console.table(rows);
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}
check();
