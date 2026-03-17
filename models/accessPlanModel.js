const db = require('../config/db');

class AccessPlan {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM access_plans ORDER BY price ASC');
        // Parse JSON features for each row
        return rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        }));
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM access_plans WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        };
    }

    static async create(data) {
        const { id, name, tier, price, period, yearly_price, description, features, commitment } = data;
        
        // Use provided ID or generate one
        const planId = id || `plan-${Date.now()}`;
        
        const [result] = await db.execute(
            'INSERT INTO access_plans (id, name, tier, price, period, yearly_price, description, features, commitment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [planId, name, tier || null, price || null, period || null, yearly_price || null, description || null, JSON.stringify(features || []), commitment || null]
        );
        return planId;
    }

    static async update(id, data) {
        const { name, tier, price, period, yearly_price, description, features, commitment } = data;
        const [result] = await db.execute(
            'UPDATE access_plans SET name = ?, tier = ?, price = ?, period = ?, yearly_price = ?, description = ?, features = ?, commitment = ? WHERE id = ?',
            [name, tier || null, price || null, period || null, yearly_price || null, description || null, JSON.stringify(features || []), commitment || null, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM access_plans WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = AccessPlan;
