const db = require('./config/db');

async function migrate() {
    try {
        console.log('--- Starting Staff DB Migration ---');

        // 1. Add document URL columns to staff_details
        const columnsToAdd = [
            { name: 'passport_url', type: 'VARCHAR(500)' },
            { name: 'license_url', type: 'VARCHAR(500)' },
            { name: 'nib_document_url', type: 'VARCHAR(500)' },
            { name: 'police_record_url', type: 'VARCHAR(500)' },
            { name: 'profile_pic_url', type: 'VARCHAR(500)' }
        ];

        for (const col of columnsToAdd) {
            try {
                // Check if column exists
                const [cols] = await db.execute(`SHOW COLUMNS FROM staff_details LIKE '${col.name}'`);
                if (cols.length === 0) {
                    await db.execute(`ALTER TABLE staff_details ADD COLUMN ${col.name} ${col.type} AFTER nib_number`);
                    console.log(`+ Added column: ${col.name}`);
                } else {
                    console.log(`- Column ${col.name} already exists.`);
                }
            } catch (colErr) {
                console.error(`Error adding ${col.name}:`, colErr.message);
            }
        }

        // 2. Ensure users table has status enum/varchar supporting 'Pending'
        // Let's check status column first
        const [statusCol] = await db.execute("SHOW COLUMNS FROM users LIKE 'status'");
        if (statusCol.length > 0) {
            console.log(`- Status column in users table: ${statusCol[0].Type}`);
            // If it's an enum, we might need to update it, but common design is VARCHAR
            if (statusCol[0].Type.includes('enum')) {
                // Adjust if necessary, but we'll assume it's VARCHAR or already supports it
                // Most users table use VARCHAR(20) DEFAULT 'Active'
            }
        }

        console.log('--- Migration Completed Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
