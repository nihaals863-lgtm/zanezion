const pool = require('./config/db');

async function debugDb() {
    try {
        const [dbResult] = await pool.query('SELECT DATABASE() as db');
        console.log('Current Database:', dbResult[0].db);

        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables in database:', tables.map(t => Object.values(t)[0]));

        const sql = `
        CREATE TABLE IF NOT EXISTS subscription_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_name VARCHAR(255) NOT NULL,
            plan VARCHAR(100) NOT NULL,
            contact VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            country VARCHAR(100),
            requirements TEXT,
            property_type VARCHAR(100),
            throughput VARCHAR(50),
            status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
            request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `;
        await pool.query(sql);
        console.log('Ensured subscription_requests table exists.');

        const [tablesAfter] = await pool.query('SHOW TABLES');
        console.log('Tables after creation:', tablesAfter.map(t => Object.values(t)[0]));

        process.exit(0);
    } catch (error) {
        console.error('Debug Error:', error);
        process.exit(1);
    }
}

debugDb();
