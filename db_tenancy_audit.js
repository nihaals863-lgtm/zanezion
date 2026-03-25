const db = require('./config/db');

async function findTenancyColumns() {
    try {
        const [tables] = await db.execute('SHOW TABLES');
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
                console.log(`--- Table: ${tableName} ---`);
                console.table(matches.map(m => ({ Field: m.Field, Type: m.Type })));
            }
        }
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

findTenancyColumns();
