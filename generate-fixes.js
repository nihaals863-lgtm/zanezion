const bcrypt = require('bcryptjs');

const users = [
    { name: 'Super Admin', email: 'admin@zanezion.com' },
    { name: 'Concierge Manager', email: 'demo1@example.com' },
    { name: 'Operations Lead', email: 'operation@example.com' }, // Fixed typo: operation
    { name: 'Logistics Lead', email: 'logistics@example.com' }, // Fixed typo: logistics
    { name: 'Field Staff Alpha', email: 'staff@example.com' },
    { name: 'Procurement Officer', email: 'procurement@example.com' },
    { name: 'Inventory Manager', email: 'inventory@example.com' }, // Fixed typo: inventory
    { name: 'Enterprise Client', email: 'client11@example.com' } // Fixed typo: example
];

const password = '123456';

async function generateAll() {
    for (const user of users) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(`-- ${user.name} (${user.email})\nUPDATE users SET email = '${user.email}', password = '${hash}' WHERE id = (SELECT id FROM (SELECT id FROM users WHERE email LIKE '%${user.email.split('@')[0]}%') as t);`);
    }
}

generateAll();
