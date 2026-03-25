const db = require('./config/db');

async function addRole() {
    try {
        const [result] = await db.execute(
            "INSERT INTO roles (name, description) VALUES ('saas_client', 'SaaS Client from landing page')"
        );
        console.log('Added saas_client role, id:', result.insertId);
        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        process.exit(1);
    }
}

addRole();
