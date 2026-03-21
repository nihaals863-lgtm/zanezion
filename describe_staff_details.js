const db = require('./config/db');

async function checkSchema() {
    try {
        const [rows] = await db.execute('DESCRIBE staff_details');
        console.log('--- staff_details schema ---');
        console.table(rows);
        
        const [userRows] = await db.execute('DESCRIBE users');
        console.log('--- users schema ---');
        console.table(userRows);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
