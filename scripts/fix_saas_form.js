const db = require('../config/db');

async function fixSaasForm() {
    console.log('📝 Adding "add_on" column to subscription_requests...');
    
    try {
        const [cols] = await db.execute('SHOW COLUMNS FROM subscription_requests');
        const colNames = cols.map(c => c.Field);

        if (!colNames.includes('add_on')) {
            await db.execute('ALTER TABLE subscription_requests ADD COLUMN add_on VARCHAR(255) NULL');
            console.log('✅ Column "add_on" added.');
        } else {
            console.log('ℹ️ Column "add_on" already exists.');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
    process.exit();
}

fixSaasForm();
