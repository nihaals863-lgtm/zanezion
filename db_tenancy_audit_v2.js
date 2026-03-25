const db = require('./config/db');
const fs = require('fs');

async function findTenancyColumns() {
    try {
        const [tables] = await db.execute('SHOW TABLES');
        let output = '';
        for (const tableRow of tables) {
            const tableName = Object.values(tableRow)[0];
            const [columns] = await db.execute(`DESCRIBE ${tableName}`);
            const matches = columns.filter(c => 
                c.Field.includes('id') || 
                c.Field.includes('company') || 
                c.Field.includes('tenant') || 
                c.Field.includes('client')
            );
            if (matches.length > 0) {
                output += `--- Table: ${tableName} ---\n`;
                matches.forEach(m => output += `${m.Field} | ${m.Type}\n`);
                output += '\n';
            }
        }
        fs.writeFileSync('tenancy_report_v2.txt', output);
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

findTenancyColumns();
