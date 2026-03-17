
require('dotenv').config();
const db = require('./config/db');
const { Event } = require('./models/supportModel');
const { Project } = require('./models/orderModel');

async function testFixes() {
    try {
        console.log('Verifying Support Events API...');
        const events = await Event.getAll();
        console.log(`SUCCESS: Retrieved ${events.length} events without error.`);

        console.log('Verifying Projects API...');
        const projects = await Project.getAllProjects();
        console.log(`SUCCESS: Retrieved ${projects.length} projects without error.`);

        process.exit(0);
    } catch (error) {
        console.error('VERIFICATION FAILED:', error);
        process.exit(1);
    }
}

testFixes();
