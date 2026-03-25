const db = require('./config/db');

async function fixEnum() {
    try {
        console.log('--- Checking Role ENUM ---');
        const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'role'");
        const currentType = rows[0].Type;
        console.log('Current Type:', currentType);

        // If it's an enum and 'staff' is missing, update it
        if (!currentType.includes("'staff'")) {
            console.log("Updating ENUM to include 'staff'...");
            const newType = currentType.replace(')', ",'staff')");
            await db.execute(`ALTER TABLE users MODIFY COLUMN role ${newType}`);
            console.log("ENUM updated successfully!");
        } else {
            console.log("'staff' already exists in ENUM.");
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixEnum();
