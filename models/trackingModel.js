const db = require('../config/db');

class Tracking {
    static async create(data) {
        const { mission_id, delivery_id, asset, location, signal_strength, status, eta, driver_name, vehicle_id, plate_number } = data;
        const [result] = await db.query(
            `INSERT INTO tracking (mission_id, delivery_id, asset, location, signal_strength, status, eta, driver_name, vehicle_id, plate_number)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mission_id || null, delivery_id || null, asset, location || 'En Route', signal_strength || 'Strong', status || 'En Route', eta || 'Calculating...', driver_name || null, vehicle_id || null, plate_number || null]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM tracking ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM tracking WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const allowedFields = ['asset', 'location', 'signal_strength', 'status', 'eta', 'driver_name', 'plate_number'];
        const updates = Object.entries(data)
            .filter(([key, val]) => val !== undefined && allowedFields.includes(key))
            .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

        if (Object.keys(updates).length === 0) return true;

        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), id];
        const [result] = await db.query(`UPDATE tracking SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async updateByMissionId(missionId, data) {
        const allowedFields = ['status', 'signal_strength', 'location', 'eta'];
        const updates = Object.entries(data)
            .filter(([key, val]) => val !== undefined && allowedFields.includes(key))
            .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

        if (Object.keys(updates).length === 0) return true;

        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), missionId];
        const [result] = await db.query(`UPDATE tracking SET ${fields} WHERE mission_id = ?`, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM tracking WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Tracking;
