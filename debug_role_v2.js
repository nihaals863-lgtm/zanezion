const db = require('./config/db');
const fs = require('fs');

async function checkUserRole() {
    try {
        const [rows] = await db.execute('SELECT email, role FROM users WHERE email = "s@gmail.com"');
        fs.writeFileSync('role_out.txt', JSON.stringify(rows));
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

checkUserRole();
