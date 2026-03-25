const db = require('./config/db');

async function describeTables() {
    try {
        const tables = ['orders', 'invoices', 'inventory_items'];
        for (const table of tables) {
            console.log(`--- Table: ${table} ---`);
            const [rows] = await db.execute(`DESCRIBE ${table}`);
            console.table(rows);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

describeTables();
