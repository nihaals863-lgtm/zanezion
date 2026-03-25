const mysql = require('mysql2/promise');

async function diag() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'zanezion_db',
            password: ''
        });

        const [rows] = await db.execute('SELECT email, role, LENGTH(email) as len FROM users');
        console.log('--- USER REGISTRY CHECK ---');
        console.log(rows);
        
        await db.end();
    } catch (error) {
        console.error('❌ Diag failed:', error.message);
    }
}

diag();
