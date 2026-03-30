/**
 * Run all pending migrations against the live database
 * Usage: node run-migrations.js
 *
 * This connects to whatever DB is configured in .env (Railway production)
 */
const db = require('./config/db');

const migrations = [
    {
        name: 'fix_projects_nullable_order_id',
        queries: [
            `ALTER TABLE projects MODIFY COLUMN order_id INT NULL DEFAULT NULL`
        ]
    },
    {
        name: 'fix_missions_status_enum',
        queries: [
            `ALTER TABLE missions MODIFY COLUMN status ENUM('pending', 'assigned', 'in_progress', 'en_route', 'completed', 'failed', 'cancelled') DEFAULT 'pending'`
        ]
    },
    {
        name: 'fix_deliveries_table',
        queries: [
            // Add missing columns (use individual ALTERs for safety - IF NOT EXISTS not supported in all MySQL versions)
            `ALTER TABLE deliveries ADD COLUMN order_id INT NULL`,
            `ALTER TABLE deliveries ADD COLUMN project_id INT NULL`,
            `ALTER TABLE deliveries ADD COLUMN vehicle_id INT NULL`,
            `ALTER TABLE deliveries ADD COLUMN route_id INT NULL`,
            `ALTER TABLE deliveries ADD COLUMN mission_type VARCHAR(100) DEFAULT 'Logistics'`,
            `ALTER TABLE deliveries ADD COLUMN passenger_info JSON NULL`,
            `ALTER TABLE deliveries ADD COLUMN package_details JSON NULL`,
            `ALTER TABLE deliveries ADD COLUMN destination_type VARCHAR(100) DEFAULT 'Domestic'`,
            `ALTER TABLE deliveries ADD COLUMN route VARCHAR(500) NULL`,
            `ALTER TABLE deliveries ADD COLUMN custom_route TEXT NULL`,
            `ALTER TABLE deliveries ADD COLUMN proof_of_delivery_signature TEXT NULL`,
            `ALTER TABLE deliveries ADD COLUMN proof_of_delivery_photo TEXT NULL`,
            `ALTER TABLE deliveries ADD COLUMN pod JSON NULL`,
            // Make mission_id and driver_id nullable
            `ALTER TABLE deliveries MODIFY COLUMN mission_id INT NULL DEFAULT NULL`,
            `ALTER TABLE deliveries MODIFY COLUMN driver_id INT NULL DEFAULT NULL`,
            // Update status to VARCHAR for flexibility
            `ALTER TABLE deliveries MODIFY COLUMN status VARCHAR(50) DEFAULT 'Pending'`,
            // Create delivery_items table
            `CREATE TABLE IF NOT EXISTS delivery_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                delivery_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                qty INT DEFAULT 1,
                weight VARCHAR(50) NULL,
                length DECIMAL(10, 2) NULL,
                width DECIMAL(10, 2) NULL,
                height DECIMAL(10, 2) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
        ]
    },
    {
        name: 'fix_saas_clients_type',
        queries: [
            // Fix existing clients added from SaaS Management that were saved as 'Personal' instead of 'SaaS'
            // Match by: user role is 'SaaS Client' but client_type is 'Personal'
            `UPDATE clients c JOIN users u ON c.user_id = u.id SET c.client_type = 'SaaS' WHERE u.role = 'SaaS Client' AND c.client_type = 'Personal'`
        ]
    }
];

async function runMigrations() {
    console.log('🚀 Starting migrations...\n');

    for (const migration of migrations) {
        console.log(`📦 Running: ${migration.name}`);
        let success = 0, skipped = 0;

        for (const query of migration.queries) {
            try {
                await db.query(query);
                success++;
                console.log(`   ✅ OK`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column')) {
                    skipped++;
                    console.log(`   ⏭️  Skipped (column already exists)`);
                } else if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                    skipped++;
                    console.log(`   ⏭️  Skipped (already applied)`);
                } else {
                    console.log(`   ⚠️  Warning: ${err.message}`);
                    skipped++;
                }
            }
        }
        console.log(`   Done: ${success} applied, ${skipped} skipped\n`);
    }

    console.log('✅ All migrations complete!');
    process.exit(0);
}

runMigrations().catch(err => {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
});
