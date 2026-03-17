const db = require('../config/db');

class Shift {
    static async clockIn(userId, location) {
        const [result] = await db.execute(
            'INSERT INTO shifts (user_id, clock_in, status, location) VALUES (?, CURRENT_TIMESTAMP, "Active", ?)',
            [userId, location]
        );
        return result.insertId;
    }

    static async clockOut(userId) {
        const [activeShift] = await db.execute(
            'SELECT id, clock_in FROM shifts WHERE user_id = ? AND status = "Active" ORDER BY clock_in DESC LIMIT 1',
            [userId]
        );
        
        if (activeShift.length === 0) return null;

        const shiftId = activeShift[0].id;
        const clockIn = new Date(activeShift[0].clock_in);
        const clockOut = new Date();
        const durationHours = (clockOut - clockIn) / (1000 * 60 * 60);

        await db.execute(
            'UPDATE shifts SET clock_out = CURRENT_TIMESTAMP, duration_hours = ?, status = "Completed" WHERE id = ?',
            [durationHours.toFixed(2), shiftId]
        );
        
        return { shiftId, durationHours };
    }

    static async getByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM shifts WHERE user_id = ? ORDER BY clock_in DESC', [userId]);
        return rows;
    }

    static async getActiveShifts() {
        const [rows] = await db.execute(
            'SELECT s.*, u.name as user_name FROM shifts s JOIN users u ON s.user_id = u.id WHERE s.status = "Active"'
        );
        return rows;
    }
}

module.exports = Shift;
