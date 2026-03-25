const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function updatePasswords() {
    try {
        const password = '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const connection = await db.getConnection();
        const [users] = await connection.execute('SELECT id, email, password FROM users');
        
        console.log(`Found ${users.length} users. updating passwords to 'password123'...`);

        for (const user of users) {
            await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
            console.log(`Updated password for ${user.email}`);
        }
        
        connection.release();
        console.log('All passwords updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error updating passwords:', error);
        process.exit(1);
    }
}

updatePasswords();
