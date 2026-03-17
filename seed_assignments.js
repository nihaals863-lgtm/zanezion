const db = require('./config/db');

async function sed() {
    try {
        console.log("Seeding test assignments...");
        
        // Use ID 5 which we know is "Field Staff"
        const staffId = 5;
        const staffName = "Field Staff";
        
        // 1. Unassigned Task (Explicitly pass null for assignee_id)
        await db.query(
            'INSERT INTO staff_assignments (assignee_id, task_name, priority, status, description) VALUES (?, ?, ?, ?, ?)',
            [null, 'Package Delivery to South Station', 'High', 'Pending', JSON.stringify({ location: 'South Station', missionType: 'Delivery', pickupTime: '14:00' })]
        );
        
        // 2. Assigned Task for this staff
        await db.query(
            'INSERT INTO staff_assignments (assignee_id, task_name, priority, status, description) VALUES (?, ?, ?, ?, ?)',
            [staffId, 'VIP Guest Escort', 'Critical', 'In Progress', JSON.stringify({ location: 'Lobby', missionType: 'Escort', passengerName: 'John Doe' })]
        );
        
        // 3. Another assigned task
        await db.query(
            'INSERT INTO staff_assignments (assignee_id, task_name, priority, status, description) VALUES (?, ?, ?, ?, ?)',
            [staffId, 'Equipment Maintenance', 'Medium', 'Pending', JSON.stringify({ location: 'Server Room', missionType: 'Service', notes: 'Check cooling fans' })]
        );

        console.log(`Seeded tasks. One unassigned, two for ${staffName} (ID: ${staffId})`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

sed();
