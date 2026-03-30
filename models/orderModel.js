const db = require('../config/db');

class Order {
    static async create(orderData, items) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Accept both camelCase (frontend) and snake_case field names
            const clientId = orderData.clientId || orderData.client_id || null;
            const companyId = orderData.companyId || orderData.company_id || (clientId && typeof clientId === 'number' ? clientId : null);
            const vendorId = orderData.vendorId || orderData.vendor_id || null;
            const type = orderData.type || 'Custom Order';
            const notes = orderData.notes || null;
            const totalAmount = orderData.total_amount || orderData.total || orderData.totalAmount || 0;
            let status = orderData.status || 'pending_review';
            // Normalize status to match DB ENUM values
            const statusMap = {
                'pending': 'pending_review',
                'pending review': 'pending_review',
                'pending_review': 'pending_review',
                'approved': 'approved',
                'in progress': 'in_progress',
                'in_progress': 'in_progress',
                'completed': 'completed',
                'cancelled': 'cancelled',
                'canceled': 'cancelled',
                'project_converted': 'project_converted',
                'delivered': 'completed'
            };
            status = statusMap[status.toLowerCase()] || 'pending_review';

            const dueDate = orderData.dueDate || orderData.due_date || null;
            const orderDate = orderData.requestDate || orderData.orderDate || orderData.order_date || new Date().toISOString().split('T')[0];

            // Use a default user for client_id (required FK to users table)
            let userClientId = null;
            if (clientId) {
                // Determine if clientId represents a users.id or clients.id
                // typically, we assume it's a clients.id coming from the frontend dropdown
                const [clientRows] = await connection.query(
                    'SELECT user_id FROM clients WHERE id = ? LIMIT 1', [clientId]
                );
                if (clientRows.length > 0) {
                    userClientId = clientRows[0].user_id;
                } else { // It might already be a user id, let's verify
                    const [userRows] = await connection.query(
                        'SELECT id FROM users WHERE id = ? LIMIT 1', [clientId]
                    );
                    if (userRows.length > 0) userClientId = userRows[0].id;
                }
            }

            if (!userClientId) {
                const [fallbackRows] = await connection.query('SELECT id FROM users LIMIT 1');
                userClientId = fallbackRows.length > 0 ? fallbackRows[0].id : 1;
            }

            const [orderResult] = await connection.query(
                'INSERT INTO orders (client_id, company_id, vendor_id, type, notes, total_amount, status, due_date, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userClientId, companyId || null, vendorId || null, type, notes, totalAmount, status, dueDate, orderDate]
            );
            const orderId = orderResult.insertId;

            // Insert Items
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    const item_id = item.item_id || item.id || null;
                    const name = item.name || item.product || null;
                    const quantity = item.quantity || item.qty || 0;
                    const unit_price = item.unit_price || item.price || 0;
                    const totalPrice = quantity * unit_price;

                    await connection.query(
                        'INSERT INTO order_items (order_id, item_id, name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
                        [orderId, (typeof item_id === 'number' ? item_id : null), name, quantity, unit_price, totalPrice]
                    );
                }
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(companyId, pagination = {}) {
        const { limit, offset, status, search } = pagination;

        let query = `
            SELECT o.*, COALESCE(c.business_name, u.name) AS client_name, c.client_type, v.name AS vendor_name 
             FROM orders o 
             LEFT JOIN clients c ON o.company_id = c.id 
             LEFT JOIN users u ON o.client_id = u.id
             LEFT JOIN vendors v ON o.vendor_id = v.id
             WHERE o.deleted_at IS NULL
        `;
        const params = [];

        if (companyId !== undefined && companyId !== null) {
            query += ' AND o.company_id = ?';
            params.push(companyId);
        }

        if (status && status !== 'All') {
            if (status === 'Active') {
                query += ' AND o.status != "Delivered"';
            } else if (status === 'Closed') {
                query += ' AND o.status = "Delivered"';
            } else {
                query += ' AND o.status = ?';
                params.push(status);
            }
        }

        if (search) {
            query += ' AND (o.id LIKE ? OR c.business_name LIKE ? OR u.name LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        // Get total count BEFORE applying limit/offset
        const [countResult] = await db.query(`SELECT COUNT(*) as total FROM (${query}) AS subquery`, params);
        const total = countResult[0].total;

        query += ' ORDER BY o.created_at DESC';

        // Apply Pagination
        if (limit !== undefined && offset !== undefined) {
            query += ' LIMIT ? OFFSET ?';
            params.push(Number(limit), Number(offset));
        }

        const [rows] = await db.query(query, params);
        const results = [];
        for (const row of rows) {
            const [items] = await db.query(
                `SELECT oi.*, COALESCE(ii.name, oi.name) as item_name 
                 FROM order_items oi 
                 LEFT JOIN inventory_items ii ON oi.item_id = ii.id 
                 WHERE oi.order_id = ?`,
                [row.id]
            );
            results.push({
                ...row,
                clientId: row.company_id || row.client_id,
                client: row.client_name || 'Individual Client',
                vendor: row.vendor_name || 'N/A',
                total: Number(row.total_amount || 0),
                items: items.map(i => ({
                    id: i.id,
                    name: i.item_name || 'Item',
                    qty: i.quantity,
                    price: Number(i.unit_price || 0),
                    total: Number(i.total_price || 0)
                }))
            });
        }
        return { rows: results, total };
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT o.*, COALESCE(c.business_name, u.name) AS client_name, c.client_type, v.name AS vendor_name 
             FROM orders o 
             LEFT JOIN clients c ON o.company_id = c.id 
             LEFT JOIN users u ON o.client_id = u.id
             LEFT JOIN vendors v ON o.vendor_id = v.id
             WHERE o.id = ? AND o.deleted_at IS NULL`, [id]
        );
        if (!rows[0]) return null;
        const row = rows[0];

        const [items] = await db.query(
            `SELECT oi.*, COALESCE(ii.name, oi.name) as item_name 
             FROM order_items oi 
             LEFT JOIN inventory_items ii ON oi.item_id = ii.id 
             WHERE oi.order_id = ?`, [id]
        );
        return {
            ...row,
            clientId: row.company_id || row.client_id,
            client: row.client_name || 'Individual Client',
            vendor: row.vendor_name || 'N/A',
            total: Number(row.total_amount || 0),
            items: items.map(i => ({
                id: i.id,
                name: i.item_name || 'Item',
                qty: i.quantity,
                price: Number(i.unit_price || 0),
                total: Number(i.total_price || 0)
            }))
        };
    }

    static async updateStatus(id, status) {
        const statusMap = {
            'pending': 'pending_review', 'pending review': 'pending_review', 'pending_review': 'pending_review',
            'approved': 'approved', 'in progress': 'in_progress', 'in_progress': 'in_progress',
            'completed': 'completed', 'cancelled': 'cancelled', 'canceled': 'cancelled',
            'project_converted': 'project_converted', 'delivered': 'completed'
        };
        const normalizedStatus = statusMap[(status || '').toLowerCase()] || status;
        const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [normalizedStatus, id]);
        return result.affectedRows > 0;
    }

    static async update(id, updateData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const allowedFields = ['client_id', 'company_id', 'vendor_id', 'type', 'notes', 'total_amount', 'status', 'due_date', 'order_date'];

            // Normalize status to match DB ENUM
            let normalizedStatus = updateData.status;
            if (normalizedStatus) {
                const statusMap = {
                    'pending': 'pending_review', 'pending review': 'pending_review', 'pending_review': 'pending_review',
                    'approved': 'approved', 'in progress': 'in_progress', 'in_progress': 'in_progress',
                    'completed': 'completed', 'cancelled': 'cancelled', 'canceled': 'cancelled',
                    'project_converted': 'project_converted', 'delivered': 'completed'
                };
                normalizedStatus = statusMap[normalizedStatus.toLowerCase()] || normalizedStatus;
            }

            // Sanitize FK IDs - must be valid integers or NULL
            const safeInt = (val) => {
                if (val === null || val === undefined || val === '' || val === 'N/A') return undefined; // skip this field
                const num = parseInt(val);
                return isNaN(num) ? undefined : num;
            };

            // Map camelCase to snake_case if present
            const normalizedData = {
                status: normalizedStatus,
                client_id: safeInt(updateData.clientId || updateData.client_id),
                company_id: safeInt(updateData.companyId || updateData.company_id),
                vendor_id: safeInt(updateData.vendorId || updateData.vendor_id),
                due_date: updateData.dueDate || updateData.due_date,
                order_date: updateData.orderDate || updateData.order_date || updateData.date,
                total_amount: updateData.total || updateData.totalAmount || updateData.total_amount,
                type: updateData.type,
                notes: updateData.notes
            };

            const data = Object.entries(normalizedData)
                .filter(([key, value]) => value !== undefined && allowedFields.includes(key))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

            if (Object.keys(data).length > 0) {
                const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
                const values = [...Object.values(data), id];
                await connection.query(`UPDATE orders SET ${fields} WHERE id = ?`, values);
            }

            // Handle Item Updates if passed: simpler to clear and re-insert given current schema
            if (updateData.items && Array.isArray(updateData.items) && updateData.items.length > 0) {
                await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);
                for (const item of updateData.items) {
                    const name = item.name || item.product || null;
                    const quantity = item.quantity || item.qty || 0;
                    const unit_price = item.unit_price || item.price || 0;
                    const totalPrice = quantity * unit_price;
                    // item_id must reference a valid inventory_items.id or be NULL
                    let itemId = item.item_id || item.id || null;
                    // Validate: if itemId is a string like "ORD-xxx" or non-numeric, set to NULL
                    if (itemId && (typeof itemId === 'string' && isNaN(parseInt(itemId)))) {
                        itemId = null;
                    }
                    await connection.query(
                        'INSERT INTO order_items (order_id, item_id, name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
                        [id, itemId, name, quantity, unit_price, totalPrice]
                    );
                }
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
        const [result] = await db.query('UPDATE orders SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        return this.softDelete(id);
    }
}

class Project {
    static async create(projectData) {
        const { name, description, manager_id, start_date, end_date, location, status, company_id, order_id } = projectData;
        const [result] = await db.query(
            'INSERT INTO projects (name, description, manager_id, start_date, end_date, location, status, company_id, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name || null, description || null, manager_id || null, start_date || null, end_date || null, location || null, status || 'planned', company_id || null, order_id || null]
        );
        return result.insertId;
    }

    static async createFromOrder(orderId, projectData) {
        const { name, description, manager_id, start_date, end_date, location } = projectData;

        // Get company_id from order
        const [orders] = await db.query('SELECT company_id FROM orders WHERE id = ?', [orderId]);
        const company_id = orders[0] ? orders[0].company_id : null;

        const [result] = await db.query(
            'INSERT INTO projects (order_id, company_id, name, description, manager_id, start_date, end_date, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [orderId, company_id || null, name || null, description || null, manager_id || null, start_date || null, end_date || null, location || null, 'planned']
        );

        // Update order status
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['project_converted', orderId]);

        return result.insertId;
    }

    static async getAllProjects(companyId, pagination = {}) {
        const { limit, offset } = pagination;

        let query = `
            SELECT p.*, COALESCE(c.business_name, 'Direct Project') AS client_name 
            FROM projects p
            LEFT JOIN clients c ON p.company_id = c.id
            WHERE p.deleted_at IS NULL
        `;
        const params = [];
        if (companyId) {
            query += ' AND p.company_id = ?';
            params.push(companyId);
        }

        // Get total count BEFORE applying limit/offset
        const [countResult] = await db.query(`SELECT COUNT(*) as total FROM (${query}) AS subquery`, params);
        const total = countResult[0].total;

        query += ' ORDER BY p.created_at DESC';

        // Apply Pagination
        if (limit !== undefined && offset !== undefined) {
            query += ' LIMIT ? OFFSET ?';
            params.push(Number(limit), Number(offset));
        }

        const [rows] = await db.query(query, params);
        return { rows, total };
    }

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT p.*, u.name as manager_name, COALESCE(c.business_name, 'Direct Project') AS client_name 
            FROM projects p 
            LEFT JOIN users u ON p.manager_id = u.id 
            LEFT JOIN clients c ON p.company_id = c.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    static async update(id, updateData) {
        const allowedFields = ['name', 'description', 'manager_id', 'start_date', 'end_date', 'location', 'status', 'company_id', 'order_id'];
        const data = Object.entries(updateData)
            .filter(([key, value]) => value !== undefined && allowedFields.includes(key))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        if (Object.keys(data).length === 0) return true;

        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.query(`UPDATE projects SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await db.query('UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = { Order, Project };
