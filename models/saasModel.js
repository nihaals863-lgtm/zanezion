const db = require('../config/db');

class SubscriptionRequest {
    static async create(requestData) {
        const {
            clientName, plan, contact, email, country,
            requirements, propertyType, throughput, addOn
        } = requestData;

        const [result] = await db.execute(
            `INSERT INTO subscription_requests (
                client_name, plan, contact, email, country, 
                requirements, property_type, throughput, add_on, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                clientName, plan, contact, email, country || null,
                requirements || null, propertyType || null, throughput || null, addOn || null, 'Pending'
            ]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute(
            `SELECT id, client_name as clientName, plan, contact, email, country, 
                    requirements, property_type as propertyType, throughput, add_on as addOn,
                    status, request_date as date 
             FROM subscription_requests 
             ORDER BY created_at DESC`
        );
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
