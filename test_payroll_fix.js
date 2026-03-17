
require('dotenv').config();
const db = require('./config/db');
const { Payroll } = require('./models/financeModel');

async function testMyPayroll() {
    try {
        console.log('Testing My Payroll Retrieval...');
        
        // Use a known user_id from your system or just test the model method
        const userId = 2; // Concierge Manager usually has ID 2 in this DB
        const records = await Payroll.getByUserId(userId);
        
        console.log(`SUCCESS! Retrieved ${records.length} records for User ID ${userId}.`);
        if (records.length > 0) {
            console.log('Sample Record:', records[0]);
        }

        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error);
        process.exit(1);
    }
}

testMyPayroll();
