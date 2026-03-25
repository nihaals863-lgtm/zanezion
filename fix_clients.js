const db = require('./config/db');

async function fix() {
    try {
        // Add company_id to clients if missing
        await db.execute('ALTER TABLE clients ADD COLUMN company_id INT NULL AFTER user_id').catch(e => console.log('company_id:', e.message));
        console.log('Fixed clients table');
        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        process.exit(1);
    }
}

fix();
