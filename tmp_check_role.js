const db = require('./config/db');

async function checkAndAddRole() {
    try {
        const [roles] = await db.execute('SELECT * FROM roles WHERE name = "saas_client"');
        if (roles.length === 0) {
            console.log('Adding saas_client role...');
            const [result] = await db.execute('INSERT INTO roles (name, description) VALUES ("saas_client", "Institutional Client Profile (SaaS)")');
            console.log('Role added with ID:', result.insertId);
        } else {
            console.log('Role saas_client already exists.');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkAndAddRole();
