const db = require('./config/db');

async function seedData() {
    try {
        console.log("Seeding database with initial data...");

        // 1. Seed Access Plans
        const plans = [
            { id: 'plan-1', name: 'Standard Protocol', tier: 'Standard', price: '99', period: '/month', yearly_price: '999', description: 'Essential access for individual operators.', features: JSON.stringify(['Basic Marketplace Access', 'Standard Logistics', 'Email Support']), commitment: 'No commitment, cancel anytime.' },
            { id: 'plan-2', name: 'Premium Protocol', tier: 'Premium', price: '299', period: '/month', yearly_price: '2990', description: 'Advanced features for growing operations.', features: JSON.stringify(['Priority Marketplace Access', 'Expedited Logistics', '24/7 Phone Support', 'Dedicated Account Manager']), commitment: 'Annual contract required.' },
            { id: 'plan-3', name: 'Institutional Protocol', tier: 'Institutional', price: 'Contact Us', period: '', yearly_price: '', description: 'Custom solutions for large-scale enterprises.', features: JSON.stringify(['White-glove Service', 'Custom API Integrations', 'SLA Guarantees', 'On-site Support']), commitment: 'Custom contract terms.' }
        ];

        for (const plan of plans) {
            await db.execute(
                'INSERT IGNORE INTO access_plans (id, name, tier, price, period, yearly_price, description, features, commitment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [plan.id, plan.name, plan.tier, plan.price, plan.period, plan.yearly_price, plan.description, plan.features, plan.commitment]
            );
        }
        console.log("Access plans seeded.");

        // 2. Seed Luxury Items
        const luxuryItems = [
            { item_name: 'Richard Mille Watch RM-011', owner_name: 'Confidential', vault_location: 'Vault Alpha', estimated_value: '$285K', status: 'Stored', notes: 'Pristine condition' },
            { item_name: 'SY Azure — Tender Keys', owner_name: 'Capt. D. Hayes', vault_location: 'Vault Beta', estimated_value: 'N/A', status: 'In Transit', notes: 'Scheduled for delivery 03/15' },
            { item_name: 'Estate Jewelry Collection', owner_name: 'Lady Morrison', vault_location: 'Vault Alpha', estimated_value: '$620K', status: 'Stored', notes: 'Includes appraisal documents' }
        ];

        for (const item of luxuryItems) {
            await db.execute(
                'INSERT INTO luxury_items (item_name, owner_name, vault_location, estimated_value, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
                [item.item_name, item.owner_name, item.vault_location, item.estimated_value, item.status, item.notes]
            );
        }
        console.log("Luxury items seeded.");

        // 3. Seed initial clients if none exist
        const [clients] = await db.execute('SELECT count(*) as count FROM clients');
        if (clients[0].count === 0) {
           await db.execute("INSERT INTO clients (name, type, email) VALUES ('Goldwynn Residences', 'SaaS', 'pemberton@goldwynn.com')");
           await db.execute("INSERT INTO clients (name, type, email) VALUES ('Bahamas Luxury Estates', 'Personal', 'john@bahamasluxury.com')");
           console.log("Mock clients seeded");
        }

        console.log("Seeding complete.");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seedData();
