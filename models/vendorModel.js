const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Vendor {
    static async create(vendorData) {
        const { name, contact, contact_name, email, phone, address, category, password } = vendorData;
        const final_contact = contact_name || contact || null;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            let userId = null;
            if (email && password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const [userResult] = await connection.query(
                    'INSERT INTO users (name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
                    [name, email, phone || null, hashedPassword, 'Vendor', 'Active']
                );
                userId = userResult.insertId;
            }

            const [result] = await connection.query(
                'INSERT INTO vendors (user_id, name, contact_name, email, phone, address, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, name || null, final_contact, email || null, phone || null, address || null, category || null]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    static async getByUserId(userId) {
        const [rows] = await db.query(`
            SELECT v.*, u.role, u.status as auth_status
            FROM vendors v
            LEFT JOIN users u ON v.user_id = u.id
            WHERE v.user_id = ? AND v.deleted_at IS NULL
        `, [userId]);
        return rows[0];
    }

    static async getAll() {
        const [rows] = await db.query(`
            SELECT v.*, u.role, u.status as auth_status
            FROM vendors v
            LEFT JOIN users u ON v.user_id = u.id
            WHERE v.deleted_at IS NULL
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT v.*, u.role, u.status as auth_status
            FROM vendors v
            LEFT JOIN users u ON v.user_id = u.id
            WHERE v.id = ? AND v.deleted_at IS NULL
        `, [id]);
        return rows[0];
    }

    static async update(id, updateData) {
        const userFields = ['name', 'email', 'phone', 'password', 'status'];
        const vendorFields = ['name', 'contact_name', 'email', 'phone', 'address', 'category', 'status'];

        if ('contact' in updateData) {
            updateData.contact_name = updateData.contact_name || updateData.contact;
            delete updateData.contact;
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const userData = {};
            const vendorData = {};

            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            Object.keys(updateData).forEach(key => {
                if (userFields.includes(key)) userData[key] = updateData[key];
                if (vendorFields.includes(key)) vendorData[key] = updateData[key];
            });

            // Get user_id
            const [vendorRows] = await connection.query('SELECT user_id FROM vendors WHERE id = ?', [id]);
            const userId = vendorRows.length > 0 ? vendorRows[0].user_id : null;

            if (userId && Object.keys(userData).length > 0) {
                const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
                await connection.query(`UPDATE users SET ${fields} WHERE id = ?`, [...Object.values(userData), userId]);
            }

            if (Object.keys(vendorData).length > 0) {
                const fields = Object.keys(vendorData).map(key => `${key} = ?`).join(', ');
                await connection.query(`UPDATE vendors SET ${fields} WHERE id = ?`, [...Object.values(vendorData), id]);
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

            const [vendorRows] = await connection.query('SELECT user_id FROM vendors WHERE id = ?', [id]);
            if (vendorRows.length > 0 && vendorRows[0].user_id) {
                await connection.query('UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = "inactive" WHERE id = ?', [vendorRows[0].user_id]);
            }

            const [result] = await connection.query('UPDATE vendors SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

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

module.exports = Vendor;
