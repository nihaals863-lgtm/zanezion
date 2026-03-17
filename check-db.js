const pool = require('./config/db');

async function check() {
    try {
        const [rows] = await pool.execute('SHOW TABLES');
        console.log('Database connection successful!');
        console.log('Tables found:', rows.map(r => Object.values(r)[0]));
        process.exit(0);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
}

check();
