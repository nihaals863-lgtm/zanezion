const db = require('./config/db');

async function fixTable() {
    try {
        console.log("Altering staff_assignments table...");
        
        // Check current structure first
        const [columns] = await db.query('SHOW COLUMNS FROM staff_assignments');
        console.table(columns);

        // Alter assignee_id to allowing NULL
        await db.query('ALTER TABLE staff_assignments MODIFY COLUMN assignee_id INT NULL');
        
        console.log("Successfully altered table to allow NULL for assignee_id.");
        
        // Re-check structure
        const [newColumns] = await db.query('SHOW COLUMNS FROM staff_assignments');
        console.table(newColumns);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixTable();
