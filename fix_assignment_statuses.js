const db = require('./config/db');

async function fix() {
    try {
        console.log("Fixing staff_assignments table...");
        
        // Update enum to include en_route
        await db.query("ALTER TABLE staff_assignments MODIFY COLUMN status ENUM('pending', 'in_progress', 'en_route', 'completed', 'Pending', 'In Progress', 'En Route', 'Completed') DEFAULT 'pending'");
        
        // Fix empty strings to 'in_progress'
        await db.query("UPDATE staff_assignments SET status = 'in_progress' WHERE status = '' OR status IS NULL OR status = 'In Progress'");
        
        console.log("Success.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
