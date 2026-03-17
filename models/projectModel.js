const db = require('../config/db');

class Project {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        return rows;
    }

    static async create(data) {
        const { name, client, order_id, manager_id, start_date, end_date, status, description } = data;
        const [result] = await db.query(
            'INSERT INTO projects (name, order_id, manager_id, start_date, end_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, order_id, manager_id, start_date, end_date, status || 'planned', description]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        Object.keys(data).forEach(key => {
            if (['name', 'status', 'description', 'start_date', 'end_date', 'manager_id'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });
        values.push(id);
        await db.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
        return true;
    }

    static async delete(id) {
        await db.query('DELETE FROM projects WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Project;
