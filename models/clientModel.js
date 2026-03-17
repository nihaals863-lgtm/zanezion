const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Client {
    static async create(clientData) {
        const { 
            name, email, phone, password, address, location, source, 
            client_type, plan, billing_cycle, payment_method, 
            contact_person, business_name, logo_url, primary_color, tagline,
            status 
        } = clientData;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : await bcrypt.hash('Password123!', salt);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Create the user (Core Auth)
            const [userResult] = await connection.execute(
                `INSERT INTO users (name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [name, email, phone || null, hashedPassword, 'Client', 'Active']
            );
            const userId = userResult.insertId;

            // 2. Create the client record
            const [clientResult] = await connection.execute(
                `INSERT INTO clients (
                    user_id, address, location, source, 
                    client_type, plan, billing_cycle, payment_method, 
                    contact_person, business_name, logo_url, primary_color, tagline,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId, address || null, location || null, source || 'Manual',
                    client_type || 'Personal', plan || 'Starter', billing_cycle || 'Monthly', payment_method || null,
                    contact_person || null, business_name || null, logo_url || null, primary_color || null, tagline || null,
                    status || 'active'
                ]
            );

            await connection.commit();
            return clientResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const [rows] = await db.execute(`
            SELECT c.*, u.name, u.email, u.phone, u.role, u.status as auth_status,
            (SELECT COUNT(*) FROM orders o WHERE o.company_id = c.id AND LOWER(o.status) NOT IN ('completed', 'cancelled', 'project_converted')) AS orders
            FROM clients c 
            JOIN users u ON c.user_id = u.id
            WHERE c.deleted_at IS NULL
        `);
        return rows;
    }

    static async getByUserId(userId) {
        const [rows] = await db.execute(`
            SELECT c.*, u.name, u.email, u.phone, u.role, u.status as auth_status,
            (SELECT COUNT(*) FROM orders o WHERE o.company_id = c.id AND LOWER(o.status) NOT IN ('completed', 'cancelled', 'project_converted')) AS orders
            FROM clients c 
            JOIN users u ON c.user_id = u.id
            WHERE c.user_id = ? AND c.deleted_at IS NULL
        `, [userId]);
        return rows[0];
    }

    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT c.*, u.name, u.email, u.phone, u.role, u.status as auth_status,
            (SELECT COUNT(*) FROM orders o WHERE o.company_id = c.id AND LOWER(o.status) NOT IN ('completed', 'cancelled', 'project_converted')) AS orders
            FROM clients c 
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ? AND c.deleted_at IS NULL
        `, [id]);
        return rows[0];
    }

    static async update(id, updateData) {
        const userFields = ['name', 'email', 'phone', 'password', 'status'];
        const clientFields = [
            'address', 'location', 'source', 'client_type', 'plan', 'billing_cycle', 
            'payment_method', 'contact_person', 'business_name', 'logo_url', 
            'primary_color', 'tagline', 'status'
        ];

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const userData = {};
            const clientData = {};

            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            // Bridge phone mapping if only phone is provided
            if (updateData.phone) userData.phone = updateData.phone;

            Object.keys(updateData).forEach(key => {
                if (userFields.includes(key)) userData[key] = updateData[key];
                if (clientFields.includes(key)) clientData[key] = updateData[key];
            });

            // Get user_id first
            const [clientRows] = await connection.execute('SELECT user_id FROM clients WHERE id = ?', [id]);
            if (clientRows.length === 0) throw new Error('Client not found');
            const userId = clientRows[0].user_id;

            if (Object.keys(userData).length > 0) {
                const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
                await connection.execute(`UPDATE users SET ${fields} WHERE id = ?`, [...Object.values(userData), userId]);
            }

            if (Object.keys(clientData).length > 0) {
                const fields = Object.keys(clientData).map(key => `${key} = ?`).join(', ');
                await connection.execute(`UPDATE clients SET ${fields} WHERE id = ?`, [...Object.values(clientData), id]);
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async softDelete(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Get user_id
            const [clientRows] = await connection.execute('SELECT user_id FROM clients WHERE id = ?', [id]);
            if (clientRows.length > 0) {
                const userId = clientRows[0].user_id;
                // Soft delete user
                await connection.execute('UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = "inactive" WHERE id = ?', [userId]);
            }

            // Soft delete client
            const [result] = await connection.execute('UPDATE clients SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Client;
