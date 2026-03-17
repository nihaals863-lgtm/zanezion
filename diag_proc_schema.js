
const db = require('./config/db');
async function check() {
    try {
        const [rows] = await db.execute('SHOW COLUMNS FROM purchase_requests');
        console.log('Columns in purchase_requests:');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
