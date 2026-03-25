const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async () => {
    const dbConfig = {
        host:     process.env.DB_HOST || '127.0.0.1',
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port:  Number(process.env.DB_PORT || 3306),
        database: process.env.DB_NAME || 'zanezion_db',
        multipleStatements: true
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        const sql = fs.readFileSync(path.join(__dirname, 'scripts', 'saas_migration.sql'), 'utf8');
        
        const queries = sql.split(/;\s*$/m);
        console.log(`Running schema migration...`);
        for (const q of queries) {
            if (q.trim() === '') continue;
            try {
                await connection.query(q);
            } catch (err) {
                console.log(`Error running migration query: ${err.message}`);
            }
        }

        console.log('Finished migration.');
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('Migration Error:', err.message);
        process.exit(1);
    }
})();
