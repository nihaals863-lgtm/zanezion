const db = require('./config/db');
async function check() {
    const [rows] = await db.execute('SHOW COLUMNS FROM clients');
    console.log('Columns in clients table:', rows.map(r => r.Field));
    process.exit();
}
check();
