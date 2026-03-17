const db = require('../config/db');

class Warehouse {
    static async create(data) {
        const { name, location, manager_id } = data;
        const [result] = await db.execute(
            'INSERT INTO warehouses (name, location, manager_id) VALUES (?, ?, ?)',
            [name, location, manager_id]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM warehouses');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM warehouses WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.execute(`UPDATE warehouses SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await db.execute('UPDATE warehouses SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Warehouse;
