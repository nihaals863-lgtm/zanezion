const db = require('../config/db');

class AuditLog {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
        return rows;
    }

    static async create(data) {
        const { action, table_name, record_id, changed_by, old_values, new_values } = data;
        const [result] = await db.query(
            'INSERT INTO audit_logs (action, table_name, record_id, changed_by, old_values, new_values) VALUES (?, ?, ?, ?, ?, ?)',
            [action, table_name, record_id, changed_by, old_values ? JSON.stringify(old_values) : null, new_values ? JSON.stringify(new_values) : null]
        );
        return result.insertId;
    }
}

module.exports = AuditLog;
