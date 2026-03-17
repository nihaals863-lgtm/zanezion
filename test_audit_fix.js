
require('dotenv').config();
const db = require('./config/db');

async function testAuditCreate() {
    try {
        console.log('Testing Audit Creation...');
        const auditData = {
            type: 'Inventory Compliance',
            auditor: 'John Smith',
            date: '2026-03-14',
            accuracy: '98%',
            status: 'Completed'
        };

        const { type, auditor, date, accuracy, status } = auditData;
        const [result] = await db.execute(
            'INSERT INTO audits (type, auditor, date, accuracy, status) VALUES (?, ?, ?, ?, ?)',
            [type, auditor, date, accuracy, status]
        );

        console.log('SUCCESS! Created audit ID:', result.insertId);

        const [rows] = await db.execute('SELECT * FROM audits WHERE id = ?', [result.insertId]);
        console.log('Verifying Record:', rows[0]);

        // Cleanup
        await db.execute('DELETE FROM audits WHERE id = ?', [result.insertId]);
        console.log('Test record cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error);
        process.exit(1);
    }
}

testAuditCreate();
