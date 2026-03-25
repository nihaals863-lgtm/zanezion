const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

(async () => {
    const dbConfig = {
        host:     process.env.DB_HOST || '127.0.0.1',
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port:  Number(process.env.DB_PORT || 3306),
        database: process.env.DB_NAME || 'zanezion_db'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        const usersDataStr = fs.readFileSync(path.join(__dirname, 'users_data.json'), 'utf8');
        const users = JSON.parse(usersDataStr);

        const password = '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`Seeding ${users.length} users with password: ${password}`);

        for (const user of users) {
             try {
                // Ensure email uniqueness and standard structure
                await connection.execute(
                    `INSERT INTO users (id, name, email, password, role, status, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        user.id,
                        user.name,
                        user.email,
                        hashedPassword,
                        user.role || 'operations',
                        user.status || 'Active',
                        user.company_id || null
                    ]
                );
                console.log(`Successfully seeded user: ${user.email}`);
             } catch (err) {
                 if (err.code === 'ER_DUP_ENTRY') {
                      console.log(`User already exists: ${user.email}`);
                 } else {
                     throw err;
                 }
             }
        }

        await connection.end();
        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
})();
