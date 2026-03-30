const db = require('../config/db');

class LuxuryItem {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM luxury_items ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM luxury_items WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { item_name, owner_name, vault_location, estimated_value, status, notes } = data;
        const [result] = await db.query(
            'INSERT INTO luxury_items (item_name, owner_name, vault_location, estimated_value, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [item_name, owner_name || null, vault_location || null, estimated_value || null, status || 'Stored', notes || null]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { item_name, owner_name, vault_location, estimated_value, status, notes } = data;
        const [result] = await db.query(
            'UPDATE luxury_items SET item_name = ?, owner_name = ?, vault_location = ?, estimated_value = ?, status = ?, notes = ? WHERE id = ?',
            [item_name, owner_name || null, vault_location || null, estimated_value || null, status || 'Stored', notes || null, id]
        );
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE luxury_items SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM luxury_items WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = LuxuryItem;
