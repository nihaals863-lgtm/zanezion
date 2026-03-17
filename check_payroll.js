
require('dotenv').config();
const db = require('./config/db');

async function checkPayroll() {
    try {
        console.log('--- Database Connection ---');
        console.log('DB Config:', process.env.DB_NAME);
        
        const [users] = await db.execute('SELECT id, name FROM users LIMIT 5');
        console.log('Sample Users:', users);

        const [rows] = await db.execute('SELECT * FROM payroll');
        console.log('Payroll Count:', rows.length);
        if (rows.length > 0) {
            console.log('First Record Raw:', rows[0]);
        }

        const [results] = await db.execute(`
            SELECT p.*, u.name as user_name 
            FROM payroll p 
            JOIN users u ON p.user_id = u.id
        `);
        console.log('Joined Payroll Count:', results.length);
        if (results.length > 0) {
            console.log('First Joined Record:', results[0]);
        }

        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
}

checkPayroll();
