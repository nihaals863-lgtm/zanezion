const pool = require('./config/db');

async function createTable() {
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
    try {
        await pool.query(sql);
        console.log('subscription_requests table created or already exists.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createTable();
