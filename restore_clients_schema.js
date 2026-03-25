const mysql = require('mysql2/promise');
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
        
        console.log('Creating clients table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NULL,
                address TEXT NULL,
                location VARCHAR(255) NULL,
                source VARCHAR(100) NULL,
                client_type VARCHAR(100) NULL,
                plan VARCHAR(50) DEFAULT 'Starter',
                billing_cycle VARCHAR(50) DEFAULT 'Monthly',
                payment_method VARCHAR(100) NULL,
                contact_person VARCHAR(255) NULL,
                business_name VARCHAR(255) NULL,
                logo_url VARCHAR(255) NULL,
                primary_color VARCHAR(50) NULL,
                tagline VARCHAR(255) NULL,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            )
        `);
        console.log('clients table created successfully.');
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
