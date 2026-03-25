const db = require('./config/db');

async function fixUserRole() {
    try {
        console.log('Fixing user s@gmail.com to saas_client...');
        await db.execute('UPDATE users SET role = "saas_client" WHERE email = "s@gmail.com"');
        
        // Also ensure company_id is set to their client record ID (if not already)
        const [clients] = await db.execute('SELECT id FROM clients WHERE user_id = (SELECT id FROM users WHERE email = "s@gmail.com")');
        if (clients.length > 0) {
             const clientId = clients[0].id;
             console.log('Setting company_id/clientId to', clientId);
             await db.execute('UPDATE users SET company_id = ? WHERE email = "s@gmail.com"', [clientId]);
             await db.execute('UPDATE clients SET client_type = "SaaS" WHERE id = ?', [clientId]);
        }
        
        console.log('Done.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixUserRole();
