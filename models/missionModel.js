const db = require('../config/db');

class Mission {
    static async createFromOrder(orderId, missionData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { mission_type, event_date, notes, destination_type } = missionData;

            // Create mission
            const [result] = await connection.execute(
                'INSERT INTO missions (order_id, mission_type, event_date, notes, destination_type, status) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, mission_type || 'Logistics', event_date || null, notes || null, destination_type || 'Domestic', 'pending']
            );
            const missionId = result.insertId;

            // Fetch order items to convert to mission items
            const [orderItems] = await connection.execute(
                'SELECT * FROM order_items WHERE order_id = ?',
                [orderId]
            );

            // Insert mission items
            for (const item of orderItems) {
                await connection.execute(
                    'INSERT INTO mission_items (mission_id, item_name, qty) VALUES (?, ?, ?)',
                    [missionId, item.name, item.quantity]
                );
            }

            // Update order status
            await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['in_progress', orderId]);

            await connection.commit();
            return missionId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const [rows] = await db.execute(`
            SELECT m.*, o.total_amount, u.name as driver_name, v.plate_number, c.business_name as client_name
            FROM missions m 
            JOIN orders o ON m.order_id = o.id 
            LEFT JOIN users u ON m.assigned_driver = u.id 
            LEFT JOIN vehicles v ON m.vehicle_id = v.id
            LEFT JOIN clients c ON o.company_id = c.id
            ORDER BY m.created_at DESC
        `);

        const results = [];
        for (const row of rows) {
            const [items] = await db.execute(
                'SELECT * FROM mission_items WHERE mission_id = ?',
                [row.id]
            );

            results.push({
                ...row,
                items: items
            });
        }
        return results;
    }

    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT m.*, o.total_amount, u.name as driver_name, v.plate_number, c.business_name as client_name
            FROM missions m 
            JOIN orders o ON m.order_id = o.id 
            LEFT JOIN users u ON m.assigned_driver = u.id 
            LEFT JOIN vehicles v ON m.vehicle_id = v.id 
            LEFT JOIN clients c ON o.company_id = c.id
            WHERE m.id = ?
        `, [id]);

        if (!rows[0]) return null;

        const [items] = await db.execute(
            'SELECT * FROM mission_items WHERE mission_id = ?',
            [id]
        );

        return {
            ...rows[0],
            items: items
        };
    }

    static async assignDriver(id, driverId, vehicleId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Get order_id for this mission to sync with deliveries
            const [missionRows] = await connection.execute('SELECT order_id FROM missions WHERE id = ?', [id]);
            if (!missionRows[0]) {
                throw new Error('Mission not found');
            }
            const orderId = missionRows[0].order_id;

            const [result] = await connection.execute(
                'UPDATE missions SET assigned_driver = ?, vehicle_id = ?, status = ? WHERE id = ?',
                [driverId, vehicleId || null, 'assigned', id]
            );

            // Also manage the deliveries execution table representation using order_id
            const [existingDelivery] = await connection.execute('SELECT id FROM deliveries WHERE order_id = ?', [orderId]);

            if (existingDelivery.length > 0) {
                await connection.execute(
                    'UPDATE deliveries SET driver_id = ?, vehicle_id = ?, status = ? WHERE order_id = ?',
                    [driverId, vehicleId || null, 'accepted', orderId]
                );
            } else {
                await connection.execute(
                    'INSERT INTO deliveries (order_id, driver_id, vehicle_id, status) VALUES (?, ?, ?, ?)',
                    [orderId, driverId, vehicleId || null, 'accepted']
                );
            }

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, updateData) {
        const allowedFields = ['mission_type', 'event_date', 'notes', 'destination_type', 'status', 'assigned_driver', 'vehicle_id', 'start_location', 'end_location'];
        const data = Object.entries(updateData)
            .filter(([key, value]) => value !== undefined && allowedFields.includes(key))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        if (Object.keys(data).length === 0) return true;

        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.execute(`UPDATE missions SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute('UPDATE missions SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await db.execute('UPDATE missions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Mission;
