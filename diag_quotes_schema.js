
const db = require('./config/db');
async function check() {
    try {
        const [rows] = await db.execute('SHOW COLUMNS FROM quotes');
        console.log('Columns in quotes:');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
