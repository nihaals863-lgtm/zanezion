const db = require('./config/db');

async function fixStatusEnum() {
    try {
        console.log('--- Checking Status ENUM ---');
        const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'status'");
        const currentType = rows[0].Type;
        console.log('Current Type:', currentType);

        if (currentType.includes('enum') && !currentType.toLowerCase().includes("'pending'")) {
            console.log("Updating ENUM to include 'Pending'...");
            const newType = currentType.replace(')', ",'Pending')");
            await db.execute(`ALTER TABLE users MODIFY COLUMN status ${newType} DEFAULT 'Pending'`);
            console.log("Status ENUM updated successfully!");
        } else {
            console.log("'Pending' already exists in ENUM or is VARCHAR.");
        }
        
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

fixStatusEnum();
