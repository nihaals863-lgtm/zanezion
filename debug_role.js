const db = require('./config/db');

async function checkUserRole() {
    try {
        const [rows] = await db.execute('SELECT email, role FROM users WHERE email = "s@gmail.com"');
        console.table(rows);
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

checkUserRole();
