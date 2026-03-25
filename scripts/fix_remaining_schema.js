const db = require('../config/db');

async function fixFinalSchema() {
    console.log('🔄 Fixing missing columns for Multi-Tenancy...');
    
    // 1. Fix 'clients' table
    try {
        const [cols] = await db.execute('SHOW COLUMNS FROM clients');
        const colNames = cols.map(c => c.Field);
        
        if (!colNames.includes('company_id')) {
            console.log('Adding company_id to clients...');
            await db.execute('ALTER TABLE clients ADD COLUMN company_id INT NULL');
        }
        if (!colNames.includes('client_type')) {
            console.log('Adding client_type to clients...');
            await db.execute('ALTER TABLE clients ADD COLUMN client_type ENUM("Personal", "SaaS") DEFAULT "Personal"');
        }
    } catch (e) { console.error('Error on clients:', e.message); }

    // 2. Fix 'inventory_items' vs 'inventory'
    let inventoryTable = 'inventory_items';
    try {
        const [tables] = await db.execute('SHOW TABLES');
        const names = tables.map(t => Object.values(t)[0]);
        if (!names.includes('inventory_items') && names.includes('inventory')) {
            inventoryTable = 'inventory';
        }

        const [iCols] = await db.execute(`SHOW COLUMNS FROM ${inventoryTable}`);
        const iColNames = iCols.map(c => c.Field);
        
        if (!iColNames.includes('company_id')) {
            console.log(`Adding company_id to ${inventoryTable}...`);
            await db.execute(`ALTER TABLE ${inventoryTable} ADD COLUMN company_id INT NULL`);
        }
        if (!iColNames.includes('inventory_type')) {
            console.log(`Adding inventory_type to ${inventoryTable}...`);
            await db.execute(`ALTER TABLE ${inventoryTable} ADD COLUMN inventory_type ENUM("Marketplace", "Client") DEFAULT "Marketplace"`);
        }
    } catch (e) { console.error('Error on inventory:', e.message); }

    console.log('✨ All critical isolation columns verified.');
    process.exit(0);
}

fixFinalSchema();
