const db = require('../config/db');

class SupportTicket {
    static async create(data) {
        const { user_id = null, subject = null, description = null, category = null, priority = null } = data;
        const [result] = await db.query(
            'INSERT INTO support_tickets (user_id, subject, description, category, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, subject, description, category, priority, 'open']
        );
        return result.insertId;
    }

    static async getAll(userId = null) {
        let query = 'SELECT t.*, u.name as user_name FROM support_tickets t JOIN users u ON t.user_id = u.id';
        const params = [];
        if (userId) {
            query += ' WHERE t.user_id = ?';
            params.push(userId);
        }
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT t.*, u.name as user_name FROM support_tickets t JOIN users u ON t.user_id = u.id WHERE t.id = ?', [id]);
        return rows[0] || null;
    }

    static async updateStatus(id, status) {
        const [result] = await db.query('UPDATE support_tickets SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }
}

class Event {
    static async create(data) {
        const {
            name = null,
            description = null,
            location = null,
            event_date = null,
            client_id = null,
            manager_id = null,
            company_id = null,
            status = 'planned',
            guest_count = 0,
            planner_name = null,
            special_notes = null,
            mood_board_url = null
        } = data;
        const [result] = await db.query(
            `INSERT INTO events (name, description, location, event_date, client_id, manager_id, company_id, status, guest_count, planner_name, special_notes, mood_board_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, location, event_date, client_id, manager_id, company_id, status, guest_count, planner_name, special_notes, mood_board_url]
        );
        return result.insertId;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT e.*, c.business_name as client_name, u.name as manager_name
             FROM events e
             LEFT JOIN clients c ON e.client_id = c.id
             LEFT JOIN users u ON e.manager_id = u.id
             WHERE e.id = ?`, [id]
        );
        return rows[0] || null;
    }

    static async getAll(userId) {
        // Each user sees ONLY events they created (manager_id = their user ID)
        const query = `SELECT e.*, c.business_name as client_name, u.name as manager_name
                     FROM events e
                     LEFT JOIN clients c ON e.client_id = c.id
                     LEFT JOIN users u ON e.manager_id = u.id
                     WHERE e.manager_id = ?
                     ORDER BY e.created_at DESC`;
        const [rows] = await db.query(query, [userId]);
        return rows;
    }

    // Super Admin can see ALL events across tenants (for analytics/oversight only)
    static async getAllGlobal() {
        const [rows] = await db.query(
            `SELECT e.*, c.business_name as client_name, u.name as manager_name
             FROM events e
             LEFT JOIN clients c ON e.client_id = c.id
             LEFT JOIN users u ON e.manager_id = u.id
             ORDER BY e.created_at DESC`
        );
        return rows;
    }

    static async update(id, data) {
        const {
            name = null,
            description = null,
            location = null,
            event_date = null,
            client_id = null,
            manager_id = null,
            status = null,
            guest_count = 0,
            planner_name = null,
            special_notes = null,
            mood_board_url = null
        } = data;
        const [result] = await db.query(
            `UPDATE events SET name = ?, description = ?, location = ?, event_date = ?, client_id = ?, manager_id = ?, status = ?, guest_count = ?, planner_name = ?, special_notes = ?, mood_board_url = ?
             WHERE id = ?`,
            [name, description, location, event_date, client_id, manager_id, status, guest_count, planner_name, special_notes, mood_board_url, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

class GuestRequest {
    static async create(data) {
        const { client_id = null, guest = null, requested_by = null, request_details = null, delivery_time = null, priority = null } = data;
        const [result] = await db.query(
            'INSERT INTO guest_requests (client_id, guest, requested_by, request_details, delivery_time, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [client_id, guest, requested_by, request_details, delivery_time, priority, 'pending']
        );
        return result.insertId;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT r.*, u.name as client_name FROM guest_requests r LEFT JOIN users u ON r.client_id = u.id WHERE r.id = ?', [id]);
        return rows[0] || null;
    }

    static async getAll(companyId) {
        let query = 'SELECT r.*, u.name as client_name FROM guest_requests r LEFT JOIN users u ON r.client_id = u.id';
        const params = [];
        if (companyId) {
            query += ' WHERE r.client_id = ?';
            params.push(companyId);
        }
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async update(id, data) {
        const { guest = null, requested_by = null, request_details = null, delivery_time = null, priority = null, status = null } = data;
        const [result] = await db.query(
            'UPDATE guest_requests SET guest = ?, requested_by = ?, request_details = ?, delivery_time = ?, priority = ?, status = ? WHERE id = ?',
            [guest, requested_by, request_details, delivery_time, priority, status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM guest_requests WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

class Audit {
    static async create(data) {
        const { type = null, auditor = null, date = null, accuracy = null, status = null } = data;
        const [result] = await db.query(
            'INSERT INTO audits (type, auditor, date, accuracy, status) VALUES (?, ?, ?, ?, ?)',
            [type, auditor, date, accuracy, status]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM audits ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM audits WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async update(id, data) {
        const { type = null, auditor = null, date = null, accuracy = null, status = null } = data;
        const [result] = await db.query(
            'UPDATE audits SET type = ?, auditor = ?, date = ?, accuracy = ?, status = ? WHERE id = ?',
            [type, auditor, date, accuracy, status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM audits WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = { SupportTicket, Event, GuestRequest, Audit };
