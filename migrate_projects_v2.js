const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'zanezion_db'
    });

    try {
        console.log('Starting Project Table Migration v2...');

        // 1. Make order_id nullable
        await connection.execute('ALTER TABLE projects MODIFY order_id INT NULL');
        console.log('Made order_id nullable.');

        // 2. Add company_id column
        await connection.execute('ALTER TABLE projects ADD COLUMN company_id INT AFTER order_id');
        console.log('Added company_id column.');

        // 3. Add Foreign Key for company_id
        await connection.execute('ALTER TABLE projects ADD FOREIGN KEY (company_id) REFERENCES clients(id)');
        console.log('Added foreign key for company_id.');

        // 4. Update existing projects company_id from their orders (if any)
        await connection.execute(`
            UPDATE projects p
            JOIN orders o ON p.order_id = o.id
            SET p.company_id = o.company_id
            WHERE p.order_id IS NOT NULL
        `);
        console.log('Propagated company_id from existing orders.');

        console.log('Migration v2 completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
