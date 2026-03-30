const db = require('../config/db');

class SubscriptionRequest {
    static async create(requestData) {
        const {
            clientName, plan, contact, email, country,
            requirements, propertyType, throughput, addOn, assignedAdminId
        } = requestData;

        const [result] = await db.query(
            `INSERT INTO subscription_requests (
                client_name, plan, contact, email, country, 
                requirements, property_type, throughput, add_on, status, assigned_admin_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                clientName, plan, contact, email, country || null,
                requirements || null, propertyType || null, throughput || null, addOn || null, 'Pending', assignedAdminId || null
            ]
        );
        return result.insertId;
    }

    static async getAll(assignedAdminId, pagination = {}) {
        const { limit, offset, search } = pagination;
        let query = `
            SELECT id, client_name as clientName, plan, contact, email, country, 
                    requirements, property_type as propertyType, throughput, add_on as addOn,
                    status, request_date as date, assigned_admin_id as assignedAdminId
             FROM subscription_requests 
        `;
        const params = [];
        const conditions = [];

        if (assignedAdminId) {
            conditions.push('(assigned_admin_id = ? OR assigned_admin_id IS NULL)');
            params.push(assignedAdminId);
        }

        if (search) {
            conditions.push('(client_name LIKE ? OR email LIKE ? OR plan LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await db.query(query + ' ORDER BY created_at DESC', params);
        return { rows, total: rows.length };
    }

    static async updateStatus(id, status) {
        const [result] = await db.query(
            `UPDATE subscription_requests SET status = ? WHERE id = ?`,
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query(
            `DELETE FROM subscription_requests WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT * FROM subscription_requests WHERE id = ?`,
            [id]
        );
        return rows[0];
    }
}

module.exports = SubscriptionRequest;
