
require('dotenv').config();
const db = require('./config/db');
const User = require('./models/userModel');

async function verifyFixes() {
    try {
        console.log('--- Verifying Email Collision (ID 8 with ID 10 email) ---');
        try {
            await User.update(8, { email: 'fgsfdg@example.com' });
            console.log('FAILED: Should have thrown duplicate email error');
        } catch (error) {
            console.log('SUCCESS: Caught expected error:', error.message, 'Status:', error.statusCode);
        }

        console.log('\n--- Verifying Same-Row Email Update (ID 10 with ID 10 email) ---');
        try {
            const success = await User.update(10, { email: 'fgsfdg@example.com', name: 'Updated Name' });
            console.log('Update success:', success);
        } catch (error) {
            console.log('FAILED: Should not have thrown error for same-row email update:', error.message);
        }

        console.log('\n--- Verifying Empty Password Sanitization ---');
        const [before] = await db.execute('SELECT password FROM users WHERE id = 10');
        await User.update(10, { password: '   ' }); // Only whitespace
        const [after] = await db.execute('SELECT password FROM users WHERE id = 10');
        if (before[0].password === after[0].password) {
            console.log('SUCCESS: Password remained unchanged for whitespace input');
        } else {
            console.log('FAILED: Password was incorrectly updated/hashed');
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verifyFixes();
