
require('dotenv').config();
const db = require('./config/db');

async function testQuoteCreate() {
    try {
        console.log('Testing Purchase Quote Creation...');
        const quoteData = {
            vendorId: 1,
            items: [{ name: 'Test Asset', qty: 1, price: 1000 }],
            total: 1000,
            status: 'Active',
            leadTime: '5 Days',
            validity: '2026-04-14'
        };

        const { vendorId, items, total, status, leadTime, validity } = quoteData;
        const [result] = await db.execute(
            'INSERT INTO quotes (vendor_id, items, total, status, lead_time, validity) VALUES (?, ?, ?, ?, ?, ?)',
            [vendorId, JSON.stringify(items), total, status, leadTime, validity]
        );

        console.log('SUCCESS! Created quote ID:', result.insertId);

        const [rows] = await db.execute('SELECT * FROM quotes WHERE id = ?', [result.insertId]);
        console.log('Verifying Record:', rows[0]);

        // Cleanup
        await db.execute('DELETE FROM quotes WHERE id = ?', [result.insertId]);
        console.log('Test record cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error);
        process.exit(1);
    }
}

testQuoteCreate();
