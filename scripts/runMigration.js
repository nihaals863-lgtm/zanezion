const fs = require('fs');
const path = require('path');
const db = require('../config/db'); // Uses connection pool from the app

async function runMigration() {
    try {
        const migrationFile = process.argv[2] || 'rbac_migration.sql';
        const sqlPath = path.isAbsolute(migrationFile) ? migrationFile : path.join(__dirname, migrationFile);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by statement (semicolon)
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

        console.log(`Found ${statements.length} SQL statements to execute.`);

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i].trim();
            if (stmt) {
                console.log(`Executing statement ${i + 1}...`);
                await db.query(stmt);
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

runMigration();
