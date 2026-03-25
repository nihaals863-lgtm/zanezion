const db = require('./config/db');
const fs = require('fs');

async function describeTables() {
    try {
        const tables = ['orders', 'invoices', 'inventory_items'];
        let output = '';
        for (const table of tables) {
            output += `--- Table: ${table} ---\n`;
            const [rows] = await db.execute(`DESCRIBE ${table}`);
            rows.forEach(row => {
               output += `${row.Field} | ${row.Type} | ${row.Null} | ${row.Key}\n`;
            });
            output += '\n';
        }
        fs.writeFileSync('db_schema_summary.txt', output);
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

describeTables();
