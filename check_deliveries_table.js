const db = require('./config/db');

async function check() {
    try {
        console.log("Checking deliveries table...");
        const [columns] = await db.query('SHOW COLUMNS FROM deliveries');
        console.table(columns);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
