const db = require('../config/db');

class Permission {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM permissions');
        return rows;
    }

    static async create(name, description) {
        const [result] = await db.execute(
            'INSERT INTO permissions (name, description) VALUES (?, ?)',
            [name, description]
        );
        return result.insertId;
    }
}

module.exports = Permission;
