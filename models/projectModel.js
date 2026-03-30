const db = require('../config/db');

class Project {
    static async getAll(company_id = null, pagination = {}) {
        const { limit, offset, search } = pagination;
        let query = 'SELECT * FROM projects';
        const params = [];
        const conditions = [];

        if (company_id !== undefined && company_id !== null) {
            conditions.push('company_id = ?');
            params.push(company_id);
        }

        if (search) {
            conditions.push('(name LIKE ? OR description LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Get total count BEFORE applying limit/offset
        const [countResult] = await db.query(`SELECT COUNT(*) as total FROM (${query}) AS subquery`, params);
        const total = countResult[0].total;

        query += ' ORDER BY created_at DESC';

        if (limit !== undefined && offset !== undefined) {
            query += ' LIMIT ? OFFSET ?';
            params.push(Number(limit), Number(offset));
        }

        const [rows] = await db.query(query, params);
        return { rows, total };
    }

    static async create(data) {
        const { name, client, order_id, manager_id, start_date, end_date, status, description, company_id } = data;
        const [result] = await db.query(
            'INSERT INTO projects (name, order_id, manager_id, start_date, end_date, status, description, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, order_id, manager_id, start_date, end_date, status || 'planned', description, company_id || null]
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
