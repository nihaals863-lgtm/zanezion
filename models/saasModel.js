const db = require('../config/db');

class SubscriptionRequest {
    static async create(requestData) {
        const {
            clientName, plan, contact, email, country,
            requirements, propertyType, throughput, addOn, assignedAdminId
        } = requestData;

        const [result] = await db.execute(
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

    static async getAll(assignedAdminId) {
        let query = `
            SELECT id, client_name as clientName, plan, contact, email, country, 
                    requirements, property_type as propertyType, throughput, add_on as addOn,
                    status, request_date as date, assigned_admin_id as assignedAdminId
             FROM subscription_requests 
        `;
        const params = [];

        if (assignedAdminId) {
            // Operations Admin: See their own OR unassigned (NULL) requests
            query += ' WHERE (assigned_admin_id = ? OR assigned_admin_id IS NULL)';
            params.push(assignedAdminId);
        } else if (assignedAdminId === null) {
            // Super Admin: See ALL (no filter)
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute(
            `UPDATE subscription_requests SET status = ? WHERE id = ?`,
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM subscription_requests WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM subscription_requests WHERE id = ?`,
            [id]
        );
        return rows[0];
    }
}

module.exports = SubscriptionRequest;
