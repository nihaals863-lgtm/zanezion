const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Client {
    static async create(clientData) {
        const {
            name, email, phone, password, address, location, source,
            client_type, plan, billing_cycle, payment_method,
            contact_person, business_name, logo_url, primary_color, tagline,
            status, assigned_admin_id
        } = clientData;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : await bcrypt.hash('Password123!', salt);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Create the user (Core Auth)
            const roleName = client_type === 'SaaS' ? 'SaaS Client' : 'Client';
            const [userResult] = await connection.execute(
                `INSERT INTO users (name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [name, email, phone || null, hashedPassword, roleName, 'Active']
            );
            const userId = userResult.insertId;

            // 2. Create the client record
            const [clientResult] = await connection.execute(
                `INSERT INTO clients (
                    user_id, address, location, source, 
                    client_type, plan, billing_cycle, payment_method, 
                    contact_person, business_name, logo_url, primary_color, tagline,
                    status, company_id, assigned_admin_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId, address || null, location || null, source || 'Manual',
                    client_type || 'Personal', plan || 'Starter', billing_cycle || 'Monthly', payment_method || null,
                    contact_person || null, business_name || null, logo_url || null, primary_color || null, tagline || null,
                    status || 'active', clientData.company_id || null, assigned_admin_id || null
                ]
            );

            // 3. Link the user to the company if it's the first user of the company
            if (client_type === 'SaaS') {
                await connection.execute('UPDATE users SET company_id = ? WHERE id = ?', [clientResult.insertId, userId]);
            }

            await connection.commit();
            return clientResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(companyId, assignedAdminId, pagination = {}) {
        const { limit, offset, search, clientType } = pagination;

        let query = `
            SELECT c.*, u.name, u.email, u.phone, u.role, u.status as auth_status,
            (SELECT COUNT(*) FROM orders o WHERE o.company_id = c.id AND LOWER(o.status) NOT IN ('completed', 'cancelled', 'project_converted')) AS orders
            FROM clients c
            JOIN users u ON c.user_id = u.id
            WHERE c.deleted_at IS NULL
        `;
        const params = [];

        // Filter by client_type (Personal vs SaaS)
        if (clientType) {
            query += ' AND c.client_type = ?';
            params.push(clientType);
        }

        // Filtering Logic
        if (assignedAdminId !== undefined) {
             if (assignedAdminId === null) {
                 // Super Admin: See ALL (no filter by admin)
             } else {
                 // Operations Admin: Only their own clients
                 query += ' AND c.assigned_admin_id = ?';
                 params.push(assignedAdminId);
             }
        }

        if (companyId !== undefined) {
            if (companyId === null) {
                // Super Admin global view - no company filter
            } else {
                // Tenant view: Return their specifically managed end-users/customers
                query += ' AND (c.company_id = ? OR c.id = ?)';
                params.push(companyId, companyId);
            }
        }

        // Search logic
        if (search) {
            query += ' AND (u.name LIKE ? OR u.email LIKE ? OR c.business_name LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        // Get total count BEFORE applying limit/offset
        const [countResult] = await db.execute(`SELECT COUNT(*) as total FROM (${query}) AS subquery`, params);
        const total = countResult[0].total;

        // Apply Pagination
        if (limit !== undefined && offset !== undefined) {
            query += ' LIMIT ? OFFSET ?';
            params.push(Number(limit), Number(offset));
        }

        const [rows] = await db.execute(query, params);
        return { rows, total };
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
