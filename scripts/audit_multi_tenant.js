const db = require('../config/db');

async function runAuditMigration() {
    console.log('🔄 Starting Platform-Wide Multi-Tenant Audit Migration...');
    
    const tablesToFix = [
        'vehicles',
        'deliveries',
        'routes',
        'purchase_requests',
        'quotes',
        'projects',
        'invoices',
        'vendors'
    ];

    for (const table of tablesToFix) {
        try {
            console.log(`Checking table: ${table}`);
            const [columns] = await db.execute(`SHOW COLUMNS FROM ${table} LIKE 'company_id'`);
            
            if (columns.length === 0) {
                console.log(`  Adding company_id to ${table}...`);
                await db.execute(`ALTER TABLE ${table} ADD COLUMN company_id INT NULL`);
                await db.execute(`ALTER TABLE ${table} ADD CONSTRAINT fk_${table}_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE SET NULL`);
                console.log(`  ✅ ${table} updated.`);
            } else {
                console.log(`  Table ${table} already has company_id.`);
            }
        } catch (error) {
            console.error(`  ❌ Error updating ${table}:`, error.message);
        }
    }

    console.log('✨ Migration Complete. All tables are now multi-tenant aware.');
    process.exit(0);
}

runAuditMigration();
