
require('dotenv').config();
const db = require('./config/db');

async function testCreate() {
    try {
        console.log('Testing Purchase Request Creation...');
        const reqData = {
            requester: 'Test User',
            items: [{ name: 'Test Item', qty: 2, price: 50 }],
            priority: 'High',
            status: 'Pending',
            department: 'IT',
            clientId: 1
        };

        const { requester, items, priority, status, department, clientId } = reqData;
        const [result] = await db.execute(
            'INSERT INTO purchase_requests (requester, items, priority, status, department, client_id) VALUES (?, ?, ?, ?, ?, ?)',
            [requester, JSON.stringify(items), priority, status, department, clientId]
        );

        console.log('SUCCESS! Created record ID:', result.insertId);

        const [rows] = await db.execute('SELECT * FROM purchase_requests WHERE id = ?', [result.insertId]);
        console.log('Verifying Record:', rows[0]);

        // Cleanup
        await db.execute('DELETE FROM purchase_requests WHERE id = ?', [result.insertId]);
        console.log('Test record cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error);
        process.exit(1);
    }
}

testCreate();
