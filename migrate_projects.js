
require('dotenv').config();
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Adding deleted_at column to projects table...');
        await db.execute('ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMP NULL;');
        console.log('SUCCESS: Column added.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column already exists.');
            process.exit(0);
        }
        console.error('MIGRATION FAILED:', error);
        process.exit(1);
    }
}

migrate();
