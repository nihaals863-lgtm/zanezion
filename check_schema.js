const db = require('./config/db');

async function checkSchema() {
    try {
        const [cols] = await db.execute('DESCRIBE clients');
        console.log('clients columns:');
        cols.forEach(c => console.log(c.Field));
        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        process.exit(1);
    }
}

checkSchema();
