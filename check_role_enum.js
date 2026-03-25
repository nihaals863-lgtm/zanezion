const db = require('./config/db');

async function checkStatus() {
    try {
        const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'role'");
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkStatus();
