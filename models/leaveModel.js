const db = require('../config/db');

class LeaveRequest {
    static async create(data) {
        const { userId, type, start, end, reason } = data;
        const [result] = await db.query(
            'INSERT INTO leave_requests (user_id, type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, type, start, end, reason, 'pending']
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT l.*, u.name FROM leave_requests l JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC');
        return rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            name: row.name,
            type: row.type,
            start: row.start_date.toISOString().split('T')[0],
            end: row.end_date.toISOString().split('T')[0],
            reason: row.reason,
            status: row.status
        }));
    }

    static async update(id, data) {
        const { status } = data;
        await db.query('UPDATE leave_requests SET status = ? WHERE id = ?', [status, id]);
        
        // If approved, update user status to 'on_leave'
        if (status === 'approved' || status === 'Approved') {
            const [rows] = await db.query('SELECT user_id FROM leave_requests WHERE id = ?', [id]);
            if (rows.length > 0) {
                await db.query('UPDATE users SET status = "On Leave" WHERE id = ?', [rows[0].user_id]);
            }
        }
        return true;
    }
}

module.exports = LeaveRequest;
