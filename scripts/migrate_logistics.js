const db = require('../config/db');

async function migrateLogistics() {
    console.log('🚛 Starting Logistics & Delivery Schema Upgrade...');
    
    try {
        // 1. Upgrade 'deliveries' table
        const [dCols] = await db.execute('SHOW COLUMNS FROM deliveries');
        const dColNames = dCols.map(c => c.Field);

        const columnsToAdd = [
            { name: 'project_id', type: 'INT NULL' },
            { name: 'order_id', type: 'INT NULL' },
            { name: 'vehicle_id', type: 'INT NULL' },
            { name: 'route_id', type: 'INT NULL' },
            { name: 'mission_type', type: 'VARCHAR(100) DEFAULT "Logistics"' },
            { name: 'passenger_info', type: 'JSON NULL' },
            { name: 'package_details', type: 'JSON NULL' },
            { name: 'destination_type', type: 'VARCHAR(100) DEFAULT "Domestic"' },
            { name: 'route', type: 'JSON NULL' },
            { name: 'custom_route', type: 'TEXT NULL' },
            { name: 'proof_of_delivery_signature', type: 'TEXT NULL' },
            { name: 'proof_of_delivery_photo', type: 'TEXT NULL' },
            { name: 'pod', type: 'JSON NULL' }
        ];

        for (const col of columnsToAdd) {
            if (!dColNames.includes(col.name)) {
                console.log(`+ Adding ${col.name} to deliveries...`);
                await db.execute(`ALTER TABLE deliveries ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        // 2. Ensure 'delivery_items' exists
        await db.execute(`
            CREATE TABLE IF NOT EXISTS delivery_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                delivery_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                qty INT DEFAULT 1,
                weight DECIMAL(10,2),
                length DECIMAL(10,2),
                width DECIMAL(10,2),
                height DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
            )
        `);

        // 3. Ensure 'vehicles' has the right columns
        const [vCols] = await db.execute('SHOW COLUMNS FROM vehicles');
        const vColNames = vCols.map(c => c.Field);
        if (!vColNames.includes('diagnostic_status')) {
            await db.execute('ALTER TABLE vehicles ADD COLUMN diagnostic_status VARCHAR(100) DEFAULT "Healthy"');
        }

        console.log('✨ Logistics Schema is now SYNCHRONIZED.');
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
    }
    process.exit();
}

migrateLogistics();
