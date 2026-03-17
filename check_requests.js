const pool = require('./config/db');

async function checkRequests() {
    try {
        const [rows] = await pool.query('SELECT * FROM subscription_requests');
        console.log('Subscription Requests:');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error fetching requests:', error);
        process.exit(1);
    }
}

checkRequests();
