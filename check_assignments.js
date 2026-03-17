const db = require('./config/db');
const Assignment = require('./models/assignmentModel');

async function check() {
    try {
        const assignments = await Assignment.getAll();
        console.log(`Fetched ${assignments.length} assignments.`);
        console.table(assignments);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
