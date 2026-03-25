const db = require('./config/db');
async function checkUser() {
    try {
        const [rows] = await db.execute('SELECT id, name, email, status, role FROM users');
        console.log('All Users:', rows);
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}
checkUser();
