const db = require('./config/db');
async function check() {
    try {
        const [dCols] = await db.execute('SHOW COLUMNS FROM deliveries');
        console.log('Deliveries columns:', dCols.map(c => c.Field));
        
        try {
            const [vCols] = await db.execute('SHOW COLUMNS FROM vehicles');
            console.log('Vehicles columns:', vCols.map(c => c.Field));
        } catch(e) {}

        process.exit();
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
check();
